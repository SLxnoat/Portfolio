import { Store } from '../../core/Store.js';

export default class AdminModel {
    fetchData() {
        return Store.getState().portfolioData;
    }

    saveSection(sectionKey, data) {
        Store.updateData(sectionKey, data);
    }
}
