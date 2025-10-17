import { BaseSection } from './BaseSection.js';
import { createElement, appendChildren } from '../utils/dom.js';

export class TimelineSection extends BaseSection {
    constructor({ id, title, entries, classNames = [] }) {
        super({ id, title, classNames });
        this.entries = entries;
    }

    createContent() {
        return this.entries.map(entry => this.createEntry(entry));
    }

    createEntry(entry) {
        const container = createElement('div', {
            classNames: ['career-entry'],
        });

        const leftColumn = createElement('div', {
            classNames: ['career-left'],
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
            classNames: ['career-right'],
        });

        const heading = createElement('h3');

        if (entry.link) {
            const link = createElement('a', {
                classNames: ['job-link'],
                attributes: {
                    href: entry.link,
                    target: entry.target || '_blank',
                    rel: 'noopener noreferrer',
                },
            });

            link.innerHTML = `${entry.role}<br /><span class="company">${entry.company}</span>`;
            heading.appendChild(link);
        } else {
            heading.innerHTML = `${entry.role}<br /><span class="company">${entry.company}</span>`;
        }

        const description = entry.description
            ? createElement('p', {
                  classNames: ['description'],
                  textContent: entry.description,
              })
            : null;

        const tags = createElement('p', {
            classNames: ['tech'],
        });

        if (Array.isArray(entry.tags)) {
            entry.tags.forEach(tag => {
                tags.appendChild(
                    createElement('span', {
                        classNames: ['tag'],
                        textContent: tag,
                    })
                );
            });
        }

        appendChildren(rightColumn, [heading, description, tags]);
        appendChildren(container, [leftColumn, rightColumn]);

        return container;
    }
}
