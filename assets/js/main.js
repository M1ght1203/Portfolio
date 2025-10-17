import { PortfolioApp } from './core/PortfolioApp.js';
import { content } from './data/content.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp({
        documentRef: document,
        content,
    });

    app.init();
});
