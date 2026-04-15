import Database from './Database.js';

export default class PortfolioModel {
    constructor() {
        this.db = new Database('OS_PRIME_DataStore', 5);
        this.stores = [
            { name: 'profile', keyPath: 'id', autoIncrement: false },
            { name: 'projects', keyPath: 'id', autoIncrement: true },
            { name: 'skills', keyPath: 'id', autoIncrement: true },
            { name: 'experience', keyPath: 'id', autoIncrement: true },
            { name: 'education', keyPath: 'id', autoIncrement: true },
            { name: 'messages', keyPath: 'id', autoIncrement: true },
            { name: 'settings', keyPath: 'id', autoIncrement: false },
            { name: 'analytics', keyPath: 'id', autoIncrement: true }
        ];
    }

    async init() {
        await this.db.init(this.stores);
        await this.seedDataIfEmpty();
    }

    setOnSync(callback) {
        this.db.onSync = callback;
    }

    async seedDataIfEmpty() {
        const count = await this.db.count('profile');
        if (count === 0) {
            console.log("Seeding default data...");
            await this.db.put('profile', {
                id: 'main',
                name: 'Charuka Mayura Bandara',
                photo: 'avatar/profile.jpg',
                role: 'Aspiring AI / Machine Learning Engineer',
                tagline: 'Building intelligent systems with AI, ML & LLMs for real-world impact.',
                email: 'charuka03bc@gmail.com',
                phone: '+94 767 836 944',
                location: 'Gampaha, Sri Lanka',
                github: 'github.com/SLxnoat',
                linkedin: 'linkedin.com/in/charuka-mayura',
                openToWork: true,
                adminPassword: 'admin',
                summary: 'IT undergraduate specializing in AI/ML with hands-on experience in machine learning, deep learning, NLP, and LLM systems.\n\nBuilt and deployed 17+ projects\nAchieved:\n- 96% accuracy (credit scoring model)\n- 95% accuracy (CNN image classifier)\n- 90%+ accuracy (BERT NLP classifier)\nExperienced in end-to-end ML pipelines + MLOps\nDeveloped LLM-powered assistants using LLaMA + LangChain',
                
                // SEO & System
                keywords: 'AI Engineer, ML Engineer, Deep Learning, NLP, Portfolio, Charuka Mayura, Sri Lanka, Tech Arsenal, Innovation',
                url: 'https://slxnoat.github.io/portfolio/',
                version: 'OS.PRIME_V3.2RC',

                // UI Strings
                ui_hero_bg: 'HELLO',
                ui_hero_status: 'System Online // User Identified',
                ui_hero_btn: 'Explore Arsenal',
                ui_about_bg: 'ABOUT',
                ui_skills_bg: 'SKILLS',
                ui_projects_bg: 'PROJECTS',
                ui_timeline_bg: 'TIMELINE',
                ui_contact_bg: 'CONTACT',
                ui_nav_about: 'About',
                ui_nav_skills: 'Skills',
                ui_nav_projects: 'Projects',
                ui_nav_experience: 'Experience',
                ui_nav_contact: 'Contact',
                
                // Assistant & Terminal
                ui_terminal_prompt: 'sys_admin@portfolio:~',
                ui_assistant_name: 'PRIME_AGENT',
                ui_assistant_ver: 'v1.0',
                ui_assistant_welcome: 'WELCOME, VISITOR.',
                ui_assistant_boot: 'PRIME_AGENT BOOT SEQUENCE INITIATED...',
                ui_assistant_ready: 'SYSTEM_READY. WELCOME, OPERATOR.',
                ui_hero_deploy: 'Deploying Modules'
            });

            const initialProjects = [
                { title: 'Lanka Microfinance AI \u2013 Alternative Credit Scoring', tech: 'Python, XGBoost, Scikit-learn', description: 'Built credit scoring without CRIB data.', results: '96% accuracy (prototype)', features: 'Class imbalance handling', order: 0 },
                { title: 'Project ARIA \u2013 Adaptive AI Assistant', tech: 'Python, Ollama, LLaMA 3.2', description: 'Local LLM-based personal AI companion.', results: 'Context-aware responses.', features: 'UI features: Chat, Profile', order: 1 },
                { title: 'Digit Identifier \u2013 CNN Model', tech: 'TensorFlow, Keras', description: 'Trained CNN on MNIST dataset.', results: '95% accuracy.', features: '', order: 2 }
            ];
            for (const p of initialProjects) await this.db.put('projects', p);

            const initialSkills = [
                { category: 'AI / ML / DL', items: 'Machine Learning, Deep Learning, NLP, LLMs', order: 0 },
                { category: 'AI Frameworks', items: 'TensorFlow, PyTorch, Keras, Scikit-learn', order: 1 },
                { category: 'Data Science', items: 'Pandas, NumPy, SciPy, Matplotlib', order: 2 }
            ];
            for (const s of initialSkills) await this.db.put('skills', s);

            const exp = [
                { title: 'Founder & Lead Developer', company: 'ArtXpert-Code', date: '2024\u2013Present', desc: 'Open-source AI/ML & full-stack projects.', order: 0 },
                { title: 'Founder & Designer', company: 'ArtXpert', date: '2022\u2013Present', desc: 'Graphic design business, Branding illustration.', order: 1 }
            ];
            for (const e of exp) await this.db.put('experience', e);

            const edu = [
                { degree: 'BSc (Hons) Information Technology', inst: 'Horizon Campus', date: '2023\u20132027', order: 0 },
                { degree: 'G.C.E Advanced Level \u2013 Biology', inst: 'Bandaranayake College', date: '2020', order: 1 }
            ];
            for (const e of edu) await this.db.put('education', e);
            
            await this.db.put('settings', {
                id: 'layout',
                sections: ['about', 'skills', 'projects', 'experience', 'contact']
            });
        } else {
            // Migration for existing data
            let profile = await this.db.get('profile', 'main');
            if (profile) {
                let changed = false;
                if (profile.openToWork === undefined) { profile.openToWork = true; changed = true; }
                if (profile.adminPassword === undefined) { profile.adminPassword = 'admin'; changed = true; }
                
                const defaults = {
                    keywords: 'AI Engineer, ML Engineer, Deep Learning, NLP, Portfolio, Charuka Mayura, Sri Lanka, Tech Arsenal, Innovation',
                    url: 'https://slxnoat.github.io/portfolio/',
                    version: 'OS.PRIME_V3.2RC',
                    ui_hero_bg: 'HELLO',
                    ui_hero_status: 'System Online // User Identified',
                    ui_hero_btn: 'Explore Arsenal',
                    ui_about_bg: 'ABOUT',
                    ui_skills_bg: 'SKILLS',
                    ui_projects_bg: 'PROJECTS',
                    ui_timeline_bg: 'TIMELINE',
                    ui_contact_bg: 'CONTACT',
                    ui_nav_about: 'About',
                    ui_nav_skills: 'Skills',
                    ui_nav_projects: 'Projects',
                    ui_nav_experience: 'Experience',
                    ui_nav_contact: 'Contact',
                    ui_terminal_prompt: 'sys_admin@portfolio:~',
                    ui_assistant_name: 'PRIME_AGENT',
                    ui_assistant_ver: 'v1.0',
                    ui_assistant_welcome: 'WELCOME, VISITOR.',
                    ui_assistant_boot: 'PRIME_AGENT BOOT SEQUENCE INITIATED...',
                    ui_assistant_ready: 'SYSTEM_READY. WELCOME, OPERATOR.',
                    ui_hero_deploy: 'Deploying Modules'
                };

                for (const key in defaults) {
                    if (profile[key] === undefined) {
                        profile[key] = defaults[key];
                        changed = true;
                    }
                }

                if (changed) await this.db.put('profile', profile);
            }
            
            for (let collection of ['projects', 'skills', 'experience', 'education']) {
                let items = await this.db.getAll(collection);
                for (let i = 0; i < items.length; i++) {
                    if (items[i].order === undefined) {
                        items[i].order = i;
                        await this.db.put(collection, items[i]);
                    }
                }
            }
            
            const settings = await this.db.get('settings', 'layout');
            if(!settings) {
                await this.db.put('settings', {
                    id: 'layout',
                    sections: ['about', 'skills', 'projects', 'experience', 'contact']
                });
            }
        }
    }

    async getProfile() { return await this.db.get('profile', 'main'); }
    async updateProfile(data) { data.id = 'main'; return await this.db.put('profile', data); }

    // Returns ordered items
    async getAllItems(collection) { 
        let items = await this.db.getAll(collection);
        return items.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    async addItem(collection, data) { 
        let items = await this.getAllItems(collection);
        data.order = items.length > 0 ? items[items.length - 1].order + 1 : 0;
        return await this.db.put(collection, data); 
    }

    async updateItem(collection, data) { return await this.db.put(collection, data); }
    async deleteItem(collection, id) { return await this.db.delete(collection, id); }

    // Reorders items array
    async updateOrder(collection, orderMapping) {
        // orderMapping is an array of objects: { id: 1, order: 0 }, { id: 5, order: 1 }...
        for (let item of orderMapping) {
            let data = await this.db.get(collection, item.id);
            if (data) {
                data.order = item.order;
                await this.db.put(collection, data);
            }
        }
    }

    // Inbox Messages Setup
    async getMessages() { 
        let msgs = await this.db.getAll('messages'); 
        return msgs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    async addMessage(data) {
        data.timestamp = new Date().toISOString();
        data.read = false;
        return await this.db.put('messages', data);
    }

    async markMessageRead(id) {
        let msg = await this.db.get('messages', id);
        if(msg) {
            msg.read = true;
            await this.db.put('messages', msg);
        }
    }

    // Dynamic Layout Hierarchy State
    async getLayoutConfig() {
        return await this.db.get('settings', 'layout');
    }
    
    async updateLayoutConfig(sections) {
        return await this.db.put('settings', { id: 'layout', sections });
    }

    // Analytics Engine
    async logEvent(type, metadata = {}) {
        if(!this.db) await this.init();
        const event = {
            type,
            metadata,
            timestamp: new Date().toISOString()
        };
        return await this.db.put('analytics', event);
    }

    async getAnalyticsSummary() {
        if(!this.db) await this.init();
        const allEvents = await this.db.getAll('analytics');
        
        // Basic stats
        const summary = {
            totalViews: allEvents.filter(e => e.type === 'PAGE_LOAD').length,
            cvDownloads: allEvents.filter(e => e.type === 'CV_DOWNLOAD').length,
            interactions: allEvents.length,
            recentLogs: allEvents.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15)
        };
        return summary;
    }

    // Data Vault: Backup & Restore
    async exportFullData() {
        if(!this.db) await this.init();
        const backup = {};
        for(const store of this.stores) {
            backup[store.name] = await this.db.getAll(store.name);
        }
        await this.logEvent('DATA_EXPORT', { filename: `backup_${new Date().toISOString()}.json` });
        return backup;
    }

    async importFullData(jsonData) {
        if(!this.db) await this.init();
        try {
            const data = (typeof jsonData === 'string') ? JSON.parse(jsonData) : jsonData;
            
            // Clear all existing stores
            for(const store of this.stores) {
                await this.db.clear(store.name);
                
                // Put new items
                if(data[store.name]) {
                    for(const item of data[store.name]) {
                        await this.db.put(store.name, item);
                    }
                }
            }
            await this.logEvent('DATA_RESTORE', { status: 'SUCCESS' });
            return true;
        } catch (e) {
            console.error("IMPORT_FAILED:", e);
            await this.logEvent('DATA_RESTORE', { status: 'FAILED', error: e.message });
            throw e;
        }
    }
}
