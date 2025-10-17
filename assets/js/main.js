(function () {
    const headerNav = document.querySelector('.top-nav');
    const heroText = document.querySelector('.hero-section .main-text');
    const firstContentSection = document.querySelector('#career');
    const toggleButton = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const prefersReducedMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : {
              matches: false,
              addEventListener: null,
              removeEventListener: null,
              addListener: null,
              removeListener: null,
          };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    function closeMobileMenu() {
        if (!toggleButton || !mobileMenu || !backdrop) {
            return;
        }

        toggleButton.classList.remove('open');
        toggleButton.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('show');
        backdrop.classList.remove('visible');
        backdrop.setAttribute('hidden', '');
    }

    function openMobileMenu() {
        if (!toggleButton || !mobileMenu || !backdrop) {
            return;
        }

        toggleButton.classList.add('open');
        toggleButton.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('show');
        backdrop.classList.add('visible');
        backdrop.removeAttribute('hidden');
    }

    function setupMobileNavigation() {
        if (!toggleButton || !mobileMenu || !backdrop) {
            return;
        }

        toggleButton.addEventListener('click', () => {
            if (mobileMenu.classList.contains('show')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        backdrop.addEventListener('click', closeMobileMenu);

        mobileMenu.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', closeMobileMenu);
        });
    }

    function setupAnchorScrolling() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', event => {
                const targetId = anchor.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function handleScroll() {
        if (!headerNav) {
            return;
        }

        const scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 80) {
            headerNav.classList.add('scrolled');
        } else {
            headerNav.classList.remove('scrolled');
        }

        if (!heroText || !firstContentSection) {
            return;
        }

        const fadeEnd = Math.max(firstContentSection.offsetTop - headerNav.offsetHeight, window.innerHeight * 0.6);
        const progress = clamp(scrollY / fadeEnd, 0, 1);
        const opacity = 1 - progress;
        const scale = 1 - progress * 0.1;

        heroText.style.opacity = opacity.toFixed(3);
        heroText.style.transform = `scale(${scale.toFixed(3)})`;
    }

    function setupHeroEffects() {
        if (!heroText) {
            return;
        }

        heroText.style.opacity = '1';
        heroText.style.transform = 'scale(1)';
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        handleScroll();
    }

    function setupCarousel() {
        const carousel = document.querySelector('.image-carousel[data-auto-scroll]');
        if (!carousel) {
            return;
        }

        let autoScrollTimer = null;
        const scrollStep = () => {
            if (prefersReducedMotion.matches) {
                return;
            }

            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            if (maxScrollLeft <= 0) {
                return;
            }

            const next = carousel.scrollLeft + carousel.clientWidth;
            if (next >= maxScrollLeft - 1) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollTo({ left: next, behavior: 'smooth' });
            }
        };

        const schedule = () => {
            window.clearTimeout(autoScrollTimer);
            if (prefersReducedMotion.matches) {
                return;
            }
            autoScrollTimer = window.setTimeout(scrollStep, 4500);
        };

        carousel.addEventListener('scroll', () => {
            window.clearTimeout(autoScrollTimer);
            schedule();
        });

        carousel.addEventListener('mouseenter', () => {
            window.clearTimeout(autoScrollTimer);
        });

        carousel.addEventListener('mouseleave', schedule);
        if (typeof prefersReducedMotion.addEventListener === 'function') {
            prefersReducedMotion.addEventListener('change', schedule);
        } else if (typeof prefersReducedMotion.addListener === 'function') {
            prefersReducedMotion.addListener(schedule);
        }

        schedule();
    }

    function setupFooterYear() {
        const yearTarget = document.getElementById('year');
        if (yearTarget) {
            yearTarget.textContent = String(new Date().getFullYear());
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupMobileNavigation();
        setupAnchorScrolling();
        setupHeroEffects();
        setupCarousel();
        setupFooterYear();
    });
})();
