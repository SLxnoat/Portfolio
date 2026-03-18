import clientApp from './client/app.js';
import adminApp from './portfolio.admin/app.js';

class Router {
    constructor() {
        this.appDiv = document.getElementById('app');
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // initial load
    }

    handleRoute() {
        const hash = window.location.hash || '#/';
        
        // Clear current content
        this.appDiv.innerHTML = '';

        if (hash === '#/admin') {
            adminApp.init(this.appDiv);
        } else {
            clientApp.init(this.appDiv);
        }
    }
}

// Initialize router
document.addEventListener('DOMContentLoaded', () => {
    new Router();
});
