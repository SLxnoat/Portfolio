export default class AdminController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init(appDiv) {
        const data = this.model.fetchData();
        this.view.render(appDiv, data, this.handleSaveProfile.bind(this));
    }

    handleSaveProfile(profileData) {
        this.model.saveProfile(profileData);
    }
}
