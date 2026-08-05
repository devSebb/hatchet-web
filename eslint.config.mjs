import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design-system publishing toolchain and its generated output (see the
    // matching block in .gitignore). Manually operated, not wired into the
    // build, never reaches the browser. Together these account for every one
    // of the 1377 problems `pnpm lint` reported before this entry existed.
    ".ds-sync/**",
    ".design-sync/**",
    "ds-bundle/**",
    "dist/**",
  ]),
]);

export default eslintConfig;
