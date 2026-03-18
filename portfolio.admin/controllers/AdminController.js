import { initScrollReveals } from '../../client/utils/animations.js';

export default class AdminController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init(appDiv) {
        this.renderView(appDiv);
    }

    renderView(appDiv) {
        const data = this.model.fetchData();
        
        // Pass callbacks to View
        this.view.render(appDiv, data, {
            onSaveProfile: (profile) => this.handleSaveProfile(profile),
            onAddItem: (section, item) => this.handleAddItem(appDiv, section, item),
            onDeleteItem: (section, index) => this.handleDeleteItem(appDiv, section, index)
        });

        // Trigger animations
        initScrollReveals();
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        }, 50);
    }

    handleSaveProfile(profileData) {
        this.model.saveSection('profile', profileData);
    }

    handleAddItem(appDiv, section, item) {
        const data = this.model.fetchData();
        const array = data[section] || [];
        array.push(item);
        this.model.saveSection(section, array);
        
        // Quickly re-render to reflect changes
        this.renderView(appDiv);
    }

    handleDeleteItem(appDiv, section, index) {
        const data = this.model.fetchData();
        const array = data[section] || [];
        array.splice(index, 1);
        this.model.saveSection(section, array);
        
        // Quickly re-render to reflect changes
        this.renderView(appDiv);
    }
}
