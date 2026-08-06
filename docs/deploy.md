# Deploying, and rolling back

How the site gets published, and — the part that matters at 4pm on a Friday —
how to take a bad deploy back down.

---

## The two environments

|                        | Staging                                  | Production                                |
| ---------------------- | ---------------------------------------- | ----------------------------------------- |
| Branch                 | `staging`                                | `main`                                    |
| Bucket                 | `hatchet-website-staging`                | `hatchet-website-prod`                    |
| Distribution           | `E3UWU7EREIKJM8`                         | `E2AT8DAYA74FI4`                          |
| URL                    | `https://d316fu3le8ds9x.cloudfront.net/` | `https://hatchet.gg/`                     |
| `DEPLOY_ENV`           | `staging`                                | `production`                              |
| `NEXT_PUBLIC_SITE_URL` | the staging CloudFront domain            | `https://hatchet.gg`                      |
| Password               | yes, basic auth                          | no                                        |
| Search engines         | blanket `Disallow: /`                    | allowed, minus `/styleguide`              |
| Deploys when           | anything is pushed to `staging`          | a human approves, after a merge to `main` |

### ⚠️ A staging build can never be promoted to production

`NEXT_PUBLIC_SITE_URL` is **inlined at build time**. It is written as a literal
string into every `<link rel="canonical">`, every `og:url`, and every
`sitemap.xml` entry in the emitted HTML — it is not read when a page is served.

A staging build therefore contains `d316fu3le8ds9x.cloudfront.net` in ~126
pages. Copying those files to the production bucket would publish a site that
tells Google its real address is the staging CDN, and staging is `Disallow: /`.

**Each environment is built separately, from its own value.** Both workflows
run `scripts/deploy.sh`, which builds from scratch every time. There is no
artifact promotion, and there should never be one.

---

## The normal path

```
edit → push to staging → checks run → staging deploy → look at it
     → PR to main → review → merge → approve → production deploy
```

1. **Push to `staging`.** `deploy-staging.yml` runs the checks and, if they
   pass, publishes. The run summary links the staging URL.
2. **Look at it** on staging. It asks for a password; that is expected.
3. **Open a pull request** from `staging` to `main`. Fill in the template.
4. **Review and merge.** CODEOWNERS requires the technical reviewer.
5. **Approve the deploy.** Merging does _not_ publish. `deploy-production.yml`
   waits on the `production` environment for a named reviewer to click approve.
6. **After the merge, bring `staging` back in line** — see below.

### Re-converging after a merge

`staging` is long-lived. It is never deleted, never reset, never squashed. Once
a `staging` → `main` PR merges, merge `main` back so the two do not drift:

```bash
git checkout main && git pull
git checkout staging
git merge main          # usually a fast-forward, or an empty merge commit
git push
```

Skipping this is what produces a `staging` → `main` PR that claims to change
files nobody touched.

---

## Deploying by hand

Normally CI does this. When you need to do it yourself:

```bash
./scripts/deploy.sh staging
./scripts/deploy.sh production
```

It refuses to run before it can do damage. It checks that `aws` can
authenticate, that `DEPLOY_ENV` and `NEXT_PUBLIC_SITE_URL` do not contradict
the target, that the build emitted **126 pages**, that `out/404.html` exists,
and that nothing references `/_next/image`. Then it uploads hashed assets
first without `--delete`, pages second with `--delete`, invalidates `/*`, and
**waits for the invalidation to finish** before telling you it is done.

You need AWS credentials in your environment (`AWS_PROFILE`, an SSO session, or
access keys). The script never reads or prints a secret.

---

# Rollback

There is **no instant rollback button**. This is S3 and CloudFront, not Vercel.
Rolling back means putting the previous code back and deploying it again — the
same path as any other deploy, roughly **4–6 minutes** end to end.

Read this before you need it.

## What a visitor sees while you roll back

This is the part people get wrong under pressure, so: **the bad version stays
live the whole time you are fixing it.** Nothing goes down, nothing 500s, no
maintenance page appears. Visitors keep seeing the broken page until the
invalidation completes.

That means you have time. A wrong revert deployed quickly is worse than the
right one deployed three minutes later.

| Stage                   | Roughly               | What visitors see                           |
| ----------------------- | --------------------- | ------------------------------------------- |
| `git revert` + push     | 30 s                  | the bad version                             |
| Checks + build in CI    | 2–3 min               | the bad version                             |
| Approve the deploy      | however long you take | the bad version                             |
| S3 sync                 | 20–40 s               | the bad version (CloudFront still holds it) |
| CloudFront invalidation | **1–3 min**           | bad → good, region by region                |
| Done                    | —                     | the good version                            |

During the invalidation the change is **not atomic across the world**. Edge
locations purge independently, so for a minute or two some visitors see the old
version and some the new. Two people looking at the same URL can legitimately
disagree. Wait for the invalidation to report complete before judging it.

## The rollback, step by step

### 1. Find the commit that broke it

```bash
git checkout main && git pull
git log --oneline -10
```

The production deploy record on GitHub (Actions → Deploy to production) names
the exact commit for each run, if you are not sure which one shipped.

### 2. Revert it

```bash
git revert --no-edit <bad-commit-sha>
```

**`git revert`, not `git reset`.** Revert makes a _new_ commit that undoes the
change, so history stays intact and the branch protection on `main` is
satisfied. `reset` rewrites history and cannot be pushed to a protected branch —
you would be stuck.

For a merge commit, name the parent to keep:

```bash
git revert --no-edit -m 1 <merge-commit-sha>
```

For several commits, oldest first:

```bash
git revert --no-edit <oldest-sha>^..<newest-sha>
```

### 3. Get it onto `main`

Branch protection means no direct push. Open a PR:

```bash
git checkout -b revert-<short-description>
git push -u origin revert-<short-description>
```

Then open the PR against `main`, get the review, merge.

> **If it is genuinely urgent** and the reviewer is unreachable, a repository
> admin can temporarily disable branch protection in
> Settings → Branches, push, and **turn it straight back on**. This is a real
> escape hatch and it should feel uncomfortable. Note it in the PR afterwards.

### 4. Approve the production deploy

Actions → Deploy to production → the waiting run → **Review deployments** →
approve. Watch the run. It waits for the invalidation, so when the job goes
green the site is actually serving the reverted build.

### 5. Confirm

```bash
curl -sI https://hatchet.gg/ | head -3
curl -s  https://hatchet.gg/robots.txt          # must NOT be Disallow: /
```

Then open the page that was broken, in a private window — your own browser has
the bad version cached and will lie to you.

## Rolling back to a specific known-good build

When the last good state is several commits back and you do not want to unpick
them individually:

```bash
git checkout main && git pull
git revert --no-edit <good-sha>..HEAD   # undo everything after <good-sha>
```

This still moves _forward_ — it adds commits that undo the range — so history
and branch protection are both fine.

## If a deploy failed halfway

`scripts/deploy.sh` uploads assets first, then pages. If it died between the
two, the bucket holds new JS chunks alongside old HTML. **That state is
harmless**: the old HTML references the old chunks, which are still there
because the asset sync never uses `--delete`.

The fix is to run the deploy again. Do not hand-delete anything from the
bucket.

## What rollback cannot fix

- **A bad WordPress content sync.** Content comes from committed JSON, so
  reverting the commit that ran `pnpm sync:wp` does restore it — but if the
  content was edited in WordPress, fix it there and re-sync.
- **A wrong `NEXT_PUBLIC_SITE_URL`.** Baked into 126 pages. Only a rebuild
  fixes it; there is no header or redirect that papers over it.
- **Anything already crawled.** A production build that briefly emitted
  `Disallow: /`, or wrong canonicals, may have been seen. Check Search Console
  after the revert.

---

## Emergency: take the site down

Not a normal operation, but if something must not be visible at all, point the
CloudFront distribution's default root object at a holding page, or disable the
distribution in the console. **Do not empty the bucket** — you would then have
no rollback target and a full redeploy is the only way back.
