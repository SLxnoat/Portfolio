export default class ClientController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init(appDiv) {
        const data = this.model.fetchData();
        this.view.render(appDiv, data);
    }
}
