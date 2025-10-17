export function createElement(tag, { classNames = [], attributes = {}, textContent = null } = {}) {
    const element = document.createElement(tag);

    if (classNames.length) {
        element.classList.add(...classNames);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                if (dataValue !== undefined && dataValue !== null) {
                    element.dataset[dataKey] = dataValue;
                }
            });
            return;
        }

        if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
            return;
        }

        element.setAttribute(key, value);
    });

    if (typeof textContent === 'string') {
        element.textContent = textContent;
    }

    return element;
}

export function appendChildren(parent, children) {
    children
        .filter(Boolean)
        .forEach(child => {
            if (Array.isArray(child)) {
                appendChildren(parent, child);
            } else {
                parent.appendChild(child);
            }
        });

    return parent;
}
