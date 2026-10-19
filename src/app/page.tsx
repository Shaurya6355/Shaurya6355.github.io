import { ApproachBand } from "@/components/home/ApproachBand";
import { ContactBand } from "@/components/home/ContactBand";
import { ExperienceList } from "@/components/home/ExperienceList";
import { Hero } from "@/components/home/Hero";
import { ProjectList } from "@/components/home/ProjectList";
import { SkillMap } from "@/components/home/SkillMap";
import { ThresholdExplorer } from "@/components/home/ThresholdExplorer";
import { Section } from "@/components/site/Section";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { about, intro } from "@/content/about";
import { education, experience, teaching } from "@/content/experience";
import { projects } from "@/content/projects";
import { isPending } from "@/lib/pending";

export default function HomePage() {
  const mapProjects = projects.map(({ slug, number, title, hue }) => ({ slug, number, title, hue }));

  return (
    <>
      <Hero />

      <Section id="approach" accent="What" rest="I do">
        <div className="prose-body md:text-justify md:hyphens-auto">
          {intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Section>

      <Section
        id="work"
        layout="stacked"
        band
        accent="Selected"
        rest="work"
        intro="Three projects, each written up as a case study: what the problem was, the choices that mattered, and what the evidence does and doesn't support."
      >
        <ProjectList />
      </Section>

      <ApproachBand />

      <Section
        id="methods"
        layout="stacked"
        accent="Methods"
        rest="in practice"
        intro="How the methods I care about connect to the work above. Only connections the case studies support are drawn."
      >
        <SkillMap projects={mapProjects} />
      </Section>

      <Section
        id="experiment"
        layout="stacked"
        band
        accent="A small"
        rest="experiment"
        intro="Every classifier hides a choice: where to draw the line. Move the threshold and watch precision, recall and the two kinds of mistakes trade places."
      >
        <ThresholdExplorer />
      </Section>

      <Section id="experience" accent="Experience">
        <div className="space-y-12">
          <ExperienceList heading="Industry" entries={experience} />
          <ExperienceList heading="Education" entries={education} />
          <ExperienceList heading="Teaching" entries={teaching} />
        </div>
      </Section>

      <Section id="about" band accent="About" rest="me">
        <div className="prose-body">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          {isPending(about.interests) ? (
            <ReviewNote note={about.interests.pending} />
          ) : (
            <p>
              Outside work: <span className="text-ink">{about.interests.join(", ")}</span>.
            </p>
          )}
        </div>
      </Section>

      <ContactBand />
    </>
  );
}
