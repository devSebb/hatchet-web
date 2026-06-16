import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";

type LegalSection = {
  heading: string;
  body: readonly string[];
};

type LegalPageProps = {
  title: string;
  description: string;
  sections: readonly LegalSection[];
};

export function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <main className="bg-background text-foreground">
      <PageHeader eyebrow="Legal" subtitle={description} title={title} />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <article className="border-border bg-card mx-auto grid w-full max-w-4xl gap-10 rounded-xl border p-6 shadow-sm lg:p-10">
          {sections.map((section) => (
            <section className="grid gap-4" key={section.heading}>
              <h2 className="h3">{section.heading}</h2>
              <div className="grid gap-4">
                {section.body.map((paragraph) => (
                  <p className="body text-muted" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
