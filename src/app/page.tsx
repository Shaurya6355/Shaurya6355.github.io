import { ApproachBand } from "@/components/home/ApproachBand";
import { ContactBand } from "@/components/home/ContactBand";
import { ExperienceList } from "@/components/home/ExperienceList";
import { Hero } from "@/components/home/Hero";
import { ProjectList } from "@/components/home/ProjectList";
import { SkillMap } from "@/components/home/SkillMap";
import { Section } from "@/components/site/Section";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { about, intro } from "@/content/about";
import { copy } from "@/content/copy";
import { education, experience, teaching } from "@/content/experience";
import { projects } from "@/content/projects";
import { isPending } from "@/lib/pending";

const sec = copy.sections;

export default function HomePage() {
  const mapProjects = projects.map(({ slug, number, title, hue }) => ({ slug, number, title, hue }));

  return (
    <>
      <Hero />

      <Section id="approach" evidenceId="approach" accent={sec.approach.accent} rest={sec.approach.rest}>
        <div className="prose-body md:text-justify md:hyphens-auto">
          {intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Section>

      <Section
        id="work"
        evidenceId="work"
        layout="stacked"
        band
        accent={sec.work.accent}
        rest={sec.work.rest}
        intro={sec.work.intro}
      >
        <ProjectList />
      </Section>

      <ApproachBand />

      <Section
        id="methods"
        evidenceId="methods"
        layout="stacked"
        accent={sec.methods.accent}
        rest={sec.methods.rest}
        intro={sec.methods.intro}
      >
        <SkillMap projects={mapProjects} />
      </Section>


      <Section id="experience" evidenceId="experience" accent={sec.experience.accent}>
        <div className="space-y-12">
          <ExperienceList heading={sec.experience.industry} entries={experience} />
          <ExperienceList heading={sec.experience.education} entries={education} />
          <ExperienceList heading={sec.experience.teaching} entries={teaching} />
        </div>
      </Section>

      <Section id="about" evidenceId="about" band accent={sec.about.accent} rest={sec.about.rest}>
        <div className="prose-body">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          {isPending(about.interests) ? (
            <ReviewNote note={about.interests.pending} />
          ) : (
            <p>
              {sec.about.interestsPrefix} <span className="text-ink">{about.interests.join(", ")}</span>.
            </p>
          )}
        </div>
      </Section>

      <ContactBand />
    </>
  );
}
