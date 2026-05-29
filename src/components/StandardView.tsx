import { HeroAbout } from './HeroAbout';
import { ExperienceTimeline } from './ExperienceTimeline';
import { ProjectsGrid } from './ProjectsGrid';
import { SkillsCluster } from './SkillsCluster';
import { ContactSection } from './ContactSection';

export function StandardView() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <HeroAbout />
      <ExperienceTimeline />
      <ProjectsGrid />
      <SkillsCluster />
      <ContactSection />
      <div className="h-24" />
    </div>
  );
}
