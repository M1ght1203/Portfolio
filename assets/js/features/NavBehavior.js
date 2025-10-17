export class NavBehavior {
    constructor({ nav, heroText, firstContentSection }) {
        this.nav = nav;
        this.heroText = heroText;
        this.firstContentSection = firstContentSection;
        this.scrollDelta = 5;
        this.navHideDelay = 200;
        this.lastScrollY = 0;
        this.navHideTimeout = null;
        this.navScrollThreshold = 0;
        this.navHideStart = 0;
        this.fadeEnd = 0;

        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    init() {
        if (!this.nav) {
            return;
        }

        this.updateMetrics();
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
    }

    updateMetrics() {
        const navHeight = this.nav.offsetHeight || 0;
        const doubledNavHeight = navHeight * 2;
        this.fadeEnd = this.firstContentSection ? this.firstContentSection.offsetTop : window.innerHeight;
        if (!this.fadeEnd || this.fadeEnd < navHeight) {
            this.fadeEnd = window.innerHeight;
        }
        this.navScrollThreshold = Math.max(doubledNavHeight, 120);
        this.navHideStart = Math.max(this.fadeEnd - navHeight, this.navScrollThreshold);
    }

    handleResize() {
        this.updateMetrics();
        this.handleScroll();
    }

    handleScroll() {
        const currentY = Math.max(window.scrollY, 0);

        if (currentY > this.navScrollThreshold) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
            this.nav.classList.remove('hidden');
        }

        if (currentY <= this.navHideStart) {
            window.clearTimeout(this.navHideTimeout);
            this.nav.classList.remove('hidden');
        } else if (currentY > this.lastScrollY + this.scrollDelta) {
            window.clearTimeout(this.navHideTimeout);
            this.navHideTimeout = window.setTimeout(() => {
                if (window.scrollY > this.navHideStart) {
                    this.nav.classList.add('hidden');
                }
            }, this.navHideDelay);
        } else if (currentY < this.lastScrollY - this.scrollDelta) {
            window.clearTimeout(this.navHideTimeout);
            this.nav.classList.remove('hidden');
        }

        this.lastScrollY = currentY;
        this.updateHeroTextState(currentY);
    }

    updateHeroTextState(scrollPosition) {
        if (!this.heroText || !this.fadeEnd) {
            return;
        }

        const progress = Math.min(scrollPosition / this.fadeEnd, 1);
        const fade = Math.min(progress * 1.5, 1);
        const scale = 1 - fade * 0.15;

        this.heroText.style.opacity = String(1 - fade);
        this.heroText.style.transform = `scale(${scale})`;
    }
}
