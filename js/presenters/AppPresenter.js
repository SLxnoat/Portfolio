import PortfolioModel from '../models/PortfolioModel.js';
import ClientView from '../views/ClientView.js';

export default class AppPresenter {
    constructor() {
        this.model = new PortfolioModel();
        this.clientView = new ClientView();
        
        this.clientView.onSendMessage = async (msgData) => {
            await this.model.addMessage(msgData);
            await this.model.logEvent('MESSAGE_SENT');
            const profile = await this.model.getProfile();
            if (profile && profile.email) {
                this.openMailClient(profile.email, msgData);
            }
            this.clientView.showContactSuccess();
        };

        this.clientView.onTrackEvent = async (type, metadata) => {
            await this.model.logEvent(type, metadata);
        };

        this.model.setOnSync(() => {
            this.refreshApp();
        });
    }

    async init() {
        try {
            await this.model.init();
            await this.model.logEvent('PAGE_LOAD', { referrer: document.referrer, screen: `${window.innerWidth}x${window.innerHeight}` });
            await this.refreshApp();
        } catch (error) {
            console.error("Failed to initialize App:", error);
            document.getElementById('client-app').innerHTML = `
                <div class="vw-100 vh-100 d-flex justify-content-center align-items-center bg-dark text-white">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle fa-3x text-danger mb-4"></i>
                        <h2 class="text-danger fw-bold">System Error</h2>
                        <p class="text-secondary">Failed to initialize local IndexedDB: <code class="text-light">${error.name || error.message || 'Unknown Error'}</code></p>
                        <p class="text-secondary small mt-3">Try clearing site data or ensuring you are not in strict private browsing mode.</p>
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
            layout: await this.model.getLayoutConfig() || { sections: ['about', 'skills', 'projects', 'experience', 'contact'] }
        };
    }

    async refreshApp() {
        // Fetch fresh data from indexedDB
        const data = await this.getFullData();
        
        // Render UI
        this.clientView.render(data);
    }

    openMailClient(toEmail, msgData) {
        const subject = `Portfolio Inquiry: ${msgData.subject || 'New Message'}`;
        const bodyLines = [
            `Name: ${msgData.name || 'Anonymous'}`,
            `Reply-To: ${msgData.email || 'Not provided'}`,
            '',
            `${msgData.message || ''}`,
            '',
            '---',
            'Sent from portfolio contact form.'
        ];
        const body = encodeURIComponent(bodyLines.join('\r\n'));
        const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${body}`;

        try {
            window.location.href = mailtoUrl;
        } catch (err) {
            console.error('Failed to open email client:', err);
        }
    }
}
