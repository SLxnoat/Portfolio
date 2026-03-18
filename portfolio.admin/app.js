import AdminModel from './models/AdminModel.js';
import AdminView from './views/AdminView.js';
import AdminController from './controllers/AdminController.js';

const app = {
    init: (appDiv) => {
        const model = new AdminModel();
        const view = new AdminView();
        const controller = new AdminController(model, view);
        
        controller.init(appDiv);
    }
};

export default app;
