import clientApp from './client/app.js';
import adminApp from './portfolio.admin/app.js';

class Router {
    constructor() {
        this.appDiv = document.getElementById('app');
        this.loader = document.getElementById('page-loader');
        
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Initial load needs an artificial small delay for the reveal animation
        setTimeout(() => this.handleRoute(), 100);
    }

    async handleRoute() {
        const hash = window.location.hash || '#/';
        
        // Play out transition
        this.appDiv.classList.remove('page-enter');
        this.appDiv.classList.add('page-exit');
        this.loader.style.transform = 'translateY(0)';
        
        // Wait for CSS exit transition duration
        await new Promise(r => setTimeout(r, 400));
        
        this.appDiv.innerHTML = '';

        if (hash === '#/admin') {
            await adminApp.init(this.appDiv);
        } else {
            await clientApp.init(this.appDiv);
        }
        
        // Play int transition
        this.loader.style.transform = 'translateY(-100%)';
        this.appDiv.classList.remove('page-exit');
        this.appDiv.classList.add('page-enter');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Router();
});
