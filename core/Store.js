import db from '../db.js';
import EventBus from './EventBus.js';

class GlobalStore {
    constructor() {
        this.state = {
            portfolioData: db.getData(),
            isLoading: false
        };
        this.events = new EventBus();
    }

    getState() {
        return this.state;
    }

    updateData(section, newData) {
        // Optimistic UI update
        this.state.portfolioData[section] = newData;
        
        // Persist to local DB
        db.updateSection(section, newData);
        
        // Broadcast change globally
        this.events.emit('stateChange', this.state);
        this.events.emit(`${section}Change`, newData);
    }
}

const Store = new GlobalStore();
export { Store, EventBus };
