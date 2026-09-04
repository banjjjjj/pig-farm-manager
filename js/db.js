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
        POULTRY_EXPENSES: 'pfm_poultry_expenses'
    },

    init() {
        // Seed default users if empty
        if (!localStorage.getItem(this.KEYS.USERS)) {
            const defaultUsers = [
                {
                    id: 'usr_1',
                    name: 'Banjo',
                    username: 'banjo',
                    password: 'password123', // Default password requested
                    role: 'Administrator',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                },
                {
                    id: 'usr_2',
                    name: 'Albe',
                    username: 'albe',
                    password: 'password123', // Default password requested
                    role: 'Manager',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                }
            ];
            this._saveRaw(this.KEYS.USERS, defaultUsers);
        }

        // Seed default settings if empty
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            const defaultSettings = {
                farm_name: 'PigFarm Pro',
                currency: '₱',
                date_format: 'YYYY-MM-DD'
            };
            this._saveRaw(this.KEYS.SETTINGS, defaultSettings);
        }

        // Seed default housing if empty
        if (!localStorage.getItem(this.KEYS.HOUSING)) {
            const defaultHousing = [
                { id: 'house_1', pen_number: 'Pen A1', type: 'Farrowing', capacity: 5, location: 'Building A', status: 'Active', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'house_2', pen_number: 'Pen B1', type: 'Growing', capacity: 10, location: 'Building B', status: 'Active', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'house_3', pen_number: 'Pen C1', type: 'Finishing', capacity: 8, location: 'Building C', status: 'Active', created_at: new Date().toISOString(), created_by: 'System' }
            ];
            this._saveRaw(this.KEYS.HOUSING, defaultHousing);
        }

        // Seed default batches if empty
        if (!localStorage.getItem(this.KEYS.BATCHES)) {
            const defaultBatches = [
                {
                    id: 'batch_1',
                    name: 'Duroc Growth Batch',
                    description: 'Batch of Duroc weaners started in March',
                    owner: 'Banjo',
                    status: 'Active',
                    start_date: '2026-03-01',
                    sale_date: '',
                    purchase_price_total: 11000,
                    sale_price_total: 0,
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                },
                {
                    id: 'batch_2',
                    name: 'Q1 Market Sale',
                    description: 'Pigs sold to meat processor in May',
                    owner: 'Shared',
                    status: 'Sold',
                    start_date: '2026-01-15',
                    sale_date: '2026-05-20',
                    purchase_price_total: 5000,
                    sale_price_total: 12000,
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                }
            ];
            this._saveRaw(this.KEYS.BATCHES, defaultBatches);
        }

        // Seed some mock pigs & records if database is empty of pigs to make it look active on first open
        if (!localStorage.getItem(this.KEYS.PIGS)) {
            const now = new Date();
            const birth1 = new Date(); birth1.setMonth(now.getMonth() - 4);
            const birth2 = new Date(); birth2.setMonth(now.getMonth() - 2);
            const birth3 = new Date(); birth3.setMonth(now.getMonth() - 6);

            const defaultPigs = [
                { id: 'pig_1', name: 'Duroc Star', tag: 'D-101', breed: 'Duroc', birth_date: birth1.toISOString().split('T')[0], gender: 'Boar', status: 'Active', owner: 'Banjo', housing_id: 'house_2', purchase_price: 5000, purchase_date: birth1.toISOString().split('T')[0], batch_id: 'batch_1', notes: 'High growth rate potential', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'pig_2', name: 'Landrace Queen', tag: 'L-202', breed: 'Landrace', birth_date: birth2.toISOString().split('T')[0], gender: 'Sow', status: 'Active', owner: 'Albe', housing_id: 'house_1', purchase_price: 6000, purchase_date: birth2.toISOString().split('T')[0], batch_id: 'batch_1', notes: 'Docile temperament', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'pig_3', name: 'Shared Breeder', tag: 'S-303', breed: 'Large White', birth_date: birth3.toISOString().split('T')[0], gender: 'Sow', status: 'Breeding', owner: 'Shared', housing_id: 'house_1', purchase_price: 7500, purchase_date: birth3.toISOString().split('T')[0], batch_id: '', notes: 'First litter expected soon', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'pig_4', name: 'Market Bacon', tag: 'M-404', breed: 'Berkshire', birth_date: birth3.toISOString().split('T')[0], gender: 'Barrow', status: 'Sold', owner: 'Shared', housing_id: '', purchase_price: 5000, purchase_date: birth3.toISOString().split('T')[0], batch_id: 'batch_2', notes: 'Sold as part of Q1 Market Sale batch on 2026-05-20', created_at: new Date().toISOString(), created_by: 'System' }
            ];
            this._saveRaw(this.KEYS.PIGS, defaultPigs);

            // Seed feed logs
            const defaultFeed = [
                { id: 'feed_1', pig_id: 'pig_1', feed_type: 'Grower', quantity_kg: 25, cost: 1250, date: now.toISOString().split('T')[0], notes: 'Regular feed schedule', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'feed_2', pig_id: 'pig_2', feed_type: 'Starter', quantity_kg: 10, cost: 600, date: now.toISOString().split('T')[0], notes: 'Transition feed', created_at: new Date().toISOString(), created_by: 'System' }
            ];
            this._saveRaw(this.KEYS.FEED, defaultFeed);

            // Seed med logs
            const defaultMeds = [
                { id: 'med_1', pig_id: 'pig_1', medicine_name: 'Iron Injection', dosage: '2ml', cost: 150, date: now.toISOString().split('T')[0], purpose: 'Supplement', notes: 'Routine supplement at early stage', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'med_2', pig_id: 'pig_3', medicine_name: 'Parvovirus Vaccine', dosage: '2ml', cost: 350, date: now.toISOString().split('T')[0], purpose: 'Vaccination', notes: 'Pre-breeding vaccination', created_at: new Date().toISOString(), created_by: 'System' }
            ];
            this._saveRaw(this.KEYS.MEDICINE, defaultMeds);

            // Seed weight logs
            const defaultWeights = [
                { id: 'weight_1', pig_id: 'pig_1', weight_kg: 45, date: now.toISOString().split('T')[0], notes: 'Healthy growth', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'weight_2', pig_id: 'pig_2', weight_kg: 22, date: now.toISOString().split('T')[0], notes: 'Slightly underweight, monitoring', created_at: new Date().toISOString(), created_by: 'System' }
            ];
            this._saveRaw(this.KEYS.WEIGHT, defaultWeights);

            // Seed expenses
            const defaultExpenses = [
                { id: 'exp_1', category: 'Housing', description: 'Repair pen A1 door', amount: 800, owner: 'Banjo', date: now.toISOString().split('T')[0], pig_id: '', notes: 'Door hinge replacement', created_at: new Date().toISOString(), created_by: 'System' },
                { id: 'exp_2', category: 'Equipment', description: 'Nipple drinker replacement', amount: 450, owner: 'Shared', date: now.toISOString().split('T')[0], pig_id: '', notes: 'Pen B1 drinkers', created_at: new Date().toISOString(), created_by: 'System' }
            ];
            this._saveRaw(this.KEYS.EXPENSES, defaultExpenses);

            // Seed income
            const defaultIncome = [
                { id: 'inc_1', source: 'Manure', description: 'Sold 10 bags of organic manure', amount: 500, owner: 'Albe', date: now.toISOString().split('T')[0], pig_id: '', notes: 'Local farm purchase', created_at: new Date().toISOString(), created_by: 'System' }
            ];
            this._saveRaw(this.KEYS.INCOME, defaultIncome);

            // Seed Poultry Flocks
            const defaultFlocks = [
                {
                    id: 'flock_1',
                    name: 'Lohmann layers 2026-A',
                    breed: 'Lohmann Brown',
                    type: 'Layer',
                    start_date: '2026-04-01',
                    initial_count: 300,
                    current_count: 298,
                    status: 'Active',
                    coop_id: 'Coop A',
                    owner: 'Banjo',
                    purchase_price: 15000,
                    notes: 'High yield layer flock',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                },
                {
                    id: 'flock_2',
                    name: 'Broilers Q2 batch',
                    breed: 'Cobb 500',
                    type: 'Broiler',
                    start_date: '2026-05-10',
                    initial_count: 500,
                    current_count: 0,
                    status: 'Sold',
                    coop_id: 'Coop B',
                    owner: 'Shared',
                    purchase_price: 10000,
                    sale_price_total: 65000,
                    sale_date: '2026-07-15',
                    notes: 'Successfully harvested and sold to wholesale',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                }
            ];
            this._saveRaw(this.KEYS.FLOCKS, defaultFlocks);

            // Seed Poultry Daily Logs
            const defaultDaily = [
                {
                    id: 'pld_1',
                    flock_id: 'flock_1',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    collected_qty: 260,
                    cracked_qty: 4,
                    mortality_qty: 1,
                    notes: 'Standard yield. 1 bird deceased.',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                },
                {
                    id: 'pld_2',
                    flock_id: 'flock_1',
                    date: new Date().toISOString().split('T')[0],
                    collected_qty: 255,
                    cracked_qty: 3,
                    mortality_qty: 1,
                    notes: 'Stable collection. 1 bird culled.',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                }
            ];
            this._saveRaw(this.KEYS.POULTRY_DAILY, defaultDaily);

            // Seed Poultry Expense Logs
            const defaultPoultryExp = [
                {
                    id: 'ple_1',
                    flock_id: 'flock_1',
                    type: 'Feed',
                    item_name: 'Layer Mash',
                    quantity_kg: 50,
                    cost: 1800,
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    notes: '1 bag feeding',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                },
                {
                    id: 'ple_2',
                    flock_id: 'flock_1',
                    type: 'Medicine',
                    item_name: 'Newcastle Disease Vaccine',
                    dosage: 'flock-wide water treatment',
                    cost: 1200,
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    notes: 'Routine vaccination',
                    created_at: new Date().toISOString(),
                    created_by: 'System'
                }
            ];
            this._saveRaw(this.KEYS.POULTRY_EXPENSES, defaultPoultryExp);
        }
    },

    // --- Helper persistence functions ---
    _getRaw(key) {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : [];
    },

    _saveRaw(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // --- General CRUD API ---
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
        
        // Generate automatic fields
        const newRecord = {
            ...record,
            id: this._generateId(collection),
            created_at: new Date().toISOString(),
            created_by: currentUser ? currentUser.name : 'System',
            updated_at: '',
            updated_by: ''
        };

        items.push(newRecord);
        this._saveRaw(this.KEYS[collection.toUpperCase()], items);
        
        // Return cloned copy of the record
        return newRecord;
    },

    update(collection, id, data) {
        const items = this.getAll(collection);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;

        const currentUser = this.getCurrentUser();
        
        // Strip properties that shouldn't be overwritten
        const { id: _, created_at: __, created_by: ___, ...updateData } = data;

        const updatedRecord = {
            ...items[index],
            ...updateData,
            updated_at: new Date().toISOString(),
            updated_by: currentUser ? currentUser.name : 'System'
        };

        items[index] = updatedRecord;
        this._saveRaw(this.KEYS[collection.toUpperCase()], items);
        
        return updatedRecord;
    },

    delete(collection, id) {
        const items = this.getAll(collection);
        const filtered = items.filter(item => item.id !== id);
        if (filtered.length === items.length) return false;

        this._saveRaw(this.KEYS[collection.toUpperCase()], filtered);
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
        const settings = localStorage.getItem(this.KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : { farm_name: 'PigFarm Pro', currency: '₱' };
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    // --- Backup & Restore ---
    exportAll() {
        const backup = {
            metadata: {
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            },
            data: {}
        };
        for (const [key, value] of Object.entries(this.KEYS)) {
            const rawVal = localStorage.getItem(value);
            if (rawVal) {
                backup.data[value] = JSON.parse(rawVal);
            }
        }
        return JSON.stringify(backup);
    },

    importAll(jsonString) {
        try {
            const backup = JSON.parse(jsonString);
            if (!backup.data || !backup.metadata) return false;
            
            // Clear current pfm keys
            for (const key of Object.values(this.KEYS)) {
                localStorage.removeItem(key);
            }

            // Restore from backup
            for (const [key, value] of Object.entries(backup.data)) {
                localStorage.setItem(key, JSON.stringify(value));
            }
            // Re-init defaults just in case
            this.init();
            return true;
        } catch (e) {
            console.error('Failed to import backup', e);
            return false;
        }
    },

    downloadBackup() {
        const dataStr = this.exportAll();
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `pigfarm_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
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
