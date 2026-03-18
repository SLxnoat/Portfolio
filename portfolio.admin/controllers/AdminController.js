import { initScrollReveals } from '../../client/utils/animations.js';

export default class AdminController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init(appDiv) {
        const data = this.model.fetchData();
        this.view.render(appDiv, data, this.handleSaveProfile.bind(this));
        
        // Trigger enter animations for admin interface
        initScrollReveals();
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        }, 100);
    }

    handleSaveProfile(profileData) {
        this.model.saveProfile(profileData);
    }
}
