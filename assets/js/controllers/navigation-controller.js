export class NavigationController {
    constructor({
        navElement,
        mobileMenu,
        toggleButton,
        backdrop,
        iconHamburger,
        iconClose,
        anchorLinks = [],
        hideStartElement = null,
        scrollDelta = 5,
        hideDelay = 200,
    } = {}) {
        this.navElement = navElement || null;
        this.mobileMenu = mobileMenu || null;
        this.toggleButton = toggleButton || null;
        this.backdrop = backdrop || null;
        this.iconHamburger = iconHamburger || null;
        this.iconClose = iconClose || null;
        this.anchorLinks = Array.from(anchorLinks);
        this.hideStartElement = hideStartElement;
        this.scrollDelta = scrollDelta;
        this.hideDelay = hideDelay;

        this.navScrollThreshold = 120;
        this.navHideStart = 0;
        this.lastScrollY = 0;
        this.navHideTimeout = null;
        this.menuOpen = false;
        this.anchorHandlerMap = new Map();

        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
    }

    init() {
        if (!this.navElement) {
            return false;
        }

        this.setInitialState();
        this.updateNavMetrics();
        this.lastScrollY = window.scrollY;

        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize);
        this.anchorHandlerMap = new Map();
        this.anchorLinks.forEach(link => {
            const handler = event => this.handleAnchorClick(event, link);
            this.anchorHandlerMap.set(link, handler);
            link.addEventListener('click', handler);
        });

        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', this.handleToggleClick);
        }

        if (this.backdrop) {
            this.backdrop.addEventListener('click', this.handleBackdropClick);
        }

        this.handleScroll();
        return true;
    }

    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);

        if (this.toggleButton) {
            this.toggleButton.removeEventListener('click', this.handleToggleClick);
        }

        if (this.backdrop) {
            this.backdrop.removeEventListener('click', this.handleBackdropClick);
        }

        if (this.anchorHandlerMap) {
            this.anchorHandlerMap.forEach((handler, link) => {
                link.removeEventListener('click', handler);
            });
            this.anchorHandlerMap.clear();
        }

        clearTimeout(this.navHideTimeout);
        this.navHideTimeout = null;
    }

    refresh() {
        this.updateNavMetrics();
        this.handleScroll();
    }

    openMenu() {
        if (this.menuOpen) return;
        this.toggleMenu(true);
    }

    closeMenu() {
        if (!this.menuOpen) return;
        this.toggleMenu(false);
    }

    toggleMenu(forceState) {
        const shouldOpen = typeof forceState === 'boolean' ? forceState : !this.menuOpen;
        this.menuOpen = shouldOpen;

        if (this.mobileMenu) {
            this.mobileMenu.classList.toggle('show', shouldOpen);
        }

        if (this.backdrop) {
            this.backdrop.classList.toggle('visible', shouldOpen);
        }

        if (this.toggleButton) {
            this.toggleButton.classList.toggle('open', shouldOpen);
        }

        if (this.iconHamburger) {
            this.iconHamburger.style.display = shouldOpen ? 'none' : 'block';
        }

        if (this.iconClose) {
            this.iconClose.style.display = shouldOpen ? 'block' : 'none';
        }
    }

    setInitialState() {
        if (this.iconHamburger) {
            this.iconHamburger.style.display = 'block';
        }

        if (this.iconClose) {
            this.iconClose.style.display = 'none';
        }

        if (this.toggleButton) {
            this.toggleButton.classList.remove('open');
        }

        if (this.mobileMenu) {
            this.mobileMenu.classList.remove('show');
        }

        if (this.backdrop) {
            this.backdrop.classList.remove('visible');
        }

        this.menuOpen = false;
    }

    updateNavMetrics() {
        if (!this.navElement) return;

        const navHeight = this.navElement.offsetHeight;
        this.navScrollThreshold = Math.max(navHeight * 2, 120);

        const hideStart = this.hideStartElement ? this.hideStartElement.offsetTop - navHeight : this.navScrollThreshold;
        this.navHideStart = Math.max(hideStart, this.navScrollThreshold);
    }

    handleScroll() {
        if (!this.navElement) return;

        const y = Math.max(window.scrollY, 0);

        if (y > this.navScrollThreshold) {
            this.navElement.classList.add('scrolled');
        } else {
            this.navElement.classList.remove('scrolled');
            this.navElement.classList.remove('hidden');
        }

        if (y <= this.navHideStart) {
            clearTimeout(this.navHideTimeout);
            this.navElement.classList.remove('hidden');
        } else if (y > this.lastScrollY + this.scrollDelta) {
            clearTimeout(this.navHideTimeout);
            this.navHideTimeout = setTimeout(() => {
                if (window.scrollY > this.navHideStart) {
                    this.navElement.classList.add('hidden');
                }
            }, this.hideDelay);
        } else if (y < this.lastScrollY - this.scrollDelta) {
            clearTimeout(this.navHideTimeout);
            this.navElement.classList.remove('hidden');
        }

        this.lastScrollY = y;
    }

    handleResize() {
        this.updateNavMetrics();
        this.handleScroll();
    }

    handleToggleClick() {
        this.toggleMenu();
    }

    handleBackdropClick() {
        this.closeMenu();
    }

    handleAnchorClick(event, link) {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) {
            return;
        }

        const elementId = targetId.substring(1);
        if (!elementId) {
            return;
        }

        const targetElement = document.getElementById(elementId);
        if (!targetElement) {
            return;
        }

        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });

        if (link.closest('.mobile-menu')) {
            this.closeMenu();
        }
    }
}
