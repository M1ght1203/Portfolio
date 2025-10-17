import { NavigationController } from './controllers/navigation-controller.js';
import { CarouselController } from './controllers/carousel-controller.js';
import { HeroAnimator } from './components/hero-animator.js';

function bootstrap() {
    const navElement = document.querySelector('.top-nav');
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleButton = document.querySelector('.hamburger-icon');
    const backdrop = document.querySelector('.mobile-backdrop');
    const iconHamburger = document.getElementById('icon-hamburger');
    const iconClose = document.getElementById('icon-close');
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const careerSection = document.getElementById('career');

    const navigationController = new NavigationController({
        navElement,
        mobileMenu,
        toggleButton,
        backdrop,
        iconHamburger,
        iconClose,
        anchorLinks,
        hideStartElement: careerSection,
    });
    navigationController.init();

    const heroSection = document.getElementById('hero');
    const heroText = heroSection ? heroSection.querySelector('.main-text') : null;
    const heroVideo = heroSection ? heroSection.querySelector('.hero-video') : null;

    const heroAnimator = new HeroAnimator({
        heroSection,
        heroText,
        heroVideo,
        fadeTarget: careerSection,
    });
    heroAnimator.init();

    const carouselElement = document.querySelector('.image-carousel');
    const carouselController = carouselElement ? new CarouselController(carouselElement) : null;
    if (carouselController) {
        carouselController.init();
        const handleCarouselResize = () => carouselController.refresh();
        window.addEventListener('resize', handleCarouselResize);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
    bootstrap();
}
