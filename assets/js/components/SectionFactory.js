import { TimelineSection } from './TimelineSection.js';
import { CarouselSection } from './CarouselSection.js';
import { ProjectsSection } from './ProjectsSection.js';

const COMPONENT_MAP = {
    timeline: TimelineSection,
    carousel: CarouselSection,
    projects: ProjectsSection,
};

export class SectionFactory {
    static create(sectionConfig) {
        const SectionComponent = COMPONENT_MAP[sectionConfig.type];
        if (!SectionComponent) {
            return null;
        }

        return new SectionComponent(sectionConfig);
    }
}
