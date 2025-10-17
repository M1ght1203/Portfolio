import { Navigation } from '../components/Navigation.js';
import { HeroSection } from '../components/HeroSection.js';
import { SectionFactory } from '../components/SectionFactory.js';
import { NavBehavior } from '../features/NavBehavior.js';
import { CarouselController } from '../features/CarouselController.js';

export class PortfolioApp {
    constructor({ documentRef, content }) {
        this.document = documentRef;
        this.content = content;
        this.contentRoot = this.document.getElementById('contentRoot');
        this.navigation = null;
        this.heroSection = null;
        this.sections = [];
        this.carouselControllers = [];
    }

    init() {
        if (!this.contentRoot) {
            throw new Error('Content root element not found.');
        }

        this.renderNavigation();
        this.renderHero();
        this.renderSections();
        this.bindNavigation();
        this.applyBehaviors();
    }

    renderNavigation() {
        const navContainer = this.document.getElementById('primaryNav');
        const mobileMenuContainer = this.document.getElementById('mobileMenu');
        const toggleButton = this.document.getElementById('mobileMenuToggle');
        const backdrop = this.document.getElementById('mobileMenuBackdrop');

        if (!navContainer) {
            throw new Error('Primary navigation container not found.');
        }

        this.navigation = new Navigation({
            navContainer,
            mobileMenuContainer,
            toggleButton,
            backdrop,
            config: this.content.navigation,
        });

        this.navigation.render();
    }

    renderHero() {
        if (!this.content.hero) {
            return;
        }

        this.heroSection = new HeroSection(this.content.hero);
        const heroElement = this.heroSection.render();
        this.contentRoot.appendChild(heroElement);
    }

    renderSections() {
        const sections = Array.isArray(this.content.sections) ? this.content.sections : [];

        this.sections = sections
            .map(sectionConfig => {
                const component = SectionFactory.create(sectionConfig);
                if (!component) {
                    return null;
                }

                const element = component.render();
                this.contentRoot.appendChild(element);

                return {
                    config: sectionConfig,
                    component,
                    element,
                };
            })
            .filter(Boolean);
    }

    bindNavigation() {
        if (!this.navigation) {
            return;
        }

        this.navigation.bindInternalNavigation(anchor => {
            if (anchor.closest('#mobileMenu')) {
                this.navigation.closeMenu();
            }
        });

        const mobileMenu = this.document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.addEventListener('click', event => {
                if (event.target.closest('a')) {
                    this.navigation.closeMenu();
                }
            });
        }
    }

    applyBehaviors() {
        if (!this.navigation) {
            return;
        }

        const firstContentSection = this.sections[0]?.element || null;
        this.navBehavior = new NavBehavior({
            nav: this.navigation.getElement(),
            heroText: this.heroSection?.getTextElement() || null,
            firstContentSection,
        });

        this.navBehavior.init();

        this.carouselControllers = this.sections
            .map(section => {
                if (typeof section.component.getCarouselElement === 'function') {
                    return new CarouselController(section.component.getCarouselElement());
                }
                return null;
            })
            .filter(Boolean);

        this.carouselControllers.forEach(controller => controller.init());
    }
}
