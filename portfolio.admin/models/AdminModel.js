import { Store } from '../../core/Store.js';

export default class AdminModel {
    fetchData() {
        return Store.getState().portfolioData;
    }

    saveProfile(profileData) {
        Store.updateData('profile', profileData);
    }
}
