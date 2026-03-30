import AdminPresenter from './presenters/AdminPresenter.js';

document.addEventListener('DOMContentLoaded', () => {
    const adminApp = new AdminPresenter();
    adminApp.init();
});
