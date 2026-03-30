import PortfolioModel from '../models/PortfolioModel.js';
import AdminView from '../views/AdminView.js';

export default class AdminPresenter {
    constructor() {
        this.model = new PortfolioModel();
        this.adminView = new AdminView();

        this.adminView.onSaveProfile = async (data) => {
            await this.model.updateProfile(data);
            this.refreshApp();
        };

        this.adminView.onSaveItem = async (collection, data) => {
            if (data.id) {
                // Keep existing order if merely editing content
                let item = await this.model.db.get(collection, data.id);
                if(data.order === null || isNaN(data.order)) data.order = item.order;
                await this.model.updateItem(collection, data);
            } else {
                // Adds natively calculate proper max order value
                await this.model.addItem(collection, data);
            }
            this.refreshApp();
        };

        this.adminView.onMarkMessageRead = async (id) => {
            await this.model.markMessageRead(id);
            this.refreshApp();
        };

        this.adminView.onReorderSections = async (sectionsArray) => {
            await this.model.updateLayoutConfig(sectionsArray);
            // Non-destructive layout save - no reload necessary
        };

        this.adminView.onDeleteItem = async (collection, id) => {
            await this.model.deleteItem(collection, id);
            this.refreshApp();
        };

        this.adminView.onReorderItems = async (collection, orderMapping) => {
            await this.model.updateOrder(collection, orderMapping);
            // We do NOT call refreshApp() here to respect the user's dragged state immediately without flickering
            // The dragged state accurately reflects the saved DB state conceptually until hard reload.
        };

        this.adminView.onExportData = async () => {
            const data = await this.model.exportFullData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        this.adminView.onImportData = async (jsonData) => {
            if(confirm("CRITICAL WARNING: This will overwrite your entire system state and permanently delete all current records. Proceed with system restoration?")) {
                try {
                    await this.model.importFullData(jsonData);
                    alert("SYSTEM RESTORE COMPLETE. RELOADING MAIN CONTROL INTERFACE.");
                    window.location.reload();
                } catch(e) {
                    alert("FATAL ERROR DURING RESTORE: " + e.message);
                }
            }
        };
    }

    async init() {
        const token = sessionStorage.getItem('sys_auth_token');
        const sessionStart = parseInt(token);
        if(!token || isNaN(sessionStart) || (Date.now() - sessionStart) > (30 * 60 * 1000)) {
            sessionStorage.removeItem('sys_auth_token');
            window.location.href = 'index.html';
            return;
        }

        try {
            await this.model.init();
            await this.refreshApp();
        } catch (error) {
            console.error("Failed to initialize Admin System:", error);
            document.getElementById('admin-root').innerHTML = `
                <div class="vw-100 vh-100 d-flex justify-content-center align-items-center bg-dark text-white">
                    <div class="text-center">
                        <i class="fas fa-lock fa-3x text-danger mb-4"></i>
                        <h2 class="text-danger fw-bold">Database Locked</h2>
                        <p class="text-secondary">Failed to initialize IndexedDB Admin Pipeline.</p>
                    </div>
                </div>`;
        }
    }

    async getFullData() {
        return {
            profile: await this.model.getProfile(),
            projects: await this.model.getAllItems('projects'),
            skills: await this.model.getAllItems('skills'),
            experience: await this.model.getAllItems('experience'),
            education: await this.model.getAllItems('education'),
            messages: await this.model.getMessages(),
            layout: await this.model.getLayoutConfig() || { sections: ['about', 'skills', 'projects', 'experience', 'contact'] },
            analytics: await this.model.getAnalyticsSummary()
        };
    }

    async refreshApp() {
        // Fetch fresh data from indexedDB which applies sorting via the model automatically
        const data = await this.getFullData();
        
        // Render UI
        this.adminView.render(data);
    }
}
