import { createElement } from '../utils/dom.js';

export class Navigation {
    constructor({ navContainer, mobileMenuContainer, toggleButton, backdrop, config }) {
        this.navContainer = navContainer;
        this.mobileMenuContainer = mobileMenuContainer;
        this.toggleButton = toggleButton;
        this.backdrop = backdrop;
        const defaultConfig = { left: [], right: {}, mobile: [] };
        this.config = { ...defaultConfig, ...(config || {}) };
        this.isOpen = false;
        this.hamburgerIcon = null;
        this.closeIcon = null;
        this.internalAnchors = [];
    }

    render() {
        this.renderDesktopNavigation();
        this.renderMobileNavigation();
        this.renderToggle();
        this.bindToggleInteractions();
    }

    renderDesktopNavigation() {
        if (!this.navContainer) {
            return;
        }

        this.navContainer.innerHTML = '';

        const leftGroup = createElement('div', {
            classNames: ['nav-left'],
        });

        this.config.left.forEach(linkConfig => {
            leftGroup.appendChild(this.createAnchor(linkConfig));
        });

        const rightGroup = createElement('div', {
            classNames: ['nav-right'],
        });

        if (this.config.right && this.config.right.href) {
            rightGroup.appendChild(this.createAnchor(this.config.right));
        }

        this.navContainer.appendChild(leftGroup);
        this.navContainer.appendChild(rightGroup);
    }

    renderMobileNavigation() {
        if (!this.mobileMenuContainer) {
            return;
        }

        this.mobileMenuContainer.innerHTML = '';
        this.config.mobile.forEach(linkConfig => {
            this.mobileMenuContainer.appendChild(this.createAnchor(linkConfig));
        });
    }

    renderToggle() {
        if (!this.toggleButton) {
            return;
        }

        this.toggleButton.innerHTML = '';
        this.hamburgerIcon = this.createIcon('hamburger');
        this.closeIcon = this.createIcon('close');
        this.closeIcon.style.display = 'none';

        this.toggleButton.appendChild(this.hamburgerIcon);
        this.toggleButton.appendChild(this.closeIcon);
        this.toggleButton.setAttribute('aria-expanded', 'false');
    }

    bindToggleInteractions() {
        if (!this.toggleButton) {
            return;
        }

        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });

        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.toggle(false);
            });
        }
    }

    bindInternalNavigation(onNavigate) {
        const scope = this.navContainer ? this.navContainer.ownerDocument : document;
        const anchors = Array.from(scope.querySelectorAll('a[href^="#"]')).filter(anchor => {
            const target = anchor.getAttribute('href');
            return target && target.length > 1;
        });

        anchors.forEach(anchor => {
            anchor.addEventListener('click', event => {
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (!targetElement) {
                    return;
                }

                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });

                if (typeof onNavigate === 'function') {
                    onNavigate(anchor);
                }
            });
        });

        this.internalAnchors = anchors;
    }

    toggle(forceValue) {
        const shouldOpen = typeof forceValue === 'boolean' ? forceValue : !this.isOpen;
        this.isOpen = shouldOpen;

        if (this.mobileMenuContainer) {
            this.mobileMenuContainer.classList.toggle('show', shouldOpen);
        }

        if (this.backdrop) {
            this.backdrop.classList.toggle('visible', shouldOpen);
        }

        if (this.toggleButton) {
            this.toggleButton.classList.toggle('open', shouldOpen);
            this.toggleButton.setAttribute('aria-expanded', String(shouldOpen));
        }

        if (this.hamburgerIcon && this.closeIcon) {
            this.hamburgerIcon.style.display = shouldOpen ? 'none' : 'block';
            this.closeIcon.style.display = shouldOpen ? 'block' : 'none';
        }
    }

    closeMenu() {
        if (this.isOpen) {
            this.toggle(false);
        }
    }

    isMenuOpen() {
        return this.isOpen;
    }

    getElement() {
        return this.navContainer;
    }

    createAnchor({ label, href, target, rel, download, classNames = [] }) {
        const anchor = createElement('a', {
            classNames,
            attributes: {
                href,
                target,
                rel,
                download: download ? '' : undefined,
            },
            textContent: label,
        });

        return anchor;
    }

    createIcon(type) {
        const svg = createElement('svg', {
            attributes: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: '30',
                height: '30',
                viewBox: '0 0 24 24',
                fill: 'none',
            },
        });

        const path = createElement('path', {
            attributes: this.getIconAttributes(type),
        });

        svg.appendChild(path);
        return svg;
    }

    getIconAttributes(type) {
        if (type === 'close') {
            return {
                d: 'M6 6l12 12M6 18L18 6',
                stroke: 'currentColor',
                'stroke-width': '2',
                'stroke-linecap': 'round',
            };
        }

        return {
            d: 'M3 6h18M3 12h18M3 18h18',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
        };
    }
}
