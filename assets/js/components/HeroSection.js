import { createElement, appendChildren } from '../utils/dom.js';

export class HeroSection {
    constructor({ id, title, subtitle, video }) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.video = video;
        this.sectionElement = null;
        this.textElement = null;
    }

    render() {
        const section = createElement('section', {
            classNames: ['content', 'hero-section'],
            attributes: { id: this.id },
        });

        if (this.video) {
            const videoContainer = createElement('div', {
                classNames: ['hero-video'],
                attributes: { 'aria-hidden': 'true' },
            });

            const fallbackImage = createElement('img', {
                classNames: ['hero-fallback'],
                attributes: {
                    src: this.video.fallback,
                    alt: this.video.alt,
                },
            });

            const iframe = createElement('iframe', {
                attributes: {
                    src: this.video.src,
                    title: this.video.title,
                    frameborder: '0',
                    allow: this.video.allow,
                    allowfullscreen: '',
                },
            });

            iframe.addEventListener('load', () => {
                videoContainer.classList.add('video-loaded');
            });

            appendChildren(videoContainer, [fallbackImage, iframe]);
            section.appendChild(videoContainer);
        }

        const textContainer = createElement('div', {
            classNames: ['main-text'],
        });

        textContainer.style.animation = 'fadeInUp 0.6s ease-out forwards';

        appendChildren(textContainer, [
            createElement('h1', {
                classNames: ['hero-title'],
                textContent: this.title,
            }),
            createElement('p', {
                classNames: ['hero-subtitle'],
                textContent: this.subtitle,
            }),
        ]);

        textContainer.addEventListener('animationend', () => {
            textContainer.style.animation = 'none';
            textContainer.style.opacity = '1';
            textContainer.style.transform = 'none';
        });

        appendChildren(section, [textContainer]);

        this.sectionElement = section;
        this.textElement = textContainer;

        return section;
    }

    getTextElement() {
        return this.textElement;
    }

    getElement() {
        return this.sectionElement;
    }
}
