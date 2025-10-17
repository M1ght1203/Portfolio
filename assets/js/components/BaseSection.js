import { createElement, appendChildren } from '../utils/dom.js';

export class BaseSection {
    constructor({ id, title, classNames = [] }) {
        this.id = id;
        this.title = title;
        this.classNames = ['section-container', ...classNames];
    }

    createWrapper() {
        const section = createElement('section', {
            classNames: this.classNames,
            attributes: { id: this.id },
        });

        if (this.title) {
            section.appendChild(
                createElement('h2', {
                    classNames: ['section-title'],
                    textContent: this.title,
                })
            );
        }

        return section;
    }

    render() {
        const section = this.createWrapper();
        const content = this.createContent();

        if (content) {
            appendChildren(section, Array.isArray(content) ? content : [content]);
        }

        return section;
    }

    // eslint-disable-next-line class-methods-use-this
    createContent() {
        throw new Error('createContent must be implemented by subclasses');
    }
}
