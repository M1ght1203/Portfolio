import { BaseSection } from './BaseSection.js';
import { createElement, appendChildren } from '../utils/dom.js';

export class ProjectsSection extends BaseSection {
    constructor({ id, title, entries, classNames = [] }) {
        super({ id, title, classNames: ['projects-section', ...classNames] });
        this.entries = entries;
    }

    createContent() {
        return this.entries.map(entry => this.createProjectEntry(entry));
    }

    createProjectEntry(entry) {
        const container = createElement('div', {
            classNames: ['project-entry'],
        });

        const leftColumn = createElement('div', {
            classNames: ['project-left'],
        });

        if (entry.date) {
            leftColumn.appendChild(
                createElement('p', {
                    classNames: ['date'],
                    textContent: entry.date,
                })
            );
        }

        const rightColumn = createElement('div', {
            classNames: ['project-right'],
        });

        const heading = createElement('h3');

        if (entry.link) {
            const link = createElement('a', {
                classNames: ['project-link'],
                attributes: {
                    href: entry.link,
                    target: entry.target || '_blank',
                    rel: 'noopener noreferrer',
                },
                textContent: entry.name,
            });

            heading.appendChild(link);
        } else {
            heading.textContent = entry.name;
        }

        const description = entry.description
            ? createElement('p', {
                  classNames: ['description'],
                  textContent: entry.description,
              })
            : null;

        appendChildren(rightColumn, [heading, description]);
        appendChildren(container, [leftColumn, rightColumn]);

        return container;
    }
}
