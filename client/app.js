import ClientModel from './models/ClientModel.js';
import ClientView from './views/ClientView.js';
import ClientController from './controllers/ClientController.js';

const app = {
    init: (appDiv) => {
        const model = new ClientModel();
        const view = new ClientView();
        const controller = new ClientController(model, view);
        
        controller.init(appDiv);
    }
};

export default app;
