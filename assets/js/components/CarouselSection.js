import { BaseSection } from './BaseSection.js';
import { createElement } from '../utils/dom.js';

export class CarouselSection extends BaseSection {
    constructor({ id, title, images, classNames = [] }) {
        super({ id, title, classNames: ['image-carousel-section', ...classNames] });
        this.images = images;
        this.carouselElement = null;
    }

    createContent() {
        const carousel = createElement('div', {
            classNames: ['image-carousel'],
            attributes: { role: 'list' },
        });

        this.images.forEach(image => {
            const item = createElement('div', {
                classNames: ['carousel-item'],
                attributes: { role: 'listitem' },
            });

            const img = createElement('img', {
                attributes: {
                    src: image.src,
                    alt: image.alt,
                },
            });

            item.appendChild(img);
            carousel.appendChild(item);
        });

        this.carouselElement = carousel;
        return carousel;
    }

    getCarouselElement() {
        return this.carouselElement;
    }
}
