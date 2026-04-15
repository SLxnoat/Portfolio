import { openDB } from 'idb';

const DB_NAME = 'OS_PRIME_DataStore';
const DB_VERSION = 5;

const STORES = [
  { name: 'profile', keyPath: 'id', autoIncrement: false },
  { name: 'projects', keyPath: 'id', autoIncrement: true },
  { name: 'skills', keyPath: 'id', autoIncrement: true },
  { name: 'experience', keyPath: 'id', autoIncrement: true },
  { name: 'education', keyPath: 'id', autoIncrement: true },
  { name: 'messages', keyPath: 'id', autoIncrement: true },
  { name: 'settings', keyPath: 'id', autoIncrement: false },
  { name: 'analytics', keyPath: 'id', autoIncrement: true }
];

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      STORES.forEach(store => {
        if (!db.objectStoreNames.contains(store.name)) {
          db.createObjectStore(store.name, {
            keyPath: store.keyPath,
            autoIncrement: store.autoIncrement
          });
        }
      });
    },
  });
};

const getDefaultProfile = () => ({
  id: 'main',
  name: 'Charuka Mayura Bandara',
  photo: 'legacy/avatar/profile.jpg',
  role: 'Aspiring AI / Machine Learning Engineer',
  tagline: 'Building intelligent systems with AI, ML & LLMs for real-world impact.',
  email: 'charuka03bc@gmail.com',
  phone: '+94 767 836 944',
  location: 'Gampaha, Sri Lanka',
  github: 'github.com/SLxnoat',
  linkedin: 'linkedin.com/in/charuka-mayura',
  openToWork: true,
  summary: 'IT undergraduate specializing in AI/ML with hands-on experience in machine learning, deep learning, NLP, and LLM systems.',
  ui_hero_bg: 'HELLO',
  ui_hero_status: 'System Online // User Identified',
  ui_terminal_prompt: 'sys_admin@portfolio:~',
});

export const portfolioService = {
  async getProfile() {
    const db = await initDB();
    let profile = await db.get('profile', 'main');
    if (!profile) {
      profile = getDefaultProfile();
      await db.put('profile', profile);
    }
    return profile;
  },

  async updateProfile(data) {
    const db = await initDB();
    data.id = 'main';
    await db.put('profile', data);
    return data;
  },

  async getAll(storeName) {
    const db = await initDB();
    const items = await db.getAll(storeName);
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async add(storeName, data) {
    const db = await initDB();
    const items = await this.getAll(storeName);
    data.order = items.length > 0 ? items[items.length - 1].order + 1 : 0;
    return db.add(storeName, data);
  },

  async update(storeName, data) {
    const db = await initDB();
    return db.put(storeName, data);
  },

  async delete(storeName, id) {
    const db = await initDB();
    return db.delete(storeName, id);
  },

  async logAnalytics(type, metadata = {}) {
    const db = await initDB();
    return db.add('analytics', {
      type,
      metadata,
      timestamp: new Date().toISOString()
    });
  },

  async getAnalyticsSummary() {
    const db = await initDB();
    const allEvents = await db.getAll('analytics');
    return {
      totalViews: allEvents.filter(e => e.type === 'PAGE_LOAD').length,
      interactions: allEvents.length,
      recentLogs: allEvents.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
    };
  }
};
