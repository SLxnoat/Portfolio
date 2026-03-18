import db from '../../db.js';

export default class AdminModel {
    constructor() {
        this.data = null;
    }

    fetchData() {
        this.data = db.getData();
        return this.data;
    }

    saveProfile(profileData) {
        db.updateSection('profile', profileData);
        this.data.profile = profileData;
    }
}
