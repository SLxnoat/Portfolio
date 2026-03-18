import db from '../../db.js';

export default class ClientModel {
    constructor() {
        this.data = null;
    }

    fetchData() {
        // Retrieve data from our generic local storage DB
        this.data = db.getData();
        return this.data;
    }
}
