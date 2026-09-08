// LocalStorage Data Layer for Pig Farm Management System
window.DB = {
    // Keys used in localStorage
    KEYS: {
        USERS: 'pfm_users',
        PIGS: 'pfm_pigs',
        FEED: 'pfm_feed_logs',
        FEED_LOGS: 'pfm_feed_logs',
        MEDICINE: 'pfm_medicine_logs',
        MEDICINE_LOGS: 'pfm_medicine_logs',
        WEIGHT: 'pfm_weight_logs',
        WEIGHT_LOGS: 'pfm_weight_logs',
        EXPENSES: 'pfm_expenses',
        INCOME: 'pfm_income',
        HOUSING: 'pfm_housing',
        BREEDING: 'pfm_breeding',
        SETTINGS: 'pfm_settings',
        CURRENT_USER: 'pfm_current_user',
        BATCHES: 'pfm_batches',
        FLOCKS: 'pfm_flocks',
        POULTRY_DAILY: 'pfm_poultry_daily',
        POULTRY_EXPENSES: 'pfm_poultry_expenses',
        DELETED: 'pfm_deleted_records',
        LAST_SYNC: 'pfm_last_sync_timestamp'
    },

    // Firebase Configuration for Multi-Device Real-Time Cloud Sync
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyA1GRg977sn2jXE2CsdV5oewS0wc1zbiy8",
        authDomain: "banj-pig-farm-management.firebaseapp.com",
        projectId: "banj-pig-farm-management",
        storageBucket: "banj-pig-farm-management.firebasestorage.app",
        messagingSenderId: "671181488047",
        appId: "1:671181488047:web:a77c1d240a6df4807eb95a",
        measurementId: "G-30KDMG3PRD"
    },

    firestore: null,
    isCloudReady: false,
    _syncListeners: [],
    _refreshTimer: null,

    // Collections synchronized across devices
    SYNC_COLLECTIONS: [
        'users', 'pigs', 'batches', 'flocks', 'poultry_daily', 
        'poultry_expenses', 'feed_logs', 'medicine_logs', 'weight_logs', 
        'expenses', 'income', 'housing', 'breeding'
    ],

    init() {
        // 1. Seed default users if empty
        if (!localStorage.getItem(this.KEYS.USERS)) {
            const defaultUsers = [
                {
                    id: 'usr_1',
                    name: 'Banjo',
                    username: 'banjo',
                    password: 'password123',
                    role: 'Administrator',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                },
                {
                    id: 'usr_2',
                    name: 'Albe',
                    username: 'albe',
                    password: 'password123',
                    role: 'Manager',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                }
            ];
            this._saveRaw(this.KEYS.USERS, defaultUsers);
        }

        // 2. Seed default settings if empty
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            const defaultSettings = {
                farm_name: 'PigFarm Pro',
                currency: '₱',
                date_format: 'YYYY-MM-DD'
            };
            this._saveRaw(this.KEYS.SETTINGS, defaultSettings);
        }

        // 3. Initialize Real-Time Firebase Firestore Cloud Sync
        this.initFirestore();
    },

    // --- Firebase Firestore Real-Time Synchronization Engine ---
    initFirestore() {
        if (typeof firebase === 'undefined') {
            console.warn("Firebase SDK not loaded. Operating in Local Cache mode.");
            this.updateCloudStatus('local', 'Offline Cache');
            return;
        }

        try {
            if (!firebase.apps || !firebase.apps.length) {
                firebase.initializeApp(this.FIREBASE_CONFIG);
            }
            this.firestore = firebase.firestore();

            // Enable offline persistence in Firestore
            this.firestore.enablePersistence({ synchronizeTabs: true }).catch(err => {
                if (err.code === 'failed-precondition') {
                    console.warn("Firestore persistence notice: Multiple tabs open.");
                } else if (err.code === 'unimplemented') {
                    console.warn("Firestore persistence notice: Browser does not support indexedDB persistence.");
                }
            });

            this.isCloudReady = true;
            this.updateCloudStatus('connected', 'Cloud Sync: Active');

            // Start listening to real-time changes on all collections
            this.startCloudSync();

        } catch (err) {
            console.error("Firebase init error:", err);
            this.updateCloudStatus('error', 'Cloud Offline');
        }
    },

    startCloudSync() {
        if (!this.firestore) return;

        // Clear any old listeners
        this._syncListeners.forEach(unsub => {
            try { unsub(); } catch(e) {}
        });
        this._syncListeners = [];

        // 1. Sync Settings Document
        const settingsUnsub = this.firestore.collection('settings').doc('general').onSnapshot(doc => {
            if (doc.exists) {
                const cloudSettings = doc.data();
                this._saveRaw(this.KEYS.SETTINGS, cloudSettings);
                const brandText = document.querySelector('.brand-name');
                if (brandText && cloudSettings.farm_name) brandText.textContent = cloudSettings.farm_name;
            } else {
                const localSettings = this.getSettings();
                if (localSettings) {
                    this.firestore.collection('settings').doc('general').set(localSettings).catch(()=>{});
                }
            }
            this.updateCloudStatus('connected', 'Cloud Sync: Active');
        }, err => {
            console.warn("Settings sync error:", err);
            this.updateCloudStatus('error', 'Cloud Disconnected');
        });
        this._syncListeners.push(settingsUnsub);

        // 2. Sync All Data Collections in Real Time
        this.SYNC_COLLECTIONS.forEach(col => {
            const unsub = this.firestore.collection(col).onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    const cloudDocs = [];
                    snapshot.forEach(doc => {
                        cloudDocs.push({ id: doc.id, ...doc.data() });
                    });

                    const key = this.KEYS[col.toUpperCase()];
                    if (key) {
                        this._saveRaw(key, cloudDocs);
                    }

                    this.updateCloudStatus('connected', 'Cloud Sync: Active');
                    localStorage.setItem(this.KEYS.LAST_SYNC, new Date().toISOString());

                    // Refresh active page so user sees updates live
                    this._notifyAppChange(col);

                } else {
                    // If cloud collection is empty, ensure local cache is empty
                    const key = this.KEYS[col.toUpperCase()];
                    if (key && !localStorage.getItem(key)) {
                        this._saveRaw(key, []);
                    }
                }
            }, err => {
                console.warn(`Firestore sync error on ${col}:`, err);
                this.updateCloudStatus('error', 'Cloud Disconnected');
            });

            this._syncListeners.push(unsub);
        });
    },

    // Notify UI to softly update view when cloud changes arrive
    _notifyAppChange(col) {
        if (!window.App || !window.App.currentPage) return;
        clearTimeout(this._refreshTimer);
        this._refreshTimer = setTimeout(() => {
            const p = window.App.currentPage;
            if (window.Pages && window.Pages[p]) {
                if (typeof window.Pages[p].init === 'function') {
                    const content = document.getElementById('main-content');
                    if (content) {
                        content.innerHTML = window.Pages[p].render();
                        window.Pages[p].init();
                    }
                }
            }
        }, 300);
    },

    // Updates visual Cloud Sync indicator badge in sidebar and mobile header
    updateCloudStatus(status, text) {
        const badge = document.getElementById('cloud-sync-badge');
        const dot = document.getElementById('cloud-dot');
        const statusText = document.getElementById('cloud-status-text');
        const icon = document.getElementById('cloud-status-icon');
        const mobileStatus = document.getElementById('mobile-cloud-status');

        let color = '#10b981'; // Green (Connected)
        let iconEmoji = '☁️';

        if (status === 'syncing') {
            color = '#f59e0b'; // Amber
            iconEmoji = '🔄';
        } else if (status === 'error') {
            color = '#ef4444'; // Red
            iconEmoji = '⚠️';
        } else if (status === 'local') {
            color = '#64748b'; // Gray
            iconEmoji = '💾';
        }

        if (dot) dot.style.background = color;
        if (statusText) statusText.textContent = text || 'Cloud Sync: Active';
        if (icon) icon.textContent = iconEmoji;
        if (badge) {
            badge.style.color = color;
            badge.style.borderColor = `${color}40`;
            badge.style.background = `${color}15`;
        }

        if (mobileStatus) {
            mobileStatus.style.color = color;
            const mobileDot = mobileStatus.querySelector('.status-dot');
            if (mobileDot) mobileDot.style.background = color;
        }
    },

    // Force upload all local collections to Firebase Firestore
    async uploadAllToCloud() {
        if (!this.firestore) {
            throw new Error("Firebase is not connected. Make sure you are online.");
        }

        this.updateCloudStatus('syncing', 'Uploading to Cloud...');
        let totalCount = 0;

        // 1. Upload settings
        const settings = this.getSettings();
        await this.firestore.collection('settings').doc('general').set(settings, { merge: true });

        // 2. Upload each collection and prune stale cloud records
        for (const col of this.SYNC_COLLECTIONS) {
            const items = this.getAll(col);
            const batch = this.firestore.batch();
            
            // Get existing cloud docs to prune any records deleted locally
            const existingSnap = await this.firestore.collection(col).get();
            const currentItemIds = new Set((items || []).map(i => i.id));
            
            existingSnap.forEach(doc => {
                if (!currentItemIds.has(doc.id)) {
                    batch.delete(doc.ref);
                }
            });

            // Write current items
            if (items && items.length > 0) {
                items.forEach(item => {
                    const docRef = this.firestore.collection(col).doc(item.id);
                    const { id: _, ...itemData } = item;
                    batch.set(docRef, itemData, { merge: true });
                });
                totalCount += items.length;
            }

            await batch.commit();
        }

        this.updateCloudStatus('connected', 'Cloud Sync: Active');
        localStorage.setItem(this.KEYS.LAST_SYNC, new Date().toISOString());
        return { totalRecords: totalCount, collections: this.SYNC_COLLECTIONS.length + 1 };
    },

    // --- Helper persistence functions ---
    _getRaw(key) {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : [];
    },

    _saveRaw(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // --- General CRUD API (Optimistic local cache + Cloud Firestore write) ---
    getAll(collection) {
        const key = this.KEYS[collection.toUpperCase()];
        if (!key) return [];
        return this._getRaw(key);
    },

    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === id) || null;
    },

    add(collection, record) {
        const items = this.getAll(collection);
        const currentUser = this.getCurrentUser();
        
        const now = new Date().toISOString();
        const newRecord = {
            ...record,
            id: record.id || this._generateId(collection),
            created_at: record.created_at || now,
            created_by: currentUser ? currentUser.name : (record.created_by || 'System'),
            updated_at: now,
            updated_by: currentUser ? currentUser.name : 'System'
        };

        // 1. Save locally immediately (fast UI response)
        items.push(newRecord);
        this._saveRaw(this.KEYS[collection.toUpperCase()], items);

        // 2. Push to Firestore Cloud
        if (this.firestore) {
            const { id: docId, ...docData } = newRecord;
            this.firestore.collection(collection.toLowerCase()).doc(docId).set(docData)
                .catch(err => console.warn(`Cloud write queued for ${collection}/${docId}:`, err.message));
        }
        
        return newRecord;
    },

    update(collection, id, data) {
        const items = this.getAll(collection);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;

        const currentUser = this.getCurrentUser();
        const { id: _, created_at: __, created_by: ___, ...updateData } = data;

        const updatedRecord = {
            ...items[index],
            ...updateData,
            updated_at: new Date().toISOString(),
            updated_by: currentUser ? currentUser.name : 'System'
        };

        // 1. Save locally immediately
        items[index] = updatedRecord;
        this._saveRaw(this.KEYS[collection.toUpperCase()], items);
        
        // 2. Push update to Firestore Cloud
        if (this.firestore) {
            const { id: docId, ...docData } = updatedRecord;
            this.firestore.collection(collection.toLowerCase()).doc(id).set(docData, { merge: true })
                .catch(err => console.warn(`Cloud update queued for ${collection}/${id}:`, err.message));
        }

        return updatedRecord;
    },

    delete(collection, id) {
        const items = this.getAll(collection);
        const filtered = items.filter(item => item.id !== id);
        if (filtered.length === items.length) return false;

        // 1. Remove locally immediately
        this._saveRaw(this.KEYS[collection.toUpperCase()], filtered);

        // 2. Record tombstone
        const deletedRecords = this._getRaw(this.KEYS.DELETED);
        deletedRecords.push({
            id: id,
            collection: collection.toLowerCase(),
            deleted_at: new Date().toISOString()
        });
        if (deletedRecords.length > 200) {
            deletedRecords.splice(0, deletedRecords.length - 200);
        }
        this._saveRaw(this.KEYS.DELETED, deletedRecords);

        // 3. Delete from Firestore Cloud
        if (this.firestore) {
            this.firestore.collection(collection.toLowerCase()).doc(id).delete()
                .catch(err => console.warn(`Cloud delete queued for ${collection}/${id}:`, err.message));
        }

        return true;
    },

    query(collection, filterFn) {
        return this.getAll(collection).filter(filterFn);
    },

    count(collection, filterFn) {
        if (!filterFn) return this.getAll(collection).length;
        return this.query(collection, filterFn).length;
    },

    // --- Authentication ---
    authenticate(username, password) {
        const users = this.getAll('users');
        const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
            return userWithoutPassword;
        }
        return null;
    },

    getCurrentUser() {
        const user = localStorage.getItem(this.KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    logout() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    },

    // --- Settings ---
    getSettings() {
        const val = localStorage.getItem(this.KEYS.SETTINGS);
        return val ? JSON.parse(val) : { farm_name: 'PigFarm Pro', currency: '₱', date_format: 'YYYY-MM-DD' };
    },

    saveSettings(settings) {
        this._saveRaw(this.KEYS.SETTINGS, settings);
        if (this.firestore) {
            this.firestore.collection('settings').doc('general').set(settings, { merge: true })
                .catch(err => console.warn("Cloud settings save queued:", err.message));
        }
    },

    // --- Backup & Restore (Flat File JSON) ---
    exportAll() {
        const exportData = {
            version: '2.0.0',
            export_date: new Date().toISOString(),
            data: {}
        };

        for (const [name, key] of Object.entries(this.KEYS)) {
            if (key !== this.KEYS.CURRENT_USER) {
                exportData.data[key] = this._getRaw(key);
            }
        }

        return JSON.stringify(exportData, null, 2);
    },

    async importAll(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            const rawData = parsed.data || parsed;

            // 1. Clear current pfm keys
            for (const key of Object.values(this.KEYS)) {
                if (key !== this.KEYS.CURRENT_USER) {
                    localStorage.removeItem(key);
                }
            }

            // 2. Restore all data from backup (supports both pfm_pigs and pigs keys)
            for (const [key, value] of Object.entries(rawData)) {
                if (!Array.isArray(value) && typeof value !== 'object') continue;

                let targetKey = null;
                if (key.startsWith('pfm_')) {
                    targetKey = key;
                } else if (this.KEYS[key.toUpperCase()]) {
                    targetKey = this.KEYS[key.toUpperCase()];
                }

                if (targetKey && targetKey !== this.KEYS.CURRENT_USER) {
                    this._saveRaw(targetKey, value);
                }
            }

            // Restore settings if provided
            if (rawData.pfm_settings || rawData.settings) {
                const s = rawData.pfm_settings || rawData.settings;
                this._saveRaw(this.KEYS.SETTINGS, s);
            }

            // 3. Immediately overwrite Firestore Cloud with this clean restored dataset
            if (this.firestore) {
                await this.uploadAllToCloud();
            }

            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    },

    // Completely wipe all records in Cloud Firestore and LocalStorage
    async clearCloudAndLocal() {
        this.updateCloudStatus('syncing', 'Wiping Database...');

        if (this.firestore) {
            for (const col of this.SYNC_COLLECTIONS) {
                try {
                    const snap = await this.firestore.collection(col).get();
                    if (!snap.empty) {
                        const batch = this.firestore.batch();
                        snap.forEach(doc => batch.delete(doc.ref));
                        await batch.commit();
                    }
                } catch(e) {
                    console.warn(`Error clearing cloud collection ${col}:`, e);
                }
            }
        }

        // Clear local storage (preserve user session and settings)
        for (const key of Object.values(this.KEYS)) {
            if (key !== this.KEYS.CURRENT_USER && key !== this.KEYS.USERS && key !== this.KEYS.SETTINGS) {
                this._saveRaw(key, []);
            }
        }

        this.updateCloudStatus('connected', 'Cloud Sync: Active');
        localStorage.setItem(this.KEYS.LAST_SYNC, new Date().toISOString());
        return true;
    },

    async downloadBackup() {
        const jsonStr = this.exportAll();
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `pigfarm_backup_${dateStr}.json`;
        
        const blob = new Blob([jsonStr], { type: 'application/json' });

        // 1. Mobile Phone Support (iOS Safari PWA & Android): Uses native file share / Save to Files
        if (navigator.canShare && typeof File !== 'undefined') {
            try {
                const file = new File([blob], filename, { type: 'application/json' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: filename,
                        text: 'PigFarm Pro Database Backup'
                    });
                    if (window.App && window.App.showToast) {
                        window.App.showToast('Backup shared / saved successfully!', 'success');
                    }
                    return;
                }
            } catch (err) {
                if (err.name === 'AbortError') return; // User closed the share menu
                console.warn('Native share failed, falling back to download link:', err);
            }
        }

        // 2. Desktop Standard Download (Chrome, Firefox, Edge, Safari Desktop)
        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1500);
            if (window.App && window.App.showToast) {
                window.App.showToast('Backup file downloaded to your device.', 'success');
            }
        } catch (err) {
            // 3. Fallback: Copy raw JSON to clipboard
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(jsonStr);
                if (window.App && window.App.showToast) {
                    window.App.showToast('Backup copied to clipboard!', 'info');
                }
            }
        }
    },

    // --- Dashboard Aggregations ---
    getDashboardStats() {
        const pigs = this.getAll('pigs');
        const expenses = this.getAll('expenses');
        const income = this.getAll('income');
        const feedLogs = this.getAll('feed_logs');
        const medicineLogs = this.getAll('medicine_logs');
        const flocks = this.getAll('flocks');
        const poultryExpenses = this.getAll('poultry_expenses');

        const calculateStatsForOwner = (owner) => {
            // Investment is the purchase price of pigs owned by this owner
            const ownerPigs = pigs.filter(p => owner === 'Combined' ? true : p.owner === owner);
            const investment = ownerPigs.reduce((sum, p) => sum + Number(p.purchase_price || 0), 0);
            const pigCount = ownerPigs.length;

            // Feed Cost for pigs owned by this owner
            const pigIds = new Set(ownerPigs.map(p => p.id));
            const feedCost = feedLogs
                .filter(f => pigIds.has(f.pig_id))
                .reduce((sum, f) => sum + Number(f.cost || 0), 0);

            // Medicine Cost for pigs owned by this owner
            const medicineCost = medicineLogs
                .filter(m => pigIds.has(m.pig_id))
                .reduce((sum, m) => sum + Number(m.cost || 0), 0);

            // Poultry calculations
            const ownerFlocks = flocks.filter(f => owner === 'Combined' ? true : f.owner === owner);
            const poultryInvestment = ownerFlocks.reduce((sum, f) => sum + Number(f.purchase_price || 0), 0);
            
            const flockIds = new Set(ownerFlocks.map(f => f.id));
            const poultryFeedCost = poultryExpenses
                .filter(pe => pe.type === 'Feed' && flockIds.has(pe.flock_id))
                .reduce((sum, pe) => sum + Number(pe.cost || 0), 0);

            const poultryMedicineCost = poultryExpenses
                .filter(pe => pe.type === 'Medicine' && flockIds.has(pe.flock_id))
                .reduce((sum, pe) => sum + Number(pe.cost || 0), 0);

            // Housing Cost is sum of general expenses with category 'Housing' attributed to this owner
            const housingCost = expenses
                .filter(e => e.category === 'Housing' && (owner === 'Combined' ? true : e.owner === owner))
                .reduce((sum, e) => sum + Number(e.amount || 0), 0);

            // Other Expenses is other general expenses (excluding Housing, Feed, Medicine which are recorded in logs)
            const otherExpenses = expenses
                .filter(e => e.category !== 'Housing' && (owner === 'Combined' ? true : e.owner === owner))
                .reduce((sum, e) => sum + Number(e.amount || 0), 0);

            const combinedInvestment = investment + poultryInvestment;
            const combinedFeed = feedCost + poultryFeedCost;
            const combinedMed = medicineCost + poultryMedicineCost;
            
            const totalExpenses = combinedInvestment + combinedFeed + combinedMed + housingCost + otherExpenses;

            // Income matching owner
            const totalIncome = income
                .filter(i => (owner === 'Combined' ? true : i.owner === owner))
                .reduce((sum, i) => sum + Number(i.amount || 0), 0);

            const profit = totalIncome - totalExpenses;
            
            return {
                pigCount,
                flockCount: ownerFlocks.filter(f => f.status === 'Active').length,
                investment: combinedInvestment,
                feedCost: combinedFeed,
                medicineCost: combinedMed,
                housingCost,
                otherExpenses,
                expenses: totalExpenses,
                income: totalIncome,
                profit
            };
        };

        const banjo = calculateStatsForOwner('Banjo');
        const albe = calculateStatsForOwner('Albe');
        const shared = calculateStatsForOwner('Shared');
        const combined = calculateStatsForOwner('Combined');

        return { banjo, albe, shared, combined };
    },

    // --- Report Generator ---
    getReport(owner, startDate, endDate) {
        const pigs = this.getAll('pigs');
        const feedLogs = this.getAll('feed_logs');
        const medicineLogs = this.getAll('medicine_logs');
        const expenses = this.getAll('expenses');
        const income = this.getAll('income');
        const flocks = this.getAll('flocks');
        const poultryExpenses = this.getAll('poultry_expenses');

        // Helper to check date range
        const inRange = (dateStr) => {
            if (!dateStr) return false;
            const d = dateStr.split('T')[0];
            if (startDate && d < startDate) return false;
            if (endDate && d > endDate) return false;
            return true;
        };

        // Filter pigs bought in range
        const ownerPigs = pigs.filter(p => {
            const matchesOwner = (owner === 'Combined' || p.owner === owner);
            return matchesOwner && inRange(p.purchase_date);
        });
        const investment = ownerPigs.reduce((sum, p) => sum + Number(p.purchase_price || 0), 0);

        // Filter flocks bought in range
        const ownerFlocks = flocks.filter(f => {
            const matchesOwner = (owner === 'Combined' || f.owner === owner);
            return matchesOwner && inRange(f.start_date);
        });
        const poultryInvestment = ownerFlocks.reduce((sum, f) => sum + Number(f.purchase_price || 0), 0);

        // Filter logs
        const pigIds = new Set(pigs.filter(p => owner === 'Combined' || p.owner === owner).map(p => p.id));
        const flockIds = new Set(flocks.filter(f => owner === 'Combined' || f.owner === owner).map(f => f.id));
        
        const feedCost = feedLogs
            .filter(f => pigIds.has(f.pig_id) && inRange(f.date))
            .reduce((sum, f) => sum + Number(f.cost || 0), 0);

        const medicineCost = medicineLogs
            .filter(m => pigIds.has(m.pig_id) && inRange(m.date))
            .reduce((sum, m) => sum + Number(m.cost || 0), 0);

        const poultryFeedCost = poultryExpenses
            .filter(pe => pe.type === 'Feed' && flockIds.has(pe.flock_id) && inRange(pe.date))
            .reduce((sum, pe) => sum + Number(pe.cost || 0), 0);

        const poultryMedicineCost = poultryExpenses
            .filter(pe => pe.type === 'Medicine' && flockIds.has(pe.flock_id) && inRange(pe.date))
            .reduce((sum, pe) => sum + Number(pe.cost || 0), 0);

        const housingCost = expenses
            .filter(e => e.category === 'Housing' && (owner === 'Combined' || e.owner === owner) && inRange(e.date))
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const otherExpenses = expenses
            .filter(e => e.category !== 'Housing' && (owner === 'Combined' || e.owner === owner) && inRange(e.date))
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const grossIncome = income
            .filter(i => (owner === 'Combined' || i.owner === owner) && inRange(i.date))
            .reduce((sum, i) => sum + Number(i.amount || 0), 0);

        const combinedInvestment = investment + poultryInvestment;
        const combinedFeed = feedCost + poultryFeedCost;
        const combinedMed = medicineCost + poultryMedicineCost;

        const totalExpenses = combinedInvestment + combinedFeed + combinedMed + housingCost + otherExpenses;
        const netProfit = grossIncome - totalExpenses;
        const roi = combinedInvestment > 0 ? (netProfit / combinedInvestment) * 100 : 0;

        return {
            investment: combinedInvestment,
            feedCost: combinedFeed,
            medicineCost: combinedMed,
            housingCost,
            otherExpenses,
            totalExpenses,
            grossIncome,
            netProfit,
            roi
        };
    },

    // --- Private Helper API ---
    _generateId(prefix) {
        return `${prefix.toLowerCase()}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
    }
};
