export class HeroAnimator {
    constructor({
        heroSection,
        heroText,
        heroVideo,
        fadeTarget,
    } = {}) {
        this.heroSection = heroSection || null;
        this.heroText = heroText || null;
        this.heroVideo = heroVideo || null;
        this.fadeTarget = fadeTarget || null;

        this.fadeEnd = 1;
        this.scrollHandler = this.handleScroll.bind(this);
        this.resizeHandler = this.updateMetrics.bind(this);
        this.animationEndHandler = this.handleAnimationEnd.bind(this);
        this.iframeLoadHandler = this.handleIframeLoad.bind(this);
    }

    init() {
        if (!this.heroSection || !this.heroText) {
            return false;
        }

        this.updateMetrics();

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        window.addEventListener('resize', this.resizeHandler);

        this.heroText.addEventListener('animationend', this.animationEndHandler);
        this.handleScroll();

        if (this.heroVideo) {
            const iframe = this.heroVideo.querySelector('iframe');
            if (iframe) {
                this.iframe = iframe;
                this.iframe.addEventListener('load', this.iframeLoadHandler, { once: false });
            }
        }

        return true;
    }

    destroy() {
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('resize', this.resizeHandler);

        if (this.heroText) {
            this.heroText.removeEventListener('animationend', this.animationEndHandler);
        }

        if (this.iframe) {
            this.iframe.removeEventListener('load', this.iframeLoadHandler);
            this.iframe = null;
        }
    }

    refresh() {
        this.updateMetrics();
        this.handleScroll();
    }

    handleIframeLoad() {
        if (this.heroVideo) {
            this.heroVideo.classList.add('video-loaded');
        }
    }

    handleAnimationEnd() {
        if (!this.heroText) return;
        this.heroText.style.animation = 'none';
        this.heroText.style.opacity = '1';
        this.heroText.style.transform = 'none';
    }

    updateMetrics() {
        const fadeTargetOffset = this.fadeTarget ? this.fadeTarget.offsetTop : 0;
        const heroOffset = this.heroSection ? this.heroSection.offsetTop : 0;
        this.fadeEnd = Math.max(fadeTargetOffset - heroOffset, 1);
    }

    handleScroll() {
        if (!this.heroText) return;

        const scrollY = Math.max(window.scrollY, 0);
        const heroTop = this.heroSection ? this.heroSection.offsetTop : 0;
        const progress = Math.min(Math.max((scrollY - heroTop) / this.fadeEnd, 0), 1);
        const fade = Math.min(progress * 1.5, 1);
        const scale = 1 - fade * 0.15;

        this.heroText.style.opacity = `${1 - fade}`;
        this.heroText.style.transform = `scale(${scale})`;
    }
}
