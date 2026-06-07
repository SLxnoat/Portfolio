// Firebase-based Database implementation
// Replaces IndexedDB with Firebase Realtime Database for cross-device sync

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getDatabase, ref, set, get, remove, onValue } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { firebaseConfig } from './FirebaseConfig.js';

export default class Database {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
        this.app = null;
        this.auth = null;
        this.onSync = null;
        this.listeners = new Map(); // Track active listeners for cleanup
        this.localCache = {}; // Local cache for offline support
        this.syncChannel = new BroadcastChannel(`${dbName}_sync`);

        this.syncChannel.onmessage = (event) => {
            if (event.data === 'DATABASE_UPDATED' && this.onSync) {
                this.onSync();
            }
        };
    }

    async init(stores) {
        try {
            // Initialize Firebase
            this.app = initializeApp(firebaseConfig);
            this.db = getDatabase(this.app);
            this.auth = getAuth(this.app);
            
            await this.ensureAnonymousAuth();
            console.log("Firebase Database initialized successfully");
            
            // Set up real-time listeners for each store
            for (const store of stores) {
                this.setupStoreListener(store.name);
            }
            
            return this.db;
        } catch (error) {
            console.error(`DATABASE_CRITICAL_FAILURE: [${error.name}] ${error.message}`);
            throw error;
        }
    }

    async ensureAnonymousAuth() {
        if (!this.auth) throw new Error('Firebase Auth not initialized');
        if (this.auth.currentUser) return this.auth.currentUser;
        try {
            const credential = await signInAnonymously(this.auth);
            return credential.user;
        } catch (error) {
            console.error('Firebase auth failure:', error);
            throw error;
        }
    }

    setupStoreListener(storeName) {
        try {
            const storeRef = ref(this.db, `portfolio/${storeName}`);
            
            const unsubscribe = onValue(storeRef, (snapshot) => {
                const data = snapshot.val();
                this.localCache[storeName] = data || {};
                
                // Notify app of changes
                if (this.onSync) {
                    this.onSync();
                }
            }, (error) => {
                console.error(`Error listening to ${storeName}:`, error);
            });
            
            this.listeners.set(storeName, unsubscribe);
        } catch (error) {
            console.error(`Failed to setup listener for ${storeName}:`, error);
        }
    }

    async getAll(storeName) {
        try {
            const storeRef = ref(this.db, `portfolio/${storeName}`);
            const snapshot = await get(storeRef);
            const data = snapshot.val();
            
            if (!data) return [];
            
            // Convert object to array if needed
            return Array.isArray(data) ? data : Object.values(data);
        } catch (error) {
            console.error(`Error getting all from ${storeName}:`, error);
            return this.localCache[storeName] ? Object.values(this.localCache[storeName]) : [];
        }
    }

    async get(storeName, id) {
        try {
            const itemRef = ref(this.db, `portfolio/${storeName}/${id}`);
            const snapshot = await get(itemRef);
            return snapshot.val();
        } catch (error) {
            console.error(`Error getting ${id} from ${storeName}:`, error);
            return null;
        }
    }

    async put(storeName, item) {
        try {
            if (!item.id) {
                // Auto-generate ID if not provided
                item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            }
            
            const itemRef = ref(this.db, `portfolio/${storeName}/${item.id}`);
            await set(itemRef, item);
            
            // Broadcast to other tabs
            this.syncChannel.postMessage('DATABASE_UPDATED');
            
            return item.id;
        } catch (error) {
            console.error(`Error putting item in ${storeName}:`, error);
            throw error;
        }
    }

    async delete(storeName, id) {
        try {
            const itemRef = ref(this.db, `portfolio/${storeName}/${id}`);
            await remove(itemRef);
            
            // Broadcast to other tabs
            this.syncChannel.postMessage('DATABASE_UPDATED');
            
            return true;
        } catch (error) {
            console.error(`Error deleting from ${storeName}:`, error);
            throw error;
        }
    }

    async clear(storeName) {
        try {
            const storeRef = ref(this.db, `portfolio/${storeName}`);
            await remove(storeRef);
            
            // Broadcast to other tabs
            this.syncChannel.postMessage('DATABASE_UPDATED');
            
            return true;
        } catch (error) {
            console.error(`Error clearing ${storeName}:`, error);
            throw error;
        }
    }

    async count(storeName) {
        try {
            const storeRef = ref(this.db, `portfolio/${storeName}`);
            const snapshot = await get(storeRef);
            const data = snapshot.val();
            
            if (!data) return 0;
            
            return Array.isArray(data) ? data.length : Object.keys(data).length;
        } catch (error) {
            console.error(`Error counting ${storeName}:`, error);
            return 0;
        }
    }

    // Cleanup listeners when app unloads
    destroy() {
        this.listeners.forEach((unsubscribe) => {
            unsubscribe();
        });
        this.listeners.clear();
        this.syncChannel.close();
    }
}
