export default class Database {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
        this.syncChannel = new BroadcastChannel(`${dbName}_sync`);
        this.onSync = null;

        this.syncChannel.onmessage = (event) => {
            if (event.data === 'DATABASE_UPDATED' && this.onSync) {
                this.onSync();
            }
        };
    }

    async init(stores) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store.name)) {
                        db.createObjectStore(store.name, { keyPath: store.keyPath, autoIncrement: store.autoIncrement });
                    }
                });
            };

            request.onblocked = (event) => {
                const msg = "SYSTEM ALERT: Database upgrade is blocked by another tab. Please close all other portfolio tabs to complete the update.";
                console.warn(msg);
                alert(msg);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                
                // Allow other tabs to upgrade without blocking
                this.db.onversionchange = () => {
                    this.db.close();
                    const msg = "SYSTEM ALERT: A database upgrade has been initiated. This tab will now reload to synchronize.";
                    console.info(msg);
                    window.location.reload();
                };

                resolve(this.db);
            };

            request.onerror = (event) => {
                const error = event.target.error;
                console.error(`DATABASE_CRITICAL_FAILURE: [${error.name}] ${error.message}`);
                reject(error);
            };
        });
    }

    async getStore(storeName, mode = 'readonly') {
        const transaction = this.db.transaction([storeName], mode);
        return transaction.objectStore(storeName);
    }

    async getAll(storeName) {
        return new Promise(async (resolve, reject) => {
            try {
                const store = await this.getStore(storeName);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch(e) { reject(e); }
        });
    }

    async get(storeName, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const store = await this.getStore(storeName);
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch(e) { reject(e); }
        });
    }

    async put(storeName, item) {
        return new Promise(async (resolve, reject) => {
            try {
                const store = await this.getStore(storeName, 'readwrite');
                const request = store.put(item);
                request.onsuccess = () => {
                    this.syncChannel.postMessage('DATABASE_UPDATED');
                    resolve(request.result);
                };
                request.onerror = () => reject(request.error);
            } catch(e) { reject(e); }
        });
    }

    async delete(storeName, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const store = await this.getStore(storeName, 'readwrite');
                const request = store.delete(id);
                request.onsuccess = () => {
                    this.syncChannel.postMessage('DATABASE_UPDATED');
                    resolve();
                };
                request.onerror = () => reject(request.error);
            } catch(e) { reject(e); }
        });
    }

    async count(storeName) {
        return new Promise(async (resolve, reject) => {
            try {
                const store = await this.getStore(storeName);
                const request = store.count();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch(e) { reject(e); }
        });
    }
}
