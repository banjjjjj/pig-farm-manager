// Dynamic Page Modules for Pig Farm Management System
window.Pages = {};

// ==========================================
// 1. DASHBOARD PAGE
// ==========================================
Pages.dashboard = {
    _charts: [],

    render() {
        const stats = DB.getDashboardStats();
        const settings = DB.getSettings();
        const user = App.currentUser;

        return `
            <div class="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p class="text-muted">Welcome back, ${user.name} (${user.role}). Here is your farm overview.</p>
                </div>
            </div>

            <!-- Owner Investment & Profits Summary -->
            <h2 class="section-title">Owner Summaries</h2>
            <div class="dashboard-grid">
                <!-- Banjo Card -->
                <div class="stat-card stat-card--banjo">
                    <div class="stat-card-icon">👑</div>
                    <div class="stat-card-content">
                        <h3>Banjo (Administrator)</h3>
                        <div class="stat-row"><span>Pigs Owned:</span> <strong>${stats.banjo.pigCount}</strong></div>
                        <div class="stat-row"><span>Total Investment:</span> <strong>${App.formatCurrency(stats.banjo.investment)}</strong></div>
                        <div class="stat-row"><span>Total Profit:</span> <strong class="${stats.banjo.profit >= 0 ? 'text-success' : 'text-danger'}">${App.formatCurrency(stats.banjo.profit)}</strong></div>
                    </div>
                </div>

                <!-- Albe Card -->
                <div class="stat-card stat-card--albe">
                    <div class="stat-card-icon">💼</div>
                    <div class="stat-card-content">
                        <h3>Albe (Manager)</h3>
                        <div class="stat-row"><span>Pigs Owned:</span> <strong>${stats.albe.pigCount}</strong></div>
                        <div class="stat-row"><span>Total Investment:</span> <strong>${App.formatCurrency(stats.albe.investment)}</strong></div>
                        <div class="stat-row"><span>Total Profit:</span> <strong class="${stats.albe.profit >= 0 ? 'text-success' : 'text-danger'}">${App.formatCurrency(stats.albe.profit)}</strong></div>
                    </div>
                </div>

                <!-- Shared Card -->
                <div class="stat-card stat-card--shared">
                    <div class="stat-card-icon">🤝</div>
                    <div class="stat-card-content">
                        <h3>Shared Operations</h3>
                        <div class="stat-row"><span>Pigs Owned:</span> <strong>${stats.shared.pigCount}</strong></div>
                        <div class="stat-row"><span>Total Investment:</span> <strong>${App.formatCurrency(stats.shared.investment)}</strong></div>
                        <div class="stat-row"><span>Total Profit:</span> <strong class="${stats.shared.profit >= 0 ? 'text-success' : 'text-danger'}">${App.formatCurrency(stats.shared.profit)}</strong></div>
                    </div>
                </div>
            </div>

            <!-- Combined Stats Grid -->
            <h2 class="section-title mt-4">Combined Farm Totals</h2>
            <div class="dashboard-grid">
                <div class="card stat-mini">
                    <div class="text-muted">Total Pigs Active</div>
                    <div class="value">${stats.combined.pigCount}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Total Investment</div>
                    <div class="value">${App.formatCurrency(stats.combined.investment)}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Combined Expenses</div>
                    <div class="value text-danger">${App.formatCurrency(stats.combined.expenses)}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Combined Farm Profit</div>
                    <div class="value ${stats.combined.profit >= 0 ? 'text-success' : 'text-danger'}">
                        ${App.formatCurrency(stats.combined.profit)}
                    </div>
                </div>
            </div>

            <!-- Financial Table & Charts -->
            <div class="dashboard-grid mt-4" style="grid-template-columns: 2fr 1fr;">
                <!-- Table Card -->
                <div class="card">
                    <h3>Financial Breakdown</h3>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Owner</th>
                                    <th>Pigs</th>
                                    <th>Investment</th>
                                    <th>Feed Cost</th>
                                    <th>Med Cost</th>
                                    <th>Other Exp</th>
                                    <th>Total Exp</th>
                                    <th>Income</th>
                                    <th>Net Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${App.ownerBadge('Banjo')}</td>
                                    <td>${stats.banjo.pigCount}</td>
                                    <td>${App.formatCurrency(stats.banjo.investment)}</td>
                                    <td>${App.formatCurrency(stats.banjo.feedCost)}</td>
                                    <td>${App.formatCurrency(stats.banjo.medicineCost)}</td>
                                    <td>${App.formatCurrency(stats.banjo.housingCost + stats.banjo.otherExpenses)}</td>
                                    <td class="text-danger">${App.formatCurrency(stats.banjo.expenses)}</td>
                                    <td class="text-success">${App.formatCurrency(stats.banjo.income)}</td>
                                    <td class="${stats.banjo.profit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(stats.banjo.profit)}</td>
                                </tr>
                                <tr>
                                    <td>${App.ownerBadge('Albe')}</td>
                                    <td>${stats.albe.pigCount}</td>
                                    <td>${App.formatCurrency(stats.albe.investment)}</td>
                                    <td>${App.formatCurrency(stats.albe.feedCost)}</td>
                                    <td>${App.formatCurrency(stats.albe.medicineCost)}</td>
                                    <td>${App.formatCurrency(stats.albe.housingCost + stats.albe.otherExpenses)}</td>
                                    <td class="text-danger">${App.formatCurrency(stats.albe.expenses)}</td>
                                    <td class="text-success">${App.formatCurrency(stats.albe.income)}</td>
                                    <td class="${stats.albe.profit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(stats.albe.profit)}</td>
                                </tr>
                                <tr>
                                    <td>${App.ownerBadge('Shared')}</td>
                                    <td>${stats.shared.pigCount}</td>
                                    <td>${App.formatCurrency(stats.shared.investment)}</td>
                                    <td>${App.formatCurrency(stats.shared.feedCost)}</td>
                                    <td>${App.formatCurrency(stats.shared.medicineCost)}</td>
                                    <td>${App.formatCurrency(stats.shared.housingCost + stats.shared.otherExpenses)}</td>
                                    <td class="text-danger">${App.formatCurrency(stats.shared.expenses)}</td>
                                    <td class="text-success">${App.formatCurrency(stats.shared.income)}</td>
                                    <td class="${stats.shared.profit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(stats.shared.profit)}</td>
                                </tr>
                                <tr style="border-top: 2px solid var(--glass-border); background: rgba(255,255,255,0.02)">
                                    <td><strong>Combined Farm</strong></td>
                                    <td><strong>${stats.combined.pigCount}</strong></td>
                                    <td><strong>${App.formatCurrency(stats.combined.investment)}</strong></td>
                                    <td><strong>${App.formatCurrency(stats.combined.feedCost)}</strong></td>
                                    <td><strong>${App.formatCurrency(stats.combined.medicineCost)}</strong></td>
                                    <td><strong>${App.formatCurrency(stats.combined.housingCost + stats.combined.otherExpenses)}</strong></td>
                                    <td class="text-danger"><strong>${App.formatCurrency(stats.combined.expenses)}</strong></td>
                                    <td class="text-success"><strong>${App.formatCurrency(stats.combined.income)}</strong></td>
                                    <td class="${stats.combined.profit >= 0 ? 'text-success' : 'text-danger'} font-bold"><strong>${App.formatCurrency(stats.combined.profit)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recent Activities -->
                <div class="card">
                    <h3>Recent Activity</h3>
                    <div id="recent-activity-list" class="activity-list">
                        <!-- Loaded dynamically in init() -->
                    </div>
                </div>
            </div>

            </div>
        `;
    },

    init() {
        this.renderActivityLog();
    },

    renderActivityLog() {
        const listEl = document.getElementById('recent-activity-list');
        if (!listEl) return;

        // Collect logs across tables
        const activities = [];

        DB.getAll('pigs').forEach(p => {
            activities.push({
                type: 'pig',
                text: `Pig [${p.tag}] ${p.name} added`,
                date: p.created_at,
                owner: p.owner,
                emoji: '🐷'
            });
        });

        DB.getAll('feed_logs').forEach(f => {
            const pig = DB.getById('pigs', f.pig_id);
            activities.push({
                type: 'feed',
                text: `Recorded feed for ${pig ? pig.name : 'Unknown Pig'}: ${f.quantity_kg}kg (${f.feed_type})`,
                date: f.created_at,
                owner: pig ? pig.owner : 'Shared',
                emoji: '🌾'
            });
        });

        DB.getAll('medicine_logs').forEach(m => {
            const pig = DB.getById('pigs', m.pig_id);
            activities.push({
                type: 'med',
                text: `Administered ${m.medicine_name} to ${pig ? pig.name : 'Unknown Pig'}`,
                date: m.created_at,
                owner: pig ? pig.owner : 'Shared',
                emoji: '💊'
            });
        });

        DB.getAll('expenses').forEach(e => {
            activities.push({
                type: 'expense',
                text: `Expense recorded: ${e.description} (${App.formatCurrency(e.amount)})`,
                date: e.created_at,
                owner: e.owner,
                emoji: '💸'
            });
        });

        DB.getAll('income').forEach(i => {
            activities.push({
                type: 'income',
                text: `Income recorded: ${i.description} (${App.formatCurrency(i.amount)})`,
                date: i.created_at,
                owner: i.owner,
                emoji: '💰'
            });
        });

        // Sort descending by date
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get top 10
        const top10 = activities.slice(0, 10);

        if (top10.length === 0) {
            listEl.innerHTML = `<p class="text-muted">No recent activities found.</p>`;
            return;
        }

        listEl.innerHTML = top10.map(act => `
            <div class="activity-item">
                <div class="activity-emoji">${act.emoji}</div>
                <div class="activity-details">
                    <p class="activity-text">${act.text}</p>
                    <div class="activity-meta">
                        ${App.ownerBadge(act.owner)}
                        <span class="activity-time">${App.formatDateTime(act.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

// ==========================================
// 2. PIG MANAGEMENT PAGE
// ==========================================
Pages.pigs = {
    render() {
        const canCreate = App.hasPermission('pigs', 'create');
        const pigs = DB.getAll('pigs');

        return `
            <div class="page-header">
                <div>
                    <h1>Pig Records</h1>
                    <p class="text-muted">Manage pig health, lineage, ownership, and locations.</p>
                </div>
                ${canCreate ? `<button class="btn btn-primary" id="add-pig-btn">🐷 Add New Pig</button>` : ''}
            </div>

            <!-- Summary metrics -->
            <div class="dashboard-grid mb-4">
                <div class="card stat-mini">
                    <div class="text-muted">Total Pig Count</div>
                    <div class="value">${pigs.length}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Banjo's Pigs</div>
                    <div class="value">${pigs.filter(p => p.owner === 'Banjo').length}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Albe's Pigs</div>
                    <div class="value">${pigs.filter(p => p.owner === 'Albe').length}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Shared Pigs</div>
                    <div class="value">${pigs.filter(p => p.owner === 'Shared').length}</div>
                </div>
            </div>

            <!-- Filters -->
            <div class="card filter-bar mb-4">
                <div class="form-group mb-0" style="flex: 1; min-width: 200px;">
                    <input type="text" id="pig-search" class="form-control" placeholder="Search by name, breed, tag...">
                </div>
                <div class="form-group mb-0" style="min-width: 150px;">
                    <select id="filter-owner" class="form-control">
                        <option value="">All Owners</option>
                        <option value="Banjo">Banjo</option>
                        <option value="Albe">Albe</option>
                        <option value="Shared">Shared</option>
                    </select>
                </div>
                <div class="form-group mb-0" style="min-width: 150px;">
                    <select id="filter-status" class="form-control">
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Breeding">Breeding</option>
                        <option value="Sold">Sold</option>
                        <option value="Deceased">Deceased</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Ear Tag</th>
                                <th>Name</th>
                                <th>Breed</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th>Pen/Housing</th>
                                <th>Price</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="pigs-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                    </table>
                </div>
                <div id="pigs-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">🐷</div>
                    <h3>No pigs found</h3>
                    <p>Try adjusting your search criteria or register a new pig.</p>
                </div>
            </div>
        `;
    },

    init() {
        this.loadPigsTable();

        // Listeners for filters
        document.getElementById('pig-search').oninput = () => this.loadPigsTable();
        document.getElementById('filter-owner').onchange = () => this.loadPigsTable();
        document.getElementById('filter-status').onchange = () => this.loadPigsTable();

        // Add Pig listener
        const addBtn = document.getElementById('add-pig-btn');
        if (addBtn) {
            addBtn.onclick = () => this.openPigModal();
        }
    },

    calculateAge(birthDateStr) {
        if (!birthDateStr) return '—';
        const birth = new Date(birthDateStr);
        const now = new Date();
        const diffTime = Math.abs(now - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) return `${diffDays} days`;
        const diffMonths = Math.floor(diffDays / 30.4);
        if (diffMonths < 12) return `${diffMonths} months`;
        const years = Math.floor(diffMonths / 12);
        const remainingMonths = diffMonths % 12;
        return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
    },

    loadPigsTable() {
        const queryVal = document.getElementById('pig-search');
        const query = queryVal ? queryVal.value.toLowerCase() : '';
        
        const ownerFilterVal = document.getElementById('filter-owner');
        const ownerFilter = ownerFilterVal ? ownerFilterVal.value : '';
        
        const statusFilterVal = document.getElementById('filter-status');
        const statusFilter = statusFilterVal ? statusFilterVal.value : '';

        const pigs = DB.getAll('pigs');
        const housingList = DB.getAll('housing');

        const filtered = pigs.filter(p => {
            const matchesQuery = p.name.toLowerCase().includes(query) || 
                                 p.tag.toLowerCase().includes(query) || 
                                 p.breed.toLowerCase().includes(query);
            const matchesOwner = !ownerFilter || p.owner === ownerFilter;
            const matchesStatus = !statusFilter || p.status === statusFilter;
            return matchesQuery && matchesOwner && matchesStatus;
        });

        const tbody = document.getElementById('pigs-table-body');
        const emptyState = document.getElementById('pigs-empty-state');

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        tbody.innerHTML = filtered.map(p => {
            const pen = housingList.find(h => h.id === p.housing_id);
            const canUpdate = App.hasPermission('pigs', 'update');
            const canDelete = App.hasPermission('pigs', 'delete');

            return `
                <tr>
                    <td><strong>${p.tag}</strong></td>
                    <td>${p.name}</td>
                    <td>${p.breed}</td>
                    <td>${p.gender}</td>
                    <td>${this.calculateAge(p.birth_date)}</td>
                    <td>${App.ownerBadge(p.owner)}</td>
                    <td>${App.statusBadge(p.status)}</td>
                    <td>${pen ? pen.pen_number : '<span class="text-muted">Unassigned</span>'}</td>
                    <td>${App.formatCurrency(p.purchase_price)}</td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-secondary" onclick="Pages.pigs.viewDetails('${p.id}')">View</button>
                            ${canUpdate ? `<button class="btn btn-sm btn-success" onclick="Pages.pigs.openPigModal('${p.id}')">Edit</button>` : ''}
                            ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="Pages.pigs.deletePig('${p.id}')">Delete</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    viewDetails(id) {
        const pig = DB.getById('pigs', id);
        if (!pig) return;

        const pen = DB.getById('housing', pig.housing_id);
        const batch = pig.batch_id ? DB.getById('batches', pig.batch_id) : null;
        const weightLogs = DB.getAll('weight_logs').filter(w => w.pig_id === id);
        
        let lastWeight = '—';
        if (weightLogs.length > 0) {
            weightLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            lastWeight = `${weightLogs[0].weight_kg} kg`;
        }

        const bodyHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div><span class="text-muted">Name:</span> <p style="font-size: 1.1rem; margin-top: 4px;"><strong>${pig.name}</strong></p></div>
                <div><span class="text-muted">Ear Tag:</span> <p style="font-size: 1.1rem; margin-top: 4px;"><strong>${pig.tag}</strong></p></div>
                <div><span class="text-muted">Breed:</span> <p style="margin-top: 4px;">${pig.breed}</p></div>
                <div><span class="text-muted">Gender:</span> <p style="margin-top: 4px;">${pig.gender}</p></div>
                <div><span class="text-muted">Birth Date:</span> <p style="margin-top: 4px;">${App.formatDate(pig.birth_date)}</p></div>
                <div><span class="text-muted">Age:</span> <p style="margin-top: 4px;">${this.calculateAge(pig.birth_date)}</p></div>
                <div><span class="text-muted">Owner:</span> <p style="margin-top: 4px;">${App.ownerBadge(pig.owner)}</p></div>
                <div><span class="text-muted">Status:</span> <p style="margin-top: 4px;">${App.statusBadge(pig.status)}</p></div>
                <div><span class="text-muted">Current Pen:</span> <p style="margin-top: 4px;">${pen ? `${pen.pen_number} (${pen.location})` : 'Unassigned'}</p></div>
                <div><span class="text-muted">Batch Group:</span> <p style="margin-top: 4px;">${batch ? `<strong>${batch.name}</strong>` : '<span class="text-muted">None</span>'}</p></div>
                <div><span class="text-muted">Last Weight:</span> <p style="margin-top: 4px;"><strong>${lastWeight}</strong></p></div>
                <div><span class="text-muted">Purchase Price:</span> <p style="margin-top: 4px;">${App.formatCurrency(pig.purchase_price)}</p></div>
                <div><span class="text-muted">Purchase Date:</span> <p style="margin-top: 4px;">${App.formatDate(pig.purchase_date)}</p></div>
            </div>
            <div style="margin-bottom: 16px;">
                <span class="text-muted">Notes:</span>
                <p style="margin-top: 4px; font-style: italic;">${pig.notes || 'No notes added.'}</p>
            </div>
            ${App.auditInfo(pig)}
        `;

        App.showModal(`Pig Details: ${pig.tag}`, bodyHTML);
    },

    openPigModal(id = '') {
        const pig = id ? DB.getById('pigs', id) : null;
        const title = pig ? 'Edit Pig Record' : 'Register New Pig';

        const bodyHTML = `
            <form id="pig-form">
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Ear Tag *</label>
                        <input type="text" id="form-pig-tag" class="form-control" value="${pig ? pig.tag : ''}" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Pig Name *</label>
                        <input type="text" id="form-pig-name" class="form-control" value="${pig ? pig.name : ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Breed *</label>
                        <input type="text" id="form-pig-breed" class="form-control" value="${pig ? pig.breed : 'Large White'}" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Gender *</label>
                        <select id="form-pig-gender" class="form-control">
                            <option value="Boar" ${pig && pig.gender === 'Boar' ? 'selected' : ''}>Boar (Intact Male)</option>
                            <option value="Sow" ${pig && pig.gender === 'Sow' ? 'selected' : ''}>Sow (Mother Female)</option>
                            <option value="Barrow" ${pig && pig.gender === 'Barrow' ? 'selected' : ''}>Barrow (Castrated Male)</option>
                            <option value="Gilt" ${pig && pig.gender === 'Gilt' ? 'selected' : ''}>Gilt (Young Female)</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Birth Date *</label>
                        <input type="date" id="form-pig-birth" class="form-control" value="${pig ? pig.birth_date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Owner *</label>
                        <select id="form-pig-owner" class="form-control">
                            ${App.ownerOptions(pig ? pig.owner : 'Shared')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Housing / Pen</label>
                        <select id="form-pig-housing" class="form-control">
                            ${App.housingOptions(pig ? pig.housing_id : '')}
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Status *</label>
                        <select id="form-pig-status" class="form-control">
                            <option value="Active" ${pig && pig.status === 'Active' ? 'selected' : ''}>Active / Growing</option>
                            <option value="Breeding" ${pig && pig.status === 'Breeding' ? 'selected' : ''}>Breeding</option>
                            <option value="Sold" ${pig && pig.status === 'Sold' ? 'selected' : ''}>Sold</option>
                            <option value="Deceased" ${pig && pig.status === 'Deceased' ? 'selected' : ''}>Deceased</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Purchase Price (₱)</label>
                        <input type="number" id="form-pig-price" class="form-control" value="${pig ? pig.purchase_price : '0'}" min="0">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Purchase Date</label>
                        <input type="date" id="form-pig-purchasedate" class="form-control" value="${pig ? pig.purchase_date : ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Batch Assignment (Optional)</label>
                        <select id="form-pig-batch" class="form-control">
                            ${App.batchOptions(pig ? pig.batch_id : '')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea id="form-pig-notes" class="form-control" rows="2">${pig ? pig.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-pig-btn">Save Pig</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-pig-btn').onclick = () => {
            const form = document.getElementById('pig-form');
            if (!form.reportValidity()) return;

            const tag = document.getElementById('form-pig-tag').value.trim();
            const name = document.getElementById('form-pig-name').value.trim();
            const breed = document.getElementById('form-pig-breed').value.trim();
            const gender = document.getElementById('form-pig-gender').value;
            const birth_date = document.getElementById('form-pig-birth').value;
            const owner = document.getElementById('form-pig-owner').value;
            const housing_id = document.getElementById('form-pig-housing').value;
            const status = document.getElementById('form-pig-status').value;
            const purchase_price = Number(document.getElementById('form-pig-price').value || 0);
            const purchase_date = document.getElementById('form-pig-purchasedate').value;
            const batch_id = document.getElementById('form-pig-batch').value;
            const notes = document.getElementById('form-pig-notes').value.trim();

            // Validate ear tag uniqueness if new pig
            const allPigs = DB.getAll('pigs');
            const duplicate = allPigs.find(p => p.tag.toLowerCase() === tag.toLowerCase() && p.id !== id);
            if (duplicate) {
                App.showToast(`A pig with Ear Tag [${tag}] already exists.`, 'error');
                return;
            }

            const data = { tag, name, breed, gender, birth_date, owner, housing_id, status, purchase_price, purchase_date, batch_id, notes };

            if (pig) {
                DB.update('pigs', id, data);
                App.showToast('Pig record updated successfully.', 'success');
            } else {
                DB.add('pigs', data);
                App.showToast('Pig registered successfully.', 'success');
            }

            App.closeModal();
            this.loadPigsTable();
        };
    },

    async deletePig(id) {
        const pig = DB.getById('pigs', id);
        if (!pig) return;

        const confirmDelete = await App.confirm(`Are you absolutely sure you want to delete pig [${pig.tag}] "${pig.name}"? All logs for this pig will remain but become disconnected.`);
        if (confirmDelete) {
            DB.delete('pigs', id);
            App.showToast('Pig record deleted.', 'success');
            this.loadPigsTable();
        }
    }
};

// ==========================================
// 3. FEEDING RECORDS PAGE
// ==========================================
Pages.feeding = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>Feeding Logs</h1>
                    <p class="text-muted">Track pig feed consumption and feed bag costs.</p>
                </div>
                <button class="btn btn-primary" id="add-feed-btn">🌾 Record Feed Intake</button>
            </div>

            <!-- Filters -->
            <div class="card filter-bar mb-4">
                <div class="form-group mb-0" style="flex: 1; min-width: 200px;">
                    <select id="feed-filter-pig" class="form-control">
                        <option value="">All Pigs</option>
                        ${App.pigOptions()}
                    </select>
                </div>
            </div>

            <!-- Table Card -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Pig Tag</th>
                                <th>Pig Name</th>
                                <th>Owner</th>
                                <th>Feed Type</th>
                                <th>Quantity (kg)</th>
                                <th>Cost (₱)</th>
                                <th>Notes</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="feed-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                        <tfoot>
                            <tr style="background: rgba(255,255,255,0.02)">
                                <td colspan="5"><strong>Totals</strong></td>
                                <td id="feed-total-qty"><strong>0 kg</strong></td>
                                <td id="feed-total-cost" colspan="3"><strong>₱ 0.00</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div id="feed-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">🌾</div>
                    <h3>No feeding records</h3>
                    <p>Add a new feeding entry to populate the database.</p>
                </div>
            </div>
        `;
    },

    init() {
        this.loadFeedingTable();
        document.getElementById('feed-filter-pig').onchange = () => this.loadFeedingTable();
        document.getElementById('add-feed-btn').onclick = () => this.openFeedModal();
    },

    loadFeedingTable() {
        const pigFilterVal = document.getElementById('feed-filter-pig');
        const pigFilter = pigFilterVal ? pigFilterVal.value : '';

        const feedLogs = DB.getAll('feed_logs');
        const pigs = DB.getAll('pigs');

        const filtered = feedLogs.filter(f => !pigFilter || f.pig_id === pigFilter);
        
        // Sort descending by date
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('feed-table-body');
        const emptyState = document.getElementById('feed-empty-state');

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            document.getElementById('feed-total-qty').innerHTML = '<strong>0 kg</strong>';
            document.getElementById('feed-total-cost').innerHTML = '<strong>₱ 0.00</strong>';
            return;
        }

        emptyState.classList.add('hidden');
        
        let totalQty = 0;
        let totalCost = 0;

        tbody.innerHTML = filtered.map(f => {
            const pig = pigs.find(p => p.id === f.pig_id);
            totalQty += Number(f.quantity_kg || 0);
            totalCost += Number(f.cost || 0);

            return `
                <tr>
                    <td>${App.formatDate(f.date)}</td>
                    <td><strong>${pig ? pig.tag : '—'}</strong></td>
                    <td>${pig ? pig.name : '<span class="text-danger">Pig Deleted</span>'}</td>
                    <td>${pig ? App.ownerBadge(pig.owner) : '—'}</td>
                    <td>${f.feed_type}</td>
                    <td>${f.quantity_kg} kg</td>
                    <td>${App.formatCurrency(f.cost)}</td>
                    <td><small>${f.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.feeding.openFeedModal('${f.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.feeding.deleteFeed('${f.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('feed-total-qty').innerHTML = `<strong>${totalQty.toLocaleString()} kg</strong>`;
        document.getElementById('feed-total-cost').innerHTML = `<strong>${App.formatCurrency(totalCost)}</strong>`;
    },

    openFeedModal(id = '') {
        const feed = id ? DB.getById('feed_logs', id) : null;
        const title = feed ? 'Edit Feeding Log' : 'Add Feeding Record';

        const bodyHTML = `
            <form id="feed-form">
                <div class="form-group">
                    <label class="form-label">Select Pig *</label>
                    <select id="form-feed-pig" class="form-control" required>
                        ${App.pigOptions(feed ? feed.pig_id : '')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Feed Type *</label>
                        <select id="form-feed-type" class="form-control" required>
                            <option value="Starter" ${feed && feed.feed_type === 'Starter' ? 'selected' : ''}>Starter</option>
                            <option value="Grower" ${feed && feed.feed_type === 'Grower' ? 'selected' : ''}>Grower</option>
                            <option value="Finisher" ${feed && feed.feed_type === 'Finisher' ? 'selected' : ''}>Finisher</option>
                            <option value="Breeder" ${feed && feed.feed_type === 'Breeder' ? 'selected' : ''}>Breeder / Gestating</option>
                            <option value="Custom" ${feed && feed.feed_type === 'Custom' ? 'selected' : ''}>Custom Mix</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Quantity Consumed (kg) *</label>
                        <input type="number" id="form-feed-qty" class="form-control" value="${feed ? feed.quantity_kg : ''}" min="0.1" step="0.1" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Feed Cost (₱) *</label>
                        <input type="number" id="form-feed-cost" class="form-control" value="${feed ? feed.cost : ''}" min="0" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Feeding Date *</label>
                        <input type="date" id="form-feed-date" class="form-control" value="${feed ? feed.date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea id="form-feed-notes" class="form-control" rows="2">${feed ? feed.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-feed-btn">Save Entry</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-feed-btn').onclick = () => {
            const form = document.getElementById('feed-form');
            if (!form.reportValidity()) return;

            const pig_id = document.getElementById('form-feed-pig').value;
            const feed_type = document.getElementById('form-feed-type').value;
            const quantity_kg = Number(document.getElementById('form-feed-qty').value);
            const cost = Number(document.getElementById('form-feed-cost').value);
            const date = document.getElementById('form-feed-date').value;
            const notes = document.getElementById('form-feed-notes').value.trim();

            const data = { pig_id, feed_type, quantity_kg, cost, date, notes };

            if (feed) {
                DB.update('feed_logs', id, data);
                App.showToast('Feeding log updated.', 'success');
            } else {
                DB.add('feed_logs', data);
                App.showToast('Feeding record added.', 'success');
            }

            App.closeModal();
            this.loadFeedingTable();
        };
    },

    async deleteFeed(id) {
        const confirmDelete = await App.confirm('Are you sure you want to delete this feeding record? This will adjust financial balances.');
        if (confirmDelete) {
            DB.delete('feed_logs', id);
            App.showToast('Record deleted.', 'success');
            this.loadFeedingTable();
        }
    }
};

// ==========================================
// 4. MEDICINE RECORDS PAGE
// ==========================================
Pages.medicine = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>Medical Records</h1>
                    <p class="text-muted">Track vaccinations, treatment plans, vitamins and dosage costs.</p>
                </div>
                <button class="btn btn-primary" id="add-med-btn">💊 Record Medicine Treatment</button>
            </div>

            <!-- Filters -->
            <div class="card filter-bar mb-4">
                <div class="form-group mb-0" style="flex: 1; min-width: 200px;">
                    <select id="med-filter-pig" class="form-control">
                        <option value="">All Pigs</option>
                        ${App.pigOptions()}
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Pig Tag</th>
                                <th>Pig Name</th>
                                <th>Owner</th>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Purpose</th>
                                <th>Cost (₱)</th>
                                <th>Notes</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="med-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                        <tfoot>
                            <tr style="background: rgba(255,255,255,0.02)">
                                <td colspan="7"><strong>Total Medicine Cost</strong></td>
                                <td id="med-total-cost" colspan="3"><strong>₱ 0.00</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div id="med-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">💊</div>
                    <h3>No medical logs</h3>
                    <p>Add a new entry to record medications administered to your pigs.</p>
                </div>
            </div>
        `;
    },

    init() {
        this.loadMedTable();
        document.getElementById('med-filter-pig').onchange = () => this.loadMedTable();
        document.getElementById('add-med-btn').onclick = () => this.openMedModal();
    },

    loadMedTable() {
        const pigFilterVal = document.getElementById('med-filter-pig');
        const pigFilter = pigFilterVal ? pigFilterVal.value : '';

        const medLogs = DB.getAll('medicine_logs');
        const pigs = DB.getAll('pigs');

        const filtered = medLogs.filter(m => !pigFilter || m.pig_id === pigFilter);
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('med-table-body');
        const emptyState = document.getElementById('med-empty-state');

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            document.getElementById('med-total-cost').innerHTML = '<strong>₱ 0.00</strong>';
            return;
        }

        emptyState.classList.add('hidden');
        let totalCost = 0;

        tbody.innerHTML = filtered.map(m => {
            const pig = pigs.find(p => p.id === m.pig_id);
            totalCost += Number(m.cost || 0);

            return `
                <tr>
                    <td>${App.formatDate(m.date)}</td>
                    <td><strong>${pig ? pig.tag : '—'}</strong></td>
                    <td>${pig ? pig.name : '<span class="text-danger">Pig Deleted</span>'}</td>
                    <td>${pig ? App.ownerBadge(pig.owner) : '—'}</td>
                    <td>${m.medicine_name}</td>
                    <td>${m.dosage}</td>
                    <td>${App.statusBadge(m.purpose)}</td>
                    <td>${App.formatCurrency(m.cost)}</td>
                    <td><small>${m.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.medicine.openMedModal('${m.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.medicine.deleteMed('${m.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('med-total-cost').innerHTML = `<strong>${App.formatCurrency(totalCost)}</strong>`;
    },

    openMedModal(id = '') {
        const med = id ? DB.getById('medicine_logs', id) : null;
        const title = med ? 'Edit Medical Treatment Log' : 'Add Medication Entry';

        const bodyHTML = `
            <form id="med-form">
                <div class="form-group">
                    <label class="form-label">Select Pig *</label>
                    <select id="form-med-pig" class="form-control" required>
                        ${App.pigOptions(med ? med.pig_id : '')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Medicine / Vaccine Name *</label>
                        <input type="text" id="form-med-name" class="form-control" value="${med ? med.medicine_name : ''}" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Dosage (e.g. 2ml, 1 tablet) *</label>
                        <input type="text" id="form-med-dosage" class="form-control" value="${med ? med.dosage : ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Treatment Purpose *</label>
                        <select id="form-med-purpose" class="form-control" required>
                            <option value="Vaccination" ${med && med.purpose === 'Vaccination' ? 'selected' : ''}>Vaccination</option>
                            <option value="Treatment" ${med && med.purpose === 'Treatment' ? 'selected' : ''}>Treatment (Sick Pig)</option>
                            <option value="Prevention" ${med && med.purpose === 'Prevention' ? 'selected' : ''}>Prevention / Routine</option>
                            <option value="Supplement" ${med && med.purpose === 'Supplement' ? 'selected' : ''}>Supplement / Vitamins</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Medicine Cost (₱) *</label>
                        <input type="number" id="form-med-cost" class="form-control" value="${med ? med.cost : ''}" min="0" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Treatment Date *</label>
                        <input type="date" id="form-med-date" class="form-control" value="${med ? med.date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes / Instructions</label>
                    <textarea id="form-med-notes" class="form-control" rows="2">${med ? med.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-med-btn">Save Treatment</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-med-btn').onclick = () => {
            const form = document.getElementById('med-form');
            if (!form.reportValidity()) return;

            const pig_id = document.getElementById('form-med-pig').value;
            const medicine_name = document.getElementById('form-med-name').value.trim();
            const dosage = document.getElementById('form-med-dosage').value.trim();
            const purpose = document.getElementById('form-med-purpose').value;
            const cost = Number(document.getElementById('form-med-cost').value);
            const date = document.getElementById('form-med-date').value;
            const notes = document.getElementById('form-med-notes').value.trim();

            const data = { pig_id, medicine_name, dosage, purpose, cost, date, notes };

            if (med) {
                DB.update('medicine_logs', id, data);
                App.showToast('Treatment log updated.', 'success');
            } else {
                DB.add('medicine_logs', data);
                App.showToast('Treatment recorded.', 'success');
            }

            App.closeModal();
            this.loadMedTable();
        };
    },

    async deleteMed(id) {
        const confirmDelete = await App.confirm('Are you sure you want to delete this medical record?');
        if (confirmDelete) {
            DB.delete('medicine_logs', id);
            App.showToast('Record deleted.', 'success');
            this.loadMedTable();
        }
    }
};

// ==========================================
// 5. WEIGHT RECORDS PAGE
// ==========================================
Pages.weight = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>Weight Logs</h1>
                    <p class="text-muted">Monitor pig growth rates, weights, and Feed Conversion Ratio indicators.</p>
                </div>
                <button class="btn btn-primary" id="add-weight-btn">⚖️ Record Pig Weight</button>
            </div>

            <!-- Filter bar -->
            <div class="card filter-bar mb-4">
                <div class="form-group mb-0" style="flex: 1; min-width: 200px;">
                    <select id="weight-filter-pig" class="form-control">
                        <option value="">All Pigs (Grid Overview)</option>
                        ${App.pigOptions()}
                    </select>
                </div>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr;" id="weight-layout-grid">
                <!-- Data Table Card -->
                <div class="card">
                    <h3>Weight Log History</h3>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Pig Tag</th>
                                    <th>Pig Name</th>
                                    <th>Owner</th>
                                    <th>Weight (kg)</th>
                                    <th>Gain/Loss vs Last</th>
                                    <th>Notes</th>
                                    <th class="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="weight-table-body">
                                <!-- Loaded via Javascript -->
                            </tbody>
                        </table>
                    </div>
                    <div id="weight-empty-state" class="empty-state hidden">
                        <div class="empty-state-icon">⚖️</div>
                        <h3>No weight entries</h3>
                        <p>Begin weighing pigs and record their values to start mapping growth curves.</p>
                    </div>
                </div>

                <!-- Growth Curve Card (Text Based) -->
                <div class="card">
                    <h3>Individual Growth Track</h3>
                    <div id="weight-trend-container" class="growth-trend-box">
                        <p class="text-muted">Select a single pig above to generate its individual weight trend history.</p>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.loadWeightTable();
        document.getElementById('weight-filter-pig').onchange = () => this.loadWeightTable();
        document.getElementById('add-weight-btn').onclick = () => this.openWeightModal();
    },

    loadWeightTable() {
        const pigFilterVal = document.getElementById('weight-filter-pig');
        const pigFilter = pigFilterVal ? pigFilterVal.value : '';

        const weightLogs = DB.getAll('weight_logs');
        const pigs = DB.getAll('pigs');

        // Group weights by pig to calculate growth change chronologically
        const weightsByPig = {};
        weightLogs.forEach(w => {
            if (!weightsByPig[w.pig_id]) weightsByPig[w.pig_id] = [];
            weightsByPig[w.pig_id].push(w);
        });

        // Sort weights by date ascending for chron calculations
        Object.keys(weightsByPig).forEach(pid => {
            weightsByPig[pid].sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        // Map change vs previous
        const logsWithChange = weightLogs.map(w => {
            const pigArr = weightsByPig[w.pig_id] || [];
            const index = pigArr.findIndex(x => x.id === w.id);
            let change = '—';
            
            if (index > 0) {
                const prev = pigArr[index - 1];
                const diff = Number(w.weight_kg) - Number(prev.weight_kg);
                const prefix = diff > 0 ? '+' : '';
                const color = diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : '';
                change = `<span class="${color}">${prefix}${diff.toFixed(1)} kg</span>`;
            }
            return { ...w, changeHtml: change };
        });

        const filtered = logsWithChange.filter(m => !pigFilter || m.pig_id === pigFilter);
        // Sort descending for presentation
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('weight-table-body');
        const emptyState = document.getElementById('weight-empty-state');

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            document.getElementById('weight-trend-container').innerHTML = `<p class="text-muted">No records available.</p>`;
            return;
        }

        emptyState.classList.add('hidden');
        tbody.innerHTML = filtered.map(w => {
            const pig = pigs.find(p => p.id === w.pig_id);

            return `
                <tr>
                    <td>${App.formatDate(w.date)}</td>
                    <td><strong>${pig ? pig.tag : '—'}</strong></td>
                    <td>${pig ? pig.name : '<span class="text-danger">Pig Deleted</span>'}</td>
                    <td>${pig ? App.ownerBadge(pig.owner) : '—'}</td>
                    <td><strong>${w.weight_kg} kg</strong></td>
                    <td>${w.changeHtml}</td>
                    <td><small>${w.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.weight.openWeightModal('${w.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.weight.deleteWeight('${w.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Load side trend panel if single pig is selected
        const trendBox = document.getElementById('weight-trend-container');
        if (pigFilter && trendBox) {
            const selectedPig = pigs.find(p => p.id === pigFilter);
            const pigWeights = weightsByPig[pigFilter] || [];
            
            if (pigWeights.length === 0) {
                trendBox.innerHTML = `<p class="text-muted">No measurements for this pig yet.</p>`;
                return;
            }

            let trendHTML = `
                <h4 style="margin-bottom: 12px; color: var(--accent-secondary)">Growth Curve for [${selectedPig.tag}] ${selectedPig.name}</h4>
                <div class="trend-timeline" style="border-left: 2px solid var(--glass-border); padding-left: 16px; margin-left: 8px;">
            `;

            // Display in reverse order for newest on top
            [...pigWeights].reverse().forEach((w, i, arr) => {
                let gainLabel = '';
                if (i < arr.length - 1) {
                    const prev = arr[i + 1];
                    const diff = w.weight_kg - prev.weight_kg;
                    const diffText = (diff >= 0 ? '+' : '') + diff.toFixed(1);
                    const color = diff >= 0 ? 'text-success' : 'text-danger';
                    gainLabel = `<span class="${color}" style="font-size:0.85rem; margin-left: 8px;">(${diffText} kg growth)</span>`;
                }

                trendHTML += `
                    <div style="margin-bottom: 16px; position: relative;">
                        <span style="position: absolute; left: -22px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-primary)"></span>
                        <div class="text-muted" style="font-size: 0.8rem;">${App.formatDate(w.date)}</div>
                        <div style="font-weight: 600; margin-top: 2px;">
                            ${w.weight_kg} kg ${gainLabel}
                        </div>
                    </div>
                `;
            });

            trendHTML += `</div>`;
            trendBox.innerHTML = trendHTML;
        } else {
            trendBox.innerHTML = `<p class="text-muted">Select a single pig above to generate its individual weight trend history.</p>`;
        }
    },

    openWeightModal(id = '') {
        const weight = id ? DB.getById('weight_logs', id) : null;
        const title = weight ? 'Edit Weight Record' : 'Record Pig Weight';

        const bodyHTML = `
            <form id="weight-form">
                <div class="form-group">
                    <label class="form-label">Select Pig *</label>
                    <select id="form-weight-pig" class="form-control" required>
                        ${App.pigOptions(weight ? weight.pig_id : '')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Weight (kg) *</label>
                        <input type="number" id="form-weight-value" class="form-control" value="${weight ? weight.weight_kg : ''}" min="0.1" step="0.1" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Weighing Date *</label>
                        <input type="date" id="form-weight-date" class="form-control" value="${weight ? weight.date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea id="form-weight-notes" class="form-control" rows="2">${weight ? weight.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-weight-btn">Save Entry</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-weight-btn').onclick = () => {
            const form = document.getElementById('weight-form');
            if (!form.reportValidity()) return;

            const pig_id = document.getElementById('form-weight-pig').value;
            const weight_kg = Number(document.getElementById('form-weight-value').value);
            const date = document.getElementById('form-weight-date').value;
            const notes = document.getElementById('form-weight-notes').value.trim();

            const data = { pig_id, weight_kg, date, notes };

            if (weight) {
                DB.update('weight_logs', id, data);
                App.showToast('Weight log updated.', 'success');
            } else {
                DB.add('weight_logs', data);
                App.showToast('Weight entry added.', 'success');
            }

            App.closeModal();
            this.loadWeightTable();
        };
    },

    async deleteWeight(id) {
        const confirmDelete = await App.confirm('Are you sure you want to delete this weight log entry?');
        if (confirmDelete) {
            DB.delete('weight_logs', id);
            App.showToast('Record deleted.', 'success');
            this.loadWeightTable();
        }
    }
};

// ==========================================
// 6. HOUSING MANAGEMENT PAGE
// ==========================================
Pages.housing = {
    render() {
        const canCreate = App.hasPermission('housing', 'create');

        return `
            <div class="page-header">
                <div>
                    <h1>Pen & Housing Management</h1>
                    <p class="text-muted">Manage pens, capacities, and map dynamic occupant counts.</p>
                </div>
                ${canCreate ? `<button class="btn btn-primary" id="add-housing-btn">🏠 Create New Pen</button>` : ''}
            </div>

            <!-- Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Pen Number</th>
                                <th>Pen Type</th>
                                <th>Location</th>
                                <th>Max Capacity</th>
                                <th>Current Occupancy</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="housing-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    init() {
        this.loadHousingTable();
        const addBtn = document.getElementById('add-housing-btn');
        if (addBtn) addBtn.onclick = () => this.openHousingModal();
    },

    loadHousingTable() {
        const housingList = DB.getAll('housing');
        const pigs = DB.getAll('pigs');
        const tbody = document.getElementById('housing-table-body');
        if (!tbody) return;

        tbody.innerHTML = housingList.map(h => {
            const activeOccupants = pigs.filter(p => p.housing_id === h.id && p.status === 'Active').length;
            const isFull = activeOccupants >= h.capacity;
            const occupancyHTML = `<span class="${isFull ? 'text-danger font-bold' : ''}">${activeOccupants} / ${h.capacity} pigs</span>`;

            const canUpdate = App.hasPermission('housing', 'update');
            const canDelete = App.hasPermission('housing', 'delete');

            return `
                <tr>
                    <td><strong>${h.pen_number}</strong></td>
                    <td>${h.type}</td>
                    <td>${h.location}</td>
                    <td>${h.capacity} heads</td>
                    <td>${occupancyHTML}</td>
                    <td>${App.statusBadge(h.status)}</td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            ${canUpdate ? `<button class="btn btn-sm btn-success" onclick="Pages.housing.openHousingModal('${h.id}')">Edit</button>` : ''}
                            ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="Pages.housing.deleteHousing('${h.id}', ${activeOccupants})">Delete</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openHousingModal(id = '') {
        const housing = id ? DB.getById('housing', id) : null;
        const title = housing ? 'Edit Pen Details' : 'Create Pen Record';

        const bodyHTML = `
            <form id="housing-form">
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Pen Number *</label>
                        <input type="text" id="form-pen-number" class="form-control" value="${housing ? housing.pen_number : ''}" placeholder="e.g. Pen A2" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Pen Type *</label>
                        <select id="form-pen-type" class="form-control" required>
                            <option value="Farrowing" ${housing && housing.type === 'Farrowing' ? 'selected' : ''}>Farrowing (Birthing)</option>
                            <option value="Growing" ${housing && housing.type === 'Growing' ? 'selected' : ''}>Growing</option>
                            <option value="Finishing" ${housing && housing.type === 'Finishing' ? 'selected' : ''}>Finishing</option>
                            <option value="Breeding" ${housing && housing.type === 'Breeding' ? 'selected' : ''}>Breeding</option>
                            <option value="Quarantine" ${housing && housing.type === 'Quarantine' ? 'selected' : ''}>Quarantine</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Max Head Capacity *</label>
                        <input type="number" id="form-pen-capacity" class="form-control" value="${housing ? housing.capacity : '10'}" min="1" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Location / Building *</label>
                        <input type="text" id="form-pen-location" class="form-control" value="${housing ? housing.location : ''}" placeholder="e.g. Building A" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Status *</label>
                        <select id="form-pen-status" class="form-control" required>
                            <option value="Active" ${housing && housing.status === 'Active' ? 'selected' : ''}>Active Pen</option>
                            <option value="Maintenance" ${housing && housing.status === 'Maintenance' ? 'selected' : ''}>Under Maintenance</option>
                        </select>
                    </div>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-housing-btn">Save Pen</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-housing-btn').onclick = () => {
            const form = document.getElementById('housing-form');
            if (!form.reportValidity()) return;

            const pen_number = document.getElementById('form-pen-number').value.trim();
            const type = document.getElementById('form-pen-type').value;
            const capacity = Number(document.getElementById('form-pen-capacity').value);
            const location = document.getElementById('form-pen-location').value.trim();
            const status = document.getElementById('form-pen-status').value;

            // Check duplicate pen names
            const allHousing = DB.getAll('housing');
            const dup = allHousing.find(h => h.pen_number.toLowerCase() === pen_number.toLowerCase() && h.id !== id);
            if (dup) {
                App.showToast(`Pen with number ${pen_number} already exists.`, 'error');
                return;
            }

            const data = { pen_number, type, capacity, location, status };

            if (housing) {
                DB.update('housing', id, data);
                App.showToast('Pen details updated.', 'success');
            } else {
                DB.add('housing', data);
                App.showToast('Pen created.', 'success');
            }

            App.closeModal();
            this.loadHousingTable();
        };
    },

    async deleteHousing(id, occupants) {
        if (occupants > 0) {
            App.showToast('Cannot delete pen with active occupants. Please transfer pigs first.', 'error');
            return;
        }

        const confirmDelete = await App.confirm('Are you sure you want to delete this housing pen?');
        if (confirmDelete) {
            DB.delete('housing', id);
            App.showToast('Pen deleted.', 'success');
            this.loadHousingTable();
        }
    }
};

// ==========================================
// 7. BREEDING RECORDS PAGE
// ==========================================
Pages.breeding = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>Breeding Logs</h1>
                    <p class="text-muted">Monitor sow pregnancies, mating dates, expected farrowings, and litter details.</p>
                </div>
                <button class="btn btn-primary" id="add-breeding-btn">🐖 Record Mating</button>
            </div>

            <!-- Filters -->
            <div class="card filter-bar mb-4">
                <div class="form-group mb-0" style="min-width: 150px;">
                    <select id="breed-filter-status" class="form-control">
                        <option value="">All Statuses</option>
                        <option value="Mated">Mated</option>
                        <option value="Pregnant">Pregnant</option>
                        <option value="Farrowed">Farrowed</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
                <div class="form-group mb-0" style="min-width: 150px;">
                    <select id="breed-filter-owner" class="form-control">
                        <option value="">All Owners</option>
                        <option value="Banjo">Banjo</option>
                        <option value="Albe">Albe</option>
                        <option value="Shared">Shared</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Mating Date</th>
                                <th>Sow (Mother)</th>
                                <th>Boar (Father)</th>
                                <th>Status</th>
                                <th>Expected Farrowing</th>
                                <th>Actual Farrowing</th>
                                <th>Litter Size</th>
                                <th>Owner</th>
                                <th>Notes / Remarks</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="breeding-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                    </table>
                </div>
                <div id="breeding-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">🐖</div>
                    <h3>No breeding records</h3>
                    <p>Enter mating events to track gestation cycles.</p>
                </div>
            </div>
        `;
    },

    init() {
        this.loadBreedingTable();
        document.getElementById('breed-filter-status').onchange = () => this.loadBreedingTable();
        document.getElementById('breed-filter-owner').onchange = () => this.loadBreedingTable();
        document.getElementById('add-breeding-btn').onclick = () => this.openBreedingModal();
    },

    loadBreedingTable() {
        const statusFilter = document.getElementById('breed-filter-status').value;
        const ownerFilter = document.getElementById('breed-filter-owner').value;

        const breedingList = DB.getAll('breeding');
        const pigs = DB.getAll('pigs');

        const filtered = breedingList.filter(b => {
            const matchesStatus = !statusFilter || b.status === statusFilter;
            const matchesOwner = !ownerFilter || b.owner === ownerFilter;
            return matchesStatus && matchesOwner;
        });

        filtered.sort((a, b) => new Date(b.mating_date) - new Date(a.mating_date));

        const tbody = document.getElementById('breeding-table-body');
        const emptyState = document.getElementById('breeding-empty-state');

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        const nowStr = new Date().toISOString().split('T')[0];

        tbody.innerHTML = filtered.map(b => {
            const sow = pigs.find(p => p.id === b.sow_id);
            const boar = pigs.find(p => p.id === b.boar_id);

            // Warning if farrowing expected in next 7 days and status is Mated/Pregnant
            const expectedDate = new Date(b.expected_farrow_date);
            const diffDays = Math.ceil((expectedDate - new Date()) / (1000 * 60 * 60 * 24));
            
            let rowStyle = '';
            let alertLabel = '';
            if (['Mated', 'Pregnant'].includes(b.status) && diffDays >= 0 && diffDays <= 7) {
                rowStyle = 'style="background: rgba(245, 158, 11, 0.08); border-left: 4px solid var(--warning);"';
                alertLabel = `<span class="badge badge-warning" style="display:inline-block; margin-left:8px;">⚠️ Due in ${diffDays}d</span>`;
            }

            return `
                <tr ${rowStyle}>
                    <td>${App.formatDate(b.mating_date)}</td>
                    <td>${sow ? sow.name : '<span class="text-danger">Sow Deleted</span>'}</td>
                    <td>${boar ? boar.name : '<span class="text-danger">Boar Deleted</span>'}</td>
                    <td>${App.statusBadge(b.status)}</td>
                    <td><strong>${App.formatDate(b.expected_farrow_date)}</strong> ${alertLabel}</td>
                    <td>${App.formatDate(b.actual_farrow_date)}</td>
                    <td>${b.litter_size ? `${b.litter_size} piglets` : '—'}</td>
                    <td>${App.ownerBadge(b.owner)}</td>
                    <td><small>${b.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.breeding.openBreedingModal('${b.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.breeding.deleteBreeding('${b.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openBreedingModal(id = '') {
        const breed = id ? DB.getById('breeding', id) : null;
        const title = breed ? 'Edit Breeding Event' : 'Record Mating Event';

        const bodyHTML = `
            <form id="breeding-form">
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Sow (Mother Female) *</label>
                        <select id="form-breed-sow" class="form-control" required>
                            ${App.pigOptions(breed ? breed.sow_id : '', 'Sow')}
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Boar (Father Male) *</label>
                        <select id="form-breed-boar" class="form-control" required>
                            ${App.pigOptions(breed ? breed.boar_id : '', 'Boar')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Mating Date *</label>
                        <input type="date" id="form-breed-mating" class="form-control" value="${breed ? breed.mating_date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Expected Farrowing Date</label>
                        <input type="date" id="form-breed-expected" class="form-control" value="${breed ? breed.expected_farrow_date : ''}" readonly style="background: rgba(255,255,255,0.02); opacity: 0.8;">
                        <span class="text-muted" style="font-size:0.8rem;">Autocalculated (Mating + 114 days gestation)</span>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Operational Status *</label>
                        <select id="form-breed-status" class="form-control" required>
                            <option value="Mated" ${breed && breed.status === 'Mated' ? 'selected' : ''}>Mated</option>
                            <option value="Pregnant" ${breed && breed.status === 'Pregnant' ? 'selected' : ''}>Confirmed Pregnant</option>
                            <option value="Farrowed" ${breed && breed.status === 'Farrowed' ? 'selected' : ''}>Farrowed (Litter Born)</option>
                            <option value="Failed" ${breed && breed.status === 'Failed' ? 'selected' : ''}>Failed Cycle</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Owner *</label>
                        <select id="form-breed-owner" class="form-control" required>
                            ${App.ownerOptions(breed ? breed.owner : 'Shared')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Actual Farrowing Date</label>
                        <input type="date" id="form-breed-actual" class="form-control" value="${breed ? breed.actual_farrow_date : ''}">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Litter Size (Piglets Born)</label>
                        <input type="number" id="form-breed-litter" class="form-control" value="${breed ? breed.litter_size : ''}" min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Operational Notes</label>
                    <textarea id="form-breed-notes" class="form-control" rows="2">${breed ? breed.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-breed-btn">Save Record</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        // Autofill expected date based on mating date selection
        const matingInput = document.getElementById('form-breed-mating');
        const expectedInput = document.getElementById('form-breed-expected');
        
        const updateExpectedDate = () => {
            const dateVal = matingInput.value;
            if (dateVal) {
                const matingDate = new Date(dateVal);
                matingDate.setDate(matingDate.getDate() + 114); // 114 days average gestation
                expectedInput.value = matingDate.toISOString().split('T')[0];
            }
        };

        matingInput.onchange = updateExpectedDate;
        if (!breed) updateExpectedDate(); // Set on load if adding

        document.getElementById('save-breed-btn').onclick = () => {
            const form = document.getElementById('breeding-form');
            if (!form.reportValidity()) return;

            const sow_id = document.getElementById('form-breed-sow').value;
            const boar_id = document.getElementById('form-breed-boar').value;
            const mating_date = document.getElementById('form-breed-mating').value;
            const expected_farrow_date = document.getElementById('form-breed-expected').value;
            const status = document.getElementById('form-breed-status').value;
            const owner = document.getElementById('form-breed-owner').value;
            const actual_farrow_date = document.getElementById('form-breed-actual').value;
            const litter_size = document.getElementById('form-breed-litter').value ? Number(document.getElementById('form-breed-litter').value) : '';
            const notes = document.getElementById('form-breed-notes').value.trim();

            const data = { sow_id, boar_id, mating_date, expected_farrow_date, status, owner, actual_farrow_date, litter_size, notes };

            if (breed) {
                DB.update('breeding', id, data);
                App.showToast('Breeding record updated.', 'success');
            } else {
                DB.add('breeding', data);
                App.showToast('Breeding event created.', 'success');
            }

            App.closeModal();
            this.loadBreedingTable();
        };
    },

    async deleteBreeding(id) {
        const confirmDelete = await App.confirm('Are you sure you want to delete this breeding record?');
        if (confirmDelete) {
            DB.delete('breeding', id);
            App.showToast('Record deleted.', 'success');
            this.loadBreedingTable();
        }
    }
};

// ==========================================
// 8. GENERAL EXPENSES PAGE
// ==========================================
Pages.expenses = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>General Expenses</h1>
                    <p class="text-muted">Track farm overheads, machinery repairs, utility bills, and other costs.</p>
                </div>
                <button class="btn btn-primary" id="add-expense-btn">💸 Record Expense</button>
            </div>

            <!-- Filters -->
            <div class="card filter-bar mb-4">
                <div class="form-group mb-0" style="flex: 1; min-width: 150px;">
                    <select id="exp-filter-owner" class="form-control">
                        <option value="">All Owners</option>
                        <option value="Banjo">Banjo</option>
                        <option value="Albe">Albe</option>
                        <option value="Shared">Shared</option>
                    </select>
                </div>
                <div class="form-group mb-0" style="flex: 1; min-width: 150px;">
                    <select id="exp-filter-category" class="form-control">
                        <option value="">All Categories</option>
                        <option value="Housing">Housing Repairs</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Labor">Labor</option>
                        <option value="Veterinary">Veterinary Visits</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Other">Other Expenses</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Owner</th>
                                <th>Associated Pig</th>
                                <th>Amount (₱)</th>
                                <th>Notes</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="expense-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                        <tfoot>
                            <tr style="background: rgba(255,255,255,0.02)">
                                <td colspan="5"><strong>Combined Expenses Sum</strong></td>
                                <td id="expense-total-cost" colspan="3"><strong>₱ 0.00</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div id="expense-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">💸</div>
                    <h3>No expenses catalogued</h3>
                    <p>Log a utility bill or maintenance charge to view data here.</p>
                </div>
            </div>
        `;
    },

    init() {
        this.loadExpenseTable();
        document.getElementById('exp-filter-owner').onchange = () => this.loadExpenseTable();
        document.getElementById('exp-filter-category').onchange = () => this.loadExpenseTable();
        document.getElementById('add-expense-btn').onclick = () => this.openExpenseModal();
    },

    loadExpenseTable() {
        const ownerFilter = document.getElementById('exp-filter-owner').value;
        const categoryFilter = document.getElementById('exp-filter-category').value;

        const expenses = DB.getAll('expenses');
        const pigs = DB.getAll('pigs');

        const filtered = expenses.filter(e => {
            const matchesOwner = !ownerFilter || e.owner === ownerFilter;
            const matchesCat = !categoryFilter || e.category === categoryFilter;
            return matchesOwner && matchesCat;
        });

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('expense-table-body');
        const emptyState = document.getElementById('expense-empty-state');

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            document.getElementById('expense-total-cost').innerHTML = '<strong>₱ 0.00</strong>';
            return;
        }

        emptyState.classList.add('hidden');
        let total = 0;

        tbody.innerHTML = filtered.map(e => {
            total += Number(e.amount || 0);
            const pig = e.pig_id ? pigs.find(p => p.id === e.pig_id) : null;

            return `
                <tr>
                    <td>${App.formatDate(e.date)}</td>
                    <td>${App.statusBadge(e.category)}</td>
                    <td>${e.description}</td>
                    <td>${App.ownerBadge(e.owner)}</td>
                    <td>${pig ? `[${pig.tag}] ${pig.name}` : '<span class="text-muted">None / General</span>'}</td>
                    <td class="text-danger">${App.formatCurrency(e.amount)}</td>
                    <td><small>${e.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.expenses.openExpenseModal('${e.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.expenses.deleteExpense('${e.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('expense-total-cost').innerHTML = `<strong>${App.formatCurrency(total)}</strong>`;
    },

    openExpenseModal(id = '') {
        const exp = id ? DB.getById('expenses', id) : null;
        const title = exp ? 'Edit Expense Record' : 'Record General Expense';

        const bodyHTML = `
            <form id="expense-form">
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Category *</label>
                        <select id="form-exp-cat" class="form-control" required>
                            <option value="Housing" ${exp && exp.category === 'Housing' ? 'selected' : ''}>Housing / Building Repair</option>
                            <option value="Equipment" ${exp && exp.category === 'Equipment' ? 'selected' : ''}>Equipment / Tools</option>
                            <option value="Labor" ${exp && exp.category === 'Labor' ? 'selected' : ''}>Labor / Salary</option>
                            <option value="Medical" ${exp && exp.category === 'Medical' ? 'selected' : ''}>Medical / Medicine</option>
                            <option value="Veterinary" ${exp && exp.category === 'Veterinary' ? 'selected' : ''}>Veterinary Fees</option>
                            <option value="Utilities" ${exp && exp.category === 'Utilities' ? 'selected' : ''}>Utilities (Water/Electricity)</option>
                            <option value="Other" ${exp && exp.category === 'Other' ? 'selected' : ''}>Other Overhead</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Expense Amount (₱) *</label>
                        <input type="number" id="form-exp-amount" class="form-control" value="${exp ? exp.amount : ''}" min="0.01" step="0.01" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Description *</label>
                        <input type="text" id="form-exp-desc" class="form-control" value="${exp ? exp.description : ''}" placeholder="e.g. Electricity bill Jun 2026" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Attributed Owner *</label>
                        <select id="form-exp-owner" class="form-control" required>
                            ${App.ownerOptions(exp ? exp.owner : 'Shared')}
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Expense Date *</label>
                        <input type="date" id="form-exp-date" class="form-control" value="${exp ? exp.date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Specific Pig (Optional)</label>
                        <select id="form-exp-pig" class="form-control">
                            <option value="">Not associated to specific pig</option>
                            ${App.pigOptions(exp ? exp.pig_id : '')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Detailed Notes</label>
                    <textarea id="form-exp-notes" class="form-control" rows="2">${exp ? exp.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-exp-btn">Save Expense</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-exp-btn').onclick = () => {
            const form = document.getElementById('expense-form');
            if (!form.reportValidity()) return;

            const category = document.getElementById('form-exp-cat').value;
            const amount = Number(document.getElementById('form-exp-amount').value);
            const description = document.getElementById('form-exp-desc').value.trim();
            const owner = document.getElementById('form-exp-owner').value;
            const date = document.getElementById('form-exp-date').value;
            const pig_id = document.getElementById('form-exp-pig').value;
            const notes = document.getElementById('form-exp-notes').value.trim();

            const data = { category, amount, description, owner, date, pig_id, notes };

            if (exp) {
                DB.update('expenses', id, data);
                App.showToast('Expense updated.', 'success');
            } else {
                DB.add('expenses', data);
                App.showToast('Expense logged successfully.', 'success');
            }

            App.closeModal();
            this.loadExpenseTable();
        };
    },

    async deleteExpense(id) {
        const confirmDelete = await App.confirm('Delete this expense?');
        if (confirmDelete) {
            DB.delete('expenses', id);
            App.showToast('Expense deleted.', 'success');
            this.loadExpenseTable();
        }
    }
};

// ==========================================
// 9. GENERAL INCOME PAGE
// ==========================================
Pages.income = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>General Income & Sales</h1>
                    <p class="text-muted">Track sales of pigs, piglets, organic manure, and other income streams.</p>
                </div>
                <button class="btn btn-primary" id="add-income-btn">💰 Log Income / Sale</button>
            </div>

            <!-- Filters -->
            <div class="card filter-bar mb-4">
                <div class="form-group mb-0" style="flex: 1; min-width: 150px;">
                    <select id="inc-filter-owner" class="form-control">
                        <option value="">All Owners</option>
                        <option value="Banjo">Banjo</option>
                        <option value="Albe">Albe</option>
                        <option value="Shared">Shared</option>
                    </select>
                </div>
                <div class="form-group mb-0" style="flex: 1; min-width: 150px;">
                    <select id="inc-filter-source" class="form-control">
                        <option value="">All Sources</option>
                        <option value="Pig Sale">Pig Sale</option>
                        <option value="Piglet Sale">Piglet Sale</option>
                        <option value="Manure">Manure</option>
                        <option value="Other">Other Revenue</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Source</th>
                                <th>Description</th>
                                <th>Owner</th>
                                <th>Associated Pig</th>
                                <th>Amount (₱)</th>
                                <th>Notes</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="income-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                        <tfoot>
                            <tr style="background: rgba(255,255,255,0.02)">
                                <td colspan="5"><strong>Combined Farm Revenue</strong></td>
                                <td id="income-total-cost" colspan="3"><strong>₱ 0.00</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div id="income-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">💰</div>
                    <h3>No income entries recorded</h3>
                    <p>Enter a pig sale transaction to begin compiling revenues.</p>
                </div>
            </div>
        `;
    },

    init() {
        this.loadIncomeTable();
        document.getElementById('inc-filter-owner').onchange = () => this.loadIncomeTable();
        document.getElementById('inc-filter-source').onchange = () => this.loadIncomeTable();
        document.getElementById('add-income-btn').onclick = () => this.openIncomeModal();
    },

    loadIncomeTable() {
        const ownerFilter = document.getElementById('inc-filter-owner').value;
        const sourceFilter = document.getElementById('inc-filter-source').value;

        const incomeList = DB.getAll('income');
        const pigs = DB.getAll('pigs');

        const filtered = incomeList.filter(i => {
            const matchesOwner = !ownerFilter || i.owner === ownerFilter;
            const matchesSource = !sourceFilter || i.source === sourceFilter;
            return matchesOwner && matchesSource;
        });

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('income-table-body');
        const emptyState = document.getElementById('income-empty-state');

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            document.getElementById('income-total-cost').innerHTML = '<strong>₱ 0.00</strong>';
            return;
        }

        emptyState.classList.add('hidden');
        let total = 0;

        tbody.innerHTML = filtered.map(i => {
            total += Number(i.amount || 0);
            const pig = i.pig_id ? pigs.find(p => p.id === i.pig_id) : null;

            return `
                <tr>
                    <td>${App.formatDate(i.date)}</td>
                    <td>${App.statusBadge(i.source)}</td>
                    <td>${i.description}</td>
                    <td>${App.ownerBadge(i.owner)}</td>
                    <td>${pig ? `[${pig.tag}] ${pig.name}` : '<span class="text-muted">None / General</span>'}</td>
                    <td class="text-success">${App.formatCurrency(i.amount)}</td>
                    <td><small>${i.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.income.openIncomeModal('${i.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.income.deleteIncome('${i.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('income-total-cost').innerHTML = `<strong>${App.formatCurrency(total)}</strong>`;
    },

    openIncomeModal(id = '') {
        const inc = id ? DB.getById('income', id) : null;
        const title = inc ? 'Edit Sales Record' : 'Record Revenue Entry';

        const bodyHTML = `
            <form id="income-form">
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Revenue Source *</label>
                        <select id="form-inc-source" class="form-control" required>
                            <option value="Pig Sale" ${inc && inc.source === 'Pig Sale' ? 'selected' : ''}>Pig Sale (Pork Market)</option>
                            <option value="Piglet Sale" ${inc && inc.source === 'Piglet Sale' ? 'selected' : ''}>Piglet Sale (Weaners)</option>
                            <option value="Manure" ${inc && inc.source === 'Manure' ? 'selected' : ''}>Manure Sales</option>
                            <option value="Other" ${inc && inc.source === 'Other' ? 'selected' : ''}>Other Farm Income</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Amount Received (₱) *</label>
                        <input type="number" id="form-inc-amount" class="form-control" value="${inc ? inc.amount : ''}" min="0.01" step="0.01" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Transaction Description *</label>
                        <input type="text" id="form-inc-desc" class="form-control" value="${inc ? inc.description : ''}" placeholder="e.g. Sold 3 fatteners to local market" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Recipient Owner *</label>
                        <select id="form-inc-owner" class="form-control" required>
                            ${App.ownerOptions(inc ? inc.owner : 'Shared')}
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Transaction Date *</label>
                        <input type="date" id="form-inc-date" class="form-control" value="${inc ? inc.date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Associated Pig (Optional)</label>
                        <select id="form-inc-pig" class="form-control">
                            <option value="">Not associated to specific pig</option>
                            ${App.pigOptions(inc ? inc.pig_id : '')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Transaction Notes</label>
                    <textarea id="form-inc-notes" class="form-control" rows="2">${inc ? inc.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-inc-btn">Save Record</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-inc-btn').onclick = () => {
            const form = document.getElementById('income-form');
            if (!form.reportValidity()) return;

            const source = document.getElementById('form-inc-source').value;
            const amount = Number(document.getElementById('form-inc-amount').value);
            const description = document.getElementById('form-inc-desc').value.trim();
            const owner = document.getElementById('form-inc-owner').value;
            const date = document.getElementById('form-inc-date').value;
            const pig_id = document.getElementById('form-inc-pig').value;
            const notes = document.getElementById('form-inc-notes').value.trim();

            const data = { source, amount, description, owner, date, pig_id, notes };

            if (inc) {
                DB.update('income', id, data);
                App.showToast('Income record updated.', 'success');
            } else {
                DB.add('income', data);
                App.showToast('Revenue recorded.', 'success');
            }

            App.closeModal();
            this.loadIncomeTable();
        };
    },

    async deleteIncome(id) {
        const confirmDelete = await App.confirm('Delete this income transaction?');
        if (confirmDelete) {
            DB.delete('income', id);
            App.showToast('Income entry removed.', 'success');
            this.loadIncomeTable();
        }
    }
};

// ==========================================
// 10. FINANCIAL REPORTS PAGE
// ==========================================
Pages.reports = {
    render() {
        const dateNow = new Date();
        const startOfMonth = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).toISOString().split('T')[0];

        return `
            <div class="page-header">
                <div>
                    <h1>Profit Reports & ROI</h1>
                    <p class="text-muted">Select owners and date ranges to generate analytical profit statements and returns on investment.</p>
                </div>
            </div>

            <!-- Report Controller -->
            <div class="card mb-4">
                <h3>Report Settings</h3>
                <div class="form-row mt-2" style="align-items: flex-end;">
                    <div class="form-group" style="flex: 1; min-width: 150px;">
                        <label class="form-label">Select Entity</label>
                        <select id="rpt-filter-owner" class="form-control">
                            <option value="Combined">Combined Farm</option>
                            <option value="Banjo">Banjo</option>
                            <option value="Albe">Albe</option>
                            <option value="Shared">Shared</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1; min-width: 150px;">
                        <label class="form-label">Start Date</label>
                        <input type="date" id="rpt-start-date" class="form-control" value="${startOfMonth}">
                    </div>
                    <div class="form-group" style="flex: 1; min-width: 150px;">
                        <label class="form-label">End Date</label>
                        <input type="date" id="rpt-end-date" class="form-control" value="${endOfMonth}">
                    </div>
                    <div class="form-group flex gap-2" style="min-width: 250px;">
                        <button class="btn btn-primary" id="generate-report-btn" style="flex: 1;">Generate</button>
                        <button class="btn btn-secondary" id="print-report-btn">Print</button>
                        ${App.hasPermission('reports', 'export') ? `<button class="btn btn-secondary" id="export-csv-btn">CSV</button>` : ''}
                    </div>
                </div>
            </div>

            <!-- Report Area -->
            <div id="report-output-container" class="card hidden">
                <!-- Dynamically loaded on Generate click -->
            </div>
        `;
    },

    init() {
        document.getElementById('generate-report-btn').onclick = () => this.generateReport();
        document.getElementById('print-report-btn').onclick = () => window.print();
        
        const exportBtn = document.getElementById('export-csv-btn');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportCSV();
        }

        // Generate report automatically on page load
        this.generateReport();
    },

    generateReport() {
        const owner = document.getElementById('rpt-filter-owner').value;
        const start = document.getElementById('rpt-start-date').value;
        const end = document.getElementById('rpt-end-date').value;

        const report = DB.getReport(owner, start, end);
        const container = document.getElementById('report-output-container');
        if (!container) return;

        container.classList.remove('hidden');
        
        const titleText = `${owner} Financial Report`;
        const subtitleText = `Period: ${App.formatDate(start)} to ${App.formatDate(end)}`;
        
        const roiColor = report.roi >= 0 ? 'text-success' : 'text-danger';
        const profitColor = report.netProfit >= 0 ? 'text-success' : 'text-danger';

        let combinedBreakdown = '';
        if (owner === 'Combined') {
            const banjo = DB.getReport('Banjo', start, end);
            const albe = DB.getReport('Albe', start, end);
            const shared = DB.getReport('Shared', start, end);

            combinedBreakdown = `
                <h3 class="mt-4">Per-Owner Breakdown (Period scoped)</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Banjo</th>
                                <th>Albe</th>
                                <th>Shared</th>
                                <th>Combined</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Pig Purchase Investment</td>
                                <td>${App.formatCurrency(banjo.investment)}</td>
                                <td>${App.formatCurrency(albe.investment)}</td>
                                <td>${App.formatCurrency(shared.investment)}</td>
                                <td><strong>${App.formatCurrency(report.investment)}</strong></td>
                            </tr>
                            <tr>
                                <td>Feed Expenses</td>
                                <td>${App.formatCurrency(banjo.feedCost)}</td>
                                <td>${App.formatCurrency(albe.feedCost)}</td>
                                <td>${App.formatCurrency(shared.feedCost)}</td>
                                <td><strong>${App.formatCurrency(report.feedCost)}</strong></td>
                            </tr>
                            <tr>
                                <td>Medicine Expenses</td>
                                <td>${App.formatCurrency(banjo.medicineCost)}</td>
                                <td>${App.formatCurrency(albe.medicineCost)}</td>
                                <td>${App.formatCurrency(shared.medicineCost)}</td>
                                <td><strong>${App.formatCurrency(report.medicineCost)}</strong></td>
                            </tr>
                            <tr>
                                <td>Housing Repairs</td>
                                <td>${App.formatCurrency(banjo.housingCost)}</td>
                                <td>${App.formatCurrency(albe.housingCost)}</td>
                                <td>${App.formatCurrency(shared.housingCost)}</td>
                                <td><strong>${App.formatCurrency(report.housingCost)}</strong></td>
                            </tr>
                            <tr>
                                <td>Other Overhead</td>
                                <td>${App.formatCurrency(banjo.otherExpenses)}</td>
                                <td>${App.formatCurrency(albe.otherExpenses)}</td>
                                <td>${App.formatCurrency(shared.otherExpenses)}</td>
                                <td><strong>${App.formatCurrency(report.otherExpenses)}</strong></td>
                            </tr>
                            <tr style="border-top: 1.5px dashed var(--glass-border)">
                                <td><strong>Total Expenses</strong></td>
                                <td class="text-danger">${App.formatCurrency(banjo.totalExpenses)}</td>
                                <td class="text-danger">${App.formatCurrency(albe.totalExpenses)}</td>
                                <td class="text-danger">${App.formatCurrency(shared.totalExpenses)}</td>
                                <td class="text-danger"><strong>${App.formatCurrency(report.totalExpenses)}</strong></td>
                            </tr>
                            <tr>
                                <td><strong>Gross Income</strong></td>
                                <td class="text-success">${App.formatCurrency(banjo.grossIncome)}</td>
                                <td class="text-success">${App.formatCurrency(albe.grossIncome)}</td>
                                <td class="text-success">${App.formatCurrency(shared.grossIncome)}</td>
                                <td class="text-success"><strong>${App.formatCurrency(report.grossIncome)}</strong></td>
                            </tr>
                            <tr style="border-top: 2px solid var(--glass-border); background: rgba(255,255,255,0.02)">
                                <td><strong>Net Profit</strong></td>
                                <td class="${banjo.netProfit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(banjo.netProfit)}</td>
                                <td class="${albe.netProfit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(albe.netProfit)}</td>
                                <td class="${shared.netProfit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(shared.netProfit)}</td>
                                <td class="${report.netProfit >= 0 ? 'text-success' : 'text-danger'} font-bold"><strong>${App.formatCurrency(report.netProfit)}</strong></td>
                            </tr>
                            <tr>
                                <td><strong>ROI (%)</strong></td>
                                <td class="${banjo.roi >= 0 ? 'text-success' : 'text-danger'}">${banjo.roi.toFixed(2)}%</td>
                                <td class="${albe.roi >= 0 ? 'text-success' : 'text-danger'}">${albe.roi.toFixed(2)}%</td>
                                <td class="${shared.roi >= 0 ? 'text-success' : 'text-danger'}">${shared.roi.toFixed(2)}%</td>
                                <td class="${report.roi >= 0 ? 'text-success' : 'text-danger'}"><strong>${report.roi.toFixed(2)}%</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="print-area">
                <div style="border-bottom: 2px solid var(--accent-primary); padding-bottom: 12px; margin-bottom: 20px;">
                    <h2>${titleText}</h2>
                    <p class="text-muted">${subtitleText}</p>
                </div>

                <div class="dashboard-grid mb-4">
                    <div class="card stat-mini" style="background: rgba(255,255,255,0.01)">
                        <div class="text-muted">Net Profit</div>
                        <div class="value ${profitColor}" style="font-size: 1.8rem;">${App.formatCurrency(report.netProfit)}</div>
                    </div>
                    <div class="card stat-mini" style="background: rgba(255,255,255,0.01)">
                        <div class="text-muted">Return On Investment</div>
                        <div class="value ${roiColor}" style="font-size: 1.8rem;">${report.roi.toFixed(2)}%</div>
                    </div>
                    <div class="card stat-mini" style="background: rgba(255,255,255,0.01)">
                        <div class="text-muted">Total Costs Scoped</div>
                        <div class="value text-danger" style="font-size: 1.8rem;">${App.formatCurrency(report.totalExpenses)}</div>
                    </div>
                </div>

                <h3>Financial Ledger</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th class="text-right">Ledger Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Pig Purchase Investment (CapEx)</td>
                                <td class="text-right">${App.formatCurrency(report.investment)}</td>
                            </tr>
                            <tr>
                                <td>Feed Consumption Cost</td>
                                <td class="text-right">${App.formatCurrency(report.feedCost)}</td>
                            </tr>
                            <tr>
                                <td>Medicine Administration Cost</td>
                                <td class="text-right">${App.formatCurrency(report.medicineCost)}</td>
                            </tr>
                            <tr>
                                <td>Housing Repairs & Pens</td>
                                <td class="text-right">${App.formatCurrency(report.housingCost)}</td>
                            </tr>
                            <tr>
                                <td>Other Overhead Operations</td>
                                <td class="text-right">${App.formatCurrency(report.otherExpenses)}</td>
                            </tr>
                            <tr style="border-top: 2px solid var(--glass-border)">
                                <td><strong>Total Expenses Scoped</strong></td>
                                <td class="text-right text-danger font-bold">${App.formatCurrency(report.totalExpenses)}</td>
                            </tr>
                            <tr>
                                <td><strong>Gross Farm Income Scoped</strong></td>
                                <td class="text-right text-success font-bold">${App.formatCurrency(report.grossIncome)}</td>
                            </tr>
                            <tr style="background: rgba(255,255,255,0.02)">
                                <td><strong>Net Scoped Profit</strong></td>
                                <td class="text-right ${profitColor} font-bold" style="font-size: 1.1rem;">${App.formatCurrency(report.netProfit)}</td>
                            </tr>
                            <tr>
                                <td><strong>Return on Investment (ROI)</strong></td>
                                <td class="text-right ${roiColor} font-bold">${report.roi.toFixed(2)}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                ${combinedBreakdown}
            </div>
        `;
    },

    exportCSV() {
        const owner = document.getElementById('rpt-filter-owner').value;
        const start = document.getElementById('rpt-start-date').value;
        const end = document.getElementById('rpt-end-date').value;
        const report = DB.getReport(owner, start, end);

        let csv = `Category,Amount\n`;
        csv += `Pig Purchase Investment,${report.investment}\n`;
        csv += `Feed Cost,${report.feedCost}\n`;
        csv += `Medicine Cost,${report.medicineCost}\n`;
        csv += `Housing Cost,${report.housingCost}\n`;
        csv += `Other Expenses,${report.otherExpenses}\n`;
        csv += `Total Expenses,${report.totalExpenses}\n`;
        csv += `Gross Income,${report.grossIncome}\n`;
        csv += `Net Profit,${report.netProfit}\n`;
        csv += `ROI (%),${report.roi.toFixed(2)}\n`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `farm_report_${owner}_${start}_to_${end}.csv`);
        link.click();
    }
};

// ==========================================
// 11. USER MANAGEMENT PAGE (ADMIN ONLY)
// ==========================================
Pages.users = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>User Access Control</h1>
                    <p class="text-muted">Manage credentials and operational roles for farm managers.</p>
                </div>
                <button class="btn btn-primary" id="add-user-btn">👥 Register New User</button>
            </div>

            <!-- Table -->
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Access Role</th>
                                <th>Created</th>
                                <th>Modified</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    init() {
        this.loadUsersTable();
        document.getElementById('add-user-btn').onclick = () => this.openUserModal();
    },

    loadUsersTable() {
        const users = DB.getAll('users');
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = users.map(u => {
            const isSelf = u.id === App.currentUser.id;

            return `
                <tr>
                    <td><strong>${u.name}</strong> ${isSelf ? '<span class="text-muted">(You)</span>' : ''}</td>
                    <td>${u.username}</td>
                    <td><span class="badge ${u.role === 'Administrator' ? 'badge-admin' : 'badge-manager'}">${u.role}</span></td>
                    <td>${App.formatDate(u.created_at)}</td>
                    <td>${App.formatDate(u.updated_at)}</td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.users.openUserModal('${u.id}')">Edit</button>
                            ${!isSelf ? `<button class="btn btn-sm btn-danger" onclick="Pages.users.deleteUser('${u.id}')">Delete</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openUserModal(id = '') {
        const user = id ? DB.getById('users', id) : null;
        const isSelf = user && user.id === App.currentUser.id;
        const title = user ? 'Edit User Credentials' : 'Register User';

        const bodyHTML = `
            <form id="user-form">
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="form-user-name" class="form-control" value="${user ? user.name : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Login Username *</label>
                    <input type="text" id="form-user-username" class="form-control" value="${user ? user.username : ''}" required ${user ? 'readonly' : ''} style="${user ? 'background:rgba(255,255,255,0.02); opacity:0.8;' : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Password * ${user ? '(Leave blank to keep current)' : ''}</label>
                    <input type="password" id="form-user-password" class="form-control" ${user ? '' : 'required'}>
                </div>
                <div class="form-group">
                    <label class="form-label">Access Role *</label>
                    <select id="form-user-role" class="form-control" ${isSelf ? 'disabled' : ''}>
                        <option value="Manager" ${user && user.role === 'Manager' ? 'selected' : ''}>Manager (Restricted Access)</option>
                        <option value="Administrator" ${user && user.role === 'Administrator' ? 'selected' : ''}>Administrator (Full Access)</option>
                    </select>
                    ${isSelf ? '<span class="text-warning" style="font-size:0.8rem; margin-top:4px; display:block;">You cannot modify your own administrative role.</span>' : ''}
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-user-btn">Save Credentials</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-user-btn').onclick = () => {
            const form = document.getElementById('user-form');
            if (!form.reportValidity()) return;

            const name = document.getElementById('form-user-name').value.trim();
            const username = document.getElementById('form-user-username').value.trim().toLowerCase();
            const password = document.getElementById('form-user-password').value;
            const role = document.getElementById('form-user-role').value;

            // Username uniqueness check
            const allUsers = DB.getAll('users');
            const dup = allUsers.find(u => u.username === username && u.id !== id);
            if (dup) {
                App.showToast('Username already taken.', 'error');
                return;
            }

            const data = { name, username, role };
            if (password) {
                data.password = password; // Only update password if provided
            }

            if (user) {
                DB.update('users', id, data);
                App.showToast('User credentials updated.', 'success');
            } else {
                DB.add('users', { ...data, password: password || 'password123' });
                App.showToast('User registered successfully.', 'success');
            }

            App.closeModal();
            this.loadUsersTable();
        };
    },

    async deleteUser(id) {
        const user = DB.getById('users', id);
        if (!user) return;

        const confirmDelete = await App.confirm(`Delete user "${user.name}"? This action disables their login completely.`);
        if (confirmDelete) {
            DB.delete('users', id);
            App.showToast('User deleted.', 'success');
            this.loadUsersTable();
        }
    }
};

// ==========================================
// 12. SYSTEM SETTINGS PAGE (ADMIN ONLY)
// ==========================================
Pages.settings = {
    render() {
        const settings = DB.getSettings();
        
        return `
            <div class="page-header">
                <div>
                    <h1>System Settings</h1>
                    <p class="text-muted">Configure currency formatting, backup databases, and perform imports.</p>
                </div>
            </div>

            <div class="dashboard-grid">
                <!-- Farm Config -->
                <div class="card">
                    <h3>General Configurations</h3>
                    <form id="settings-form" class="mt-2">
                        <div class="form-group">
                            <label class="form-label">Farm Identity Name</label>
                            <input type="text" id="set-farm-name" class="form-control" value="${settings.farm_name}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Local Currency Symbol</label>
                            <input type="text" id="set-currency" class="form-control" value="${settings.currency}" required>
                        </div>
                        <button class="btn btn-primary mt-2" type="button" id="save-settings-btn">Save Configurations</button>
                    </form>
                </div>

                <!-- Cloud Real-Time Sync -->
                <div class="card">
                    <h3>☁️ Cloud Database Sync</h3>
                    <p class="text-muted" style="font-size:0.9rem; margin-bottom:16px;">Synchronize and backup your data automatically across all phones and laptops via Google Firebase.</p>
                    
                    <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
                        <div class="flex-between align-center">
                            <span>Status:</span>
                            <strong style="color: #10b981;">🟢 Live Cloud Connected</strong>
                        </div>
                        <small class="text-muted" style="display:block; margin-top:4px;">All edits automatically sync in real-time to any device using your link.</small>
                    </div>

                    <button class="btn btn-primary mb-2" id="btn-force-upload-cloud" style="width:100%;">
                        ☁️ Upload All Local Data to Cloud
                    </button>
                    <small class="text-muted" style="display:block; text-align:center;">Use this once to ensure all records on this laptop are stored in Firebase.</small>
                </div>

                <!-- Backup & Restores -->
                <div class="card">
                    <h3>Local Data Backup</h3>
                    <p class="text-muted" style="font-size:0.9rem; margin-bottom:16px;">Download client database records as flat files or reload historical snapshots.</p>
                    
                    <button class="btn btn-secondary mb-4" id="download-backup-btn" style="width:100%;">📥 Download Database Backup (.json)</button>
                    
                    <div style="border-top:1.5px dashed var(--glass-border); padding-top:16px;">
                        <label class="form-label">Restore database from backup (.json)</label>
                        <input type="file" id="restore-file-input" accept=".json" class="form-control" style="padding-top:10px;">
                        <button class="btn btn-danger mt-2" id="restore-btn" style="width:100%;">📤 Restore Selected Backup</button>
                    </div>
                </div>
            </div>

            <!-- Danger Zone -->
            <div class="card mt-4" style="border: 1px solid var(--danger); background: rgba(239, 68, 68, 0.03)">
                <h3 class="text-danger">Danger Zone</h3>
                <p class="text-muted" style="font-size:0.9rem; margin-bottom:12px;">Resetting the database wipes all pig records, logs, expenses, revenues, and customization settings. Only default accounts will remain.</p>
                <button class="btn btn-danger" id="reset-database-btn">Reset Database to Default</button>
            </div>
        `;
    },

    init() {
        document.getElementById('save-settings-btn').onclick = () => this.saveSettings();
        document.getElementById('download-backup-btn').onclick = () => DB.downloadBackup();
        document.getElementById('restore-btn').onclick = () => this.restoreBackup();
        document.getElementById('reset-database-btn').onclick = () => this.resetDatabase();
        
        const uploadBtn = document.getElementById('btn-force-upload-cloud');
        if (uploadBtn) {
            uploadBtn.onclick = async () => {
                uploadBtn.disabled = true;
                uploadBtn.textContent = '⏳ Uploading data to Cloud...';
                try {
                    const res = await DB.uploadAllToCloud();
                    App.showToast(`✅ Successfully uploaded ${res.totalRecords} records across ${res.collections} collections to Cloud!`, 'success');
                } catch(e) {
                    App.showToast('Cloud upload failed: ' + e.message, 'error');
                } finally {
                    uploadBtn.disabled = false;
                    uploadBtn.textContent = '☁️ Upload All Local Data to Cloud';
                }
            };
        }
    },

    saveSettings() {
        const farm_name = document.getElementById('set-farm-name').value.trim();
        const currency = document.getElementById('set-currency').value.trim();

        if (!farm_name || !currency) {
            App.showToast('Fill in all settings configurations.', 'error');
            return;
        }

        DB.saveSettings({ farm_name, currency });
        
        // Update header dynamically
        const brandText = document.querySelector('.brand-name');
        if (brandText) brandText.textContent = farm_name;
        
        App.showToast('Configurations successfully saved.', 'success');
    },

    async restoreBackup() {
        const fileInput = document.getElementById('restore-file-input');
        if (!fileInput.files || fileInput.files.length === 0) {
            App.showToast('Please select a valid JSON backup file first.', 'warning');
            return;
        }

        const confirmRestore = await App.confirm('Warning: Restoring will overwrite all current farm data. Make sure you have downloaded a backup first.');
        if (!confirmRestore) return;

        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const success = await DB.importAll(e.target.result);
                if (success) {
                    App.showToast('Database restored & synced to Cloud! Reloading...', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    App.showToast('Failed to parse file. Invalid backup format.', 'error');
                }
            } catch(err) {
                App.showToast('Restore error: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    },

    async resetDatabase() {
        const confirm1 = await App.confirm('First Warning: Are you sure you want to completely erase the database?');
        if (!confirm1) return;

        const confirm2 = await App.confirm('Second Warning: This cannot be undone. Clicking confirm will delete all data.');
        if (confirm2) {
            localStorage.clear();
            App.showToast('Database wiped. Restoring defaults...', 'info');
            setTimeout(() => window.location.reload(), 1500);
        }
    }
};

// ==========================================
// 13. BATCHES & HISTORY PAGE
// ==========================================
Pages.batches = {
    render() {
        const batches = DB.getAll('batches');
        const canCreate = App.hasPermission('batches', 'create');

        return `
            <div class="page-header">
                <div>
                    <h1>Batches & History</h1>
                    <p class="text-muted">Group pigs into batches to track aggregate feed costs, medical overhead, and batch sales history.</p>
                </div>
                ${canCreate ? `<button class="btn btn-primary" id="add-batch-btn">📦 Create New Batch</button>` : ''}
            </div>

            <!-- Filters / Summary -->
            <div class="dashboard-grid mb-4">
                <div class="card stat-mini">
                    <div class="text-muted">Total Batches</div>
                    <div class="value">${batches.length}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Active Batches</div>
                    <div class="value">${batches.filter(b => b.status === 'Active').length}</div>
                </div>
                <div class="card stat-mini">
                    <div class="text-muted">Completed (Sold)</div>
                    <div class="value">${batches.filter(b => b.status === 'Sold').length}</div>
                </div>
            </div>

            <!-- Table -->
            <div class="card">
                <h3>Batch Records</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Batch Name</th>
                                <th>Owner</th>
                                <th>Start Date</th>
                                <th>Status</th>
                                <th>Pigs Count</th>
                                <th>Total Costs</th>
                                <th>Sale Price</th>
                                <th>Net Profit</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="batches-table-body">
                            <!-- Loaded via Javascript -->
                        </tbody>
                    </table>
                </div>
                <div id="batches-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">📦</div>
                    <h3>No batches found</h3>
                    <p>Create a batch to start tracking groups of pigs together.</p>
                </div>
            </div>
        `;
    },

    init() {
        this.loadBatchesTable();
        const addBtn = document.getElementById('add-batch-btn');
        if (addBtn) addBtn.onclick = () => this.openBatchModal();
    },

    loadBatchesTable() {
        const batches = DB.getAll('batches');
        const pigs = DB.getAll('pigs');
        const feedLogs = DB.getAll('feed_logs');
        const medLogs = DB.getAll('medicine_logs');

        const tbody = document.getElementById('batches-table-body');
        const emptyState = document.getElementById('batches-empty-state');
        if (!tbody) return;

        if (batches.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        tbody.innerHTML = batches.map(b => {
            // Find pigs belonging to this batch
            const batchPigs = pigs.filter(p => p.batch_id === b.id);
            const pigIds = new Set(batchPigs.map(p => p.id));

            // Calculate costs
            const purchaseCost = batchPigs.reduce((sum, p) => sum + Number(p.purchase_price || 0), 0);
            
            const feedCost = feedLogs
                .filter(f => pigIds.has(f.pig_id))
                .reduce((sum, f) => sum + Number(f.cost || 0), 0);
            
            const medCost = medLogs
                .filter(m => pigIds.has(m.pig_id))
                .reduce((sum, m) => sum + Number(m.cost || 0), 0);

            const totalCosts = purchaseCost + feedCost + medCost;
            const salePrice = b.status === 'Sold' ? Number(b.sale_price_total || 0) : 0;
            const netProfit = b.status === 'Sold' ? (salePrice - totalCosts) : -totalCosts;

            const canUpdate = App.hasPermission('batches', 'update');
            const canDelete = App.hasPermission('batches', 'delete');

            let profitHTML = '';
            if (b.status === 'Sold') {
                profitHTML = `<span class="${netProfit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(netProfit)}</span>`;
            } else {
                profitHTML = `<span class="text-muted">— (Running: ${App.formatCurrency(totalCosts)})</span>`;
            }

            return `
                <tr>
                    <td><strong>${b.name}</strong><br><small class="text-muted">${b.description || ''}</small></td>
                    <td>${App.ownerBadge(b.owner)}</td>
                    <td>${App.formatDate(b.start_date)}</td>
                    <td>${App.statusBadge(b.status)}</td>
                    <td>${batchPigs.length} pigs</td>
                    <td class="text-danger">${App.formatCurrency(totalCosts)}</td>
                    <td>${b.status === 'Sold' ? App.formatCurrency(salePrice) : '<span class="text-muted">Active / Growing</span>'}</td>
                    <td>${profitHTML}</td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-secondary" onclick="Pages.batches.viewBatchDetails('${b.id}')">Details</button>
                            ${b.status === 'Active' && canUpdate ? `<button class="btn btn-sm btn-success" onclick="Pages.batches.sellBatchModal('${b.id}')">💰 Sell Batch</button>` : ''}
                            ${canUpdate ? `<button class="btn btn-sm btn-secondary" onclick="Pages.batches.openBatchModal('${b.id}')">Edit</button>` : ''}
                            ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="Pages.batches.deleteBatch('${b.id}')">Delete</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openBatchModal(id = '') {
        const batch = id ? DB.getById('batches', id) : null;
        const title = batch ? 'Edit Batch Details' : 'Create New Batch';

        const bodyHTML = `
            <form id="batch-form">
                <div class="form-group">
                    <label class="form-label">Batch Name *</label>
                    <input type="text" id="form-batch-name" class="form-control" value="${batch ? batch.name : ''}" placeholder="e.g. Duroc Batch June 2026" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" id="form-batch-desc" class="form-control" value="${batch ? batch.description : ''}" placeholder="e.g. 15 piglets from sow Duroc Queen">
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Owner *</label>
                        <select id="form-batch-owner" class="form-control" required>
                            ${App.ownerOptions(batch ? batch.owner : 'Shared')}
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Start Date *</label>
                        <input type="date" id="form-batch-startdate" class="form-control" value="${batch ? batch.start_date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-batch-btn">Save Batch</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-batch-btn').onclick = () => {
            const form = document.getElementById('batch-form');
            if (!form.reportValidity()) return;

            const name = document.getElementById('form-batch-name').value.trim();
            const description = document.getElementById('form-batch-desc').value.trim();
            const owner = document.getElementById('form-batch-owner').value;
            const start_date = document.getElementById('form-batch-startdate').value;

            const data = {
                name,
                description,
                owner,
                start_date,
                sale_date: batch ? batch.sale_date : '',
                purchase_price_total: batch ? batch.purchase_price_total : 0,
                sale_price_total: batch ? batch.sale_price_total : 0,
                status: batch ? batch.status : 'Active'
            };

            if (batch) {
                DB.update('batches', id, data);
                App.showToast('Batch details updated.', 'success');
            } else {
                DB.add('batches', data);
                App.showToast('Batch created successfully.', 'success');
            }

            App.closeModal();
            this.loadBatchesTable();
        };
    },

    sellBatchModal(id) {
        const batch = DB.getById('batches', id);
        if (!batch) return;

        const pigs = DB.getAll('pigs');
        const batchPigs = pigs.filter(p => p.batch_id === id);

        const bodyHTML = `
            <form id="sell-batch-form">
                <p style="margin-bottom: 12px; color: var(--text-secondary);">
                    You are selling the batch <strong>${batch.name}</strong> containing <strong>${batchPigs.length} pigs</strong>.
                    Selling this batch will automatically change the status of all assigned pigs to <strong>"Sold"</strong>.
                </p>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Total Sale Revenue (₱) *</label>
                        <input type="number" id="form-sell-price" class="form-control" placeholder="e.g. 120000" min="1" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Sale Date *</label>
                        <input type="date" id="form-sell-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-sell-batch-btn">💰 Complete Batch Sale</button>
        `;

        App.showModal('Sell Batch of Pigs', bodyHTML, footerHTML);

        document.getElementById('save-sell-batch-btn').onclick = () => {
            const form = document.getElementById('sell-batch-form');
            if (!form.reportValidity()) return;

            const sale_price_total = Number(document.getElementById('form-sell-price').value);
            const sale_date = document.getElementById('form-sell-date').value;

            // 1. Update the batch status and details
            DB.update('batches', id, {
                status: 'Sold',
                sale_price_total,
                sale_date
            });

            // 2. Automatically update all pigs in this batch to "Sold" status
            batchPigs.forEach(p => {
                DB.update('pigs', p.id, {
                    status: 'Sold',
                    notes: (p.notes || '') + `\nSold as part of batch "${batch.name}" on ${sale_date}.`
                });
            });

            // 3. Log a revenue entry under general income automatically for accounting
            DB.add('income', {
                source: 'Pig Sale',
                description: `Batch sale revenue: ${batch.name} (${batchPigs.length} pigs)`,
                amount: sale_price_total,
                owner: batch.owner,
                date: sale_date,
                pig_id: '',
                notes: `Auto-generated from Batch Sale completion.`
            });

            App.showToast(`Batch "${batch.name}" sold successfully! All pigs updated to Sold.`, 'success');
            App.closeModal();
            this.loadBatchesTable();
        };
    },

    viewBatchDetails(id) {
        const batch = DB.getById('batches', id);
        if (!batch) return;

        const pigs = DB.getAll('pigs');
        const batchPigs = pigs.filter(p => p.batch_id === id);
        const pigIds = new Set(batchPigs.map(p => p.id));

        const feedLogs = DB.getAll('feed_logs');
        const medLogs = DB.getAll('medicine_logs');

        // Calculations
        const purchaseCost = batchPigs.reduce((sum, p) => sum + Number(p.purchase_price || 0), 0);
        
        const feedCost = feedLogs
            .filter(f => pigIds.has(f.pig_id))
            .reduce((sum, f) => sum + Number(f.cost || 0), 0);
        
        const medCost = medLogs
            .filter(m => pigIds.has(m.pig_id))
            .reduce((sum, m) => sum + Number(m.cost || 0), 0);

        const totalCosts = purchaseCost + feedCost + medCost;
        const salePrice = batch.status === 'Sold' ? Number(batch.sale_price_total || 0) : 0;
        const netProfit = batch.status === 'Sold' ? (salePrice - totalCosts) : (salePrice - totalCosts);
        const roi = purchaseCost > 0 ? (netProfit / purchaseCost) * 100 : 0;

        const profitColor = netProfit >= 0 ? 'text-success' : 'text-danger';

        const pigsListHTML = batchPigs.map(p => `
            <tr>
                <td><strong>${p.tag}</strong></td>
                <td>${p.name}</td>
                <td>${p.breed}</td>
                <td>${p.gender}</td>
                <td>${App.statusBadge(p.status)}</td>
                <td>${App.formatCurrency(p.purchase_price)}</td>
            </tr>
        `).join('');

        const bodyHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div><span class="text-muted">Batch Name:</span> <p style="font-size: 1.1rem; margin-top: 4px;"><strong>${batch.name}</strong></p></div>
                <div><span class="text-muted">Owner:</span> <p style="margin-top: 4px;">${App.ownerBadge(batch.owner)}</p></div>
                <div><span class="text-muted">Status:</span> <p style="margin-top: 4px;">${App.statusBadge(batch.status)}</p></div>
                <div><span class="text-muted">Start Date:</span> <p style="margin-top: 4px;">${App.formatDate(batch.start_date)}</p></div>
                ${batch.status === 'Sold' ? `
                    <div><span class="text-muted">Sale Date:</span> <p style="margin-top: 4px;"><strong>${App.formatDate(batch.sale_date)}</strong></p></div>
                    <div><span class="text-muted">ROI (%):</span> <p style="margin-top: 4px;" class="${profitColor}"><strong>${roi.toFixed(2)}%</strong></p></div>
                ` : ''}
            </div>

            <div class="card mb-4" style="background: rgba(255,255,255,0.01); border-style: dashed;">
                <h4 style="margin-bottom: 12px; color: var(--accent-secondary)">Batch Scoped Financial Ledger</h4>
                <div class="table-responsive">
                    <table class="data-table" style="margin-top:0;">
                        <tbody>
                            <tr><td>Initial Pigs Purchase Cost</td><td class="text-right">${App.formatCurrency(purchaseCost)}</td></tr>
                            <tr><td>Feed Expenses Sum</td><td class="text-right">${App.formatCurrency(feedCost)}</td></tr>
                            <tr><td>Medicine Expenses Sum</td><td class="text-right">${App.formatCurrency(medCost)}</td></tr>
                            <tr style="border-top:1px solid var(--glass-border)">
                                <td><strong>Total Invested Cost</strong></td>
                                <td class="text-right text-danger font-bold">${App.formatCurrency(totalCosts)}</td>
                            </tr>
                            <tr>
                                <td><strong>Sale Revenue</strong></td>
                                <td class="text-right text-success font-bold">${batch.status === 'Sold' ? App.formatCurrency(salePrice) : 'Active / Unsold'}</td>
                            </tr>
                            <tr style="border-top:1.5px solid var(--glass-border); background:rgba(255,255,255,0.02)">
                                <td><strong>Net Profit</strong></td>
                                <td class="text-right ${profitColor} font-bold">${App.formatCurrency(netProfit)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h4>Pigs in this Batch (${batchPigs.length} heads)</h4>
            <div class="table-responsive" style="max-height:220px; overflow-y:auto; border:1px solid var(--glass-border); border-radius:8px; margin-top:8px;">
                <table class="data-table" style="margin-top:0;">
                    <thead>
                        <tr>
                            <th>Tag</th>
                            <th>Name</th>
                            <th>Breed</th>
                            <th>Gender</th>
                            <th>Status</th>
                            <th>Buy Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pigsListHTML || '<tr><td colspan="6" class="text-center text-muted">No pigs assigned to this batch yet.</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div style="margin-top:20px;">
                ${App.auditInfo(batch)}
            </div>
        `;

        App.showModal(`Batch Analytics: ${batch.name}`, bodyHTML);
    },

    async deleteBatch(id) {
        const batch = DB.getById('batches', id);
        if (!batch) return;

        const confirmDelete = await App.confirm(`Are you sure you want to delete batch "${batch.name}"? Pigs assigned to this batch will be set to no batch assignment, but will not be deleted.`);
        if (confirmDelete) {
            // Unassign pigs
            const pigs = DB.getAll('pigs');
            pigs.forEach(p => {
                if (p.batch_id === id) {
                    DB.update('pigs', p.id, { batch_id: '' });
                }
            });

            DB.delete('batches', id);
            App.showToast('Batch record deleted.', 'success');
            this.loadBatchesTable();
        }
    }
};

// ==========================================
// 14. POULTRY / CHICKEN MANAGER PAGE
// ==========================================
Pages.poultry = {
    _activeTab: 'flocks', // Default active tab

    render() {
        return `
            <div class="page-header">
                <div>
                    <h1>Poultry & Chicken Manager</h1>
                    <p class="text-muted">Manage flocks, track daily egg production, bird mortality, feed consumption, and medicine costs.</p>
                </div>
            </div>

            <!-- Tab Navigation Bar -->
            <div class="card mb-4" style="padding: 10px; display: flex; gap: 10px; border-bottom: 2px solid var(--accent-primary);">
                <button class="btn ${this._activeTab === 'flocks' ? 'btn-primary' : 'btn-secondary'}" id="tab-poultry-flocks" style="flex: 1;">🐔 Flocks & Coops</button>
                <button class="btn ${this._activeTab === 'daily' ? 'btn-primary' : 'btn-secondary'}" id="tab-poultry-daily" style="flex: 1;">🥚 Daily Egg & Logs</button>
                <button class="btn ${this._activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}" id="tab-poultry-exp" style="flex: 1;">🌾 Feed & Medication</button>
            </div>

            <!-- Tab Content Area -->
            <div id="poultry-tab-content">
                ${this.renderActiveTabContent()}
            </div>
        `;
    },

    init() {
        this.setupTabListeners();
        this.initActiveTabHandlers();
    },

    setupTabListeners() {
        const btnFlocks = document.getElementById('tab-poultry-flocks');
        const btnDaily = document.getElementById('tab-poultry-daily');
        const btnExp = document.getElementById('tab-poultry-exp');

        if (btnFlocks) btnFlocks.onclick = () => this.switchTab('flocks');
        if (btnDaily) btnDaily.onclick = () => this.switchTab('daily');
        if (btnExp) btnExp.onclick = () => this.switchTab('expenses');
    },

    switchTab(tabName) {
        this._activeTab = tabName;
        // Re-render
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = this.render();
        this.init();
    },

    renderActiveTabContent() {
        if (this._activeTab === 'flocks') return this.renderFlocksTab();
        if (this._activeTab === 'daily') return this.renderDailyTab();
        if (this._activeTab === 'expenses') return this.renderExpensesTab();
        return '';
    },

    initActiveTabHandlers() {
        if (this._activeTab === 'flocks') {
            this.loadFlocksTable();
            const btn = document.getElementById('add-flock-btn');
            if (btn) btn.onclick = () => this.openFlockModal();
        } else if (this._activeTab === 'daily') {
            this.loadDailyTable();
            const btn = document.getElementById('add-poultry-daily-btn');
            if (btn) btn.onclick = () => this.openDailyModal();
        } else if (this._activeTab === 'expenses') {
            this.loadExpensesTable();
            const btn = document.getElementById('add-poultry-exp-btn');
            if (btn) btn.onclick = () => this.openExpenseModal();
        }
    },

    // ==========================================
    // TAB 1: FLOCKS & COOPS
    // ==========================================
    renderFlocksTab() {
        const canCreate = App.hasPermission('poultry', 'create');
        return `
            <div class="flex-between mb-2">
                <h3>Chicken Flocks</h3>
                ${canCreate ? `<button class="btn btn-primary" id="add-flock-btn">🐔 Add New Flock</button>` : ''}
            </div>
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Flock Name</th>
                                <th>Breed</th>
                                <th>Type</th>
                                <th>Coop Location</th>
                                <th>Owner</th>
                                <th>Start Count</th>
                                <th>Active Count</th>
                                <th>Status</th>
                                <th>Purchase Cost</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="flocks-table-body">
                            <!-- Dynamically loaded -->
                        </tbody>
                    </table>
                </div>
                <div id="flocks-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">🐔</div>
                    <h3>No flocks registered</h3>
                    <p>Register your first chicken flock to start tracking daily eggs and feed logs.</p>
                </div>
            </div>
        `;
    },

    loadFlocksTable() {
        const flocks = DB.getAll('flocks');
        const tbody = document.getElementById('flocks-table-body');
        const emptyState = document.getElementById('flocks-empty-state');
        if (!tbody) return;

        if (flocks.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        tbody.innerHTML = flocks.map(f => {
            const canUpdate = App.hasPermission('poultry', 'update');
            const canDelete = App.hasPermission('poultry', 'delete');

            return `
                <tr>
                    <td><strong>${f.name}</strong><br><small class="text-muted">${f.notes || ''}</small></td>
                    <td>${f.breed}</td>
                    <td><span class="badge badge-info">${f.type}</span></td>
                    <td>${f.coop_id}</td>
                    <td>${App.ownerBadge(f.owner)}</td>
                    <td>${f.initial_count} birds</td>
                    <td><strong>${f.current_count} birds</strong></td>
                    <td>${App.statusBadge(f.status)}</td>
                    <td>${App.formatCurrency(f.purchase_price)}</td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-secondary" onclick="Pages.poultry.viewFlockDetails('${f.id}')">Details</button>
                            ${f.status === 'Active' && canUpdate ? `<button class="btn btn-sm btn-success" onclick="Pages.poultry.sellFlockModal('${f.id}')">💰 Sell Flock</button>` : ''}
                            ${canUpdate ? `<button class="btn btn-sm btn-secondary" onclick="Pages.poultry.openFlockModal('${f.id}')">Edit</button>` : ''}
                            ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="Pages.poultry.deleteFlock('${f.id}')">Delete</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openFlockModal(id = '') {
        const flock = id ? DB.getById('flocks', id) : null;
        const title = flock ? 'Edit Flock Details' : 'Register New Flock';

        const bodyHTML = `
            <form id="flock-form">
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Flock Name *</label>
                        <input type="text" id="form-flock-name" class="form-control" value="${flock ? flock.name : ''}" placeholder="e.g. Lohmann Layers 2026-B" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Breed *</label>
                        <input type="text" id="form-flock-breed" class="form-control" value="${flock ? flock.breed : 'Lohmann Brown'}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Production Type *</label>
                        <select id="form-flock-type" class="form-control" required>
                            <option value="Layer" ${flock && flock.type === 'Layer' ? 'selected' : ''}>Layer (Egg Production)</option>
                            <option value="Broiler" ${flock && flock.type === 'Broiler' ? 'selected' : ''}>Broiler (Meat Production)</option>
                            <option value="Chicks" ${flock && flock.type === 'Chicks' ? 'selected' : ''}>Chicks / Pullets</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Coop Location / Building *</label>
                        <input type="text" id="form-flock-coop" class="form-control" value="${flock ? flock.coop_id : ''}" placeholder="e.g. Coop A" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Attributed Owner *</label>
                        <select id="form-flock-owner" class="form-control" required>
                            ${App.ownerOptions(flock ? flock.owner : 'Shared')}
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Start Date *</label>
                        <input type="date" id="form-flock-startdate" class="form-control" value="${flock ? flock.start_date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Initial Birds Count *</label>
                        <input type="number" id="form-flock-initcount" class="form-control" value="${flock ? flock.initial_count : ''}" min="1" required ${flock ? 'readonly style="background:rgba(255,255,255,0.02);opacity:0.8;"' : ''}>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Chicks Buy Price (₱) *</label>
                        <input type="number" id="form-flock-price" class="form-control" value="${flock ? flock.purchase_price : ''}" min="0" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea id="form-flock-notes" class="form-control" rows="2">${flock ? flock.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-flock-btn">Save Flock</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-flock-btn').onclick = () => {
            const form = document.getElementById('flock-form');
            if (!form.reportValidity()) return;

            const name = document.getElementById('form-flock-name').value.trim();
            const breed = document.getElementById('form-flock-breed').value.trim();
            const type = document.getElementById('form-flock-type').value;
            const coop_id = document.getElementById('form-flock-coop').value.trim();
            const owner = document.getElementById('form-flock-owner').value;
            const start_date = document.getElementById('form-flock-startdate').value;
            const purchase_price = Number(document.getElementById('form-flock-price').value);
            const notes = document.getElementById('form-flock-notes').value.trim();

            const data = {
                name,
                breed,
                type,
                coop_id,
                owner,
                start_date,
                purchase_price,
                notes,
                initial_count: flock ? flock.initial_count : Number(document.getElementById('form-flock-initcount').value),
                current_count: flock ? flock.current_count : Number(document.getElementById('form-flock-initcount').value),
                status: flock ? flock.status : 'Active'
            };

            if (flock) {
                DB.update('flocks', id, data);
                App.showToast('Flock details updated.', 'success');
            } else {
                DB.add('flocks', data);
                App.showToast('Flock registered successfully.', 'success');
            }

            App.closeModal();
            this.loadFlocksTable();
        };
    },

    sellFlockModal(id) {
        const flock = DB.getById('flocks', id);
        if (!flock) return;

        const bodyHTML = `
            <form id="sell-flock-form">
                <p style="margin-bottom: 12px; color: var(--text-secondary);">
                    You are recording the sale harvest of flock <strong>${flock.name}</strong> containing <strong>${flock.current_count} birds</strong>.
                    Selling this flock will set its active headcount to 0 and change status to **"Sold"**.
                </p>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Total Sale Price (₱) *</label>
                        <input type="number" id="form-sell-price" class="form-control" placeholder="e.g. 85000" min="1" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Sale Date *</label>
                        <input type="date" id="form-sell-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-sell-flock-btn">💰 Complete Flock Sale</button>
        `;

        App.showModal('Sell Flock', bodyHTML, footerHTML);

        document.getElementById('save-sell-flock-btn').onclick = () => {
            const form = document.getElementById('sell-flock-form');
            if (!form.reportValidity()) return;

            const sale_price_total = Number(document.getElementById('form-sell-price').value);
            const sale_date = document.getElementById('form-sell-date').value;

            // 1. Update status & empty headcount
            DB.update('flocks', id, {
                status: 'Sold',
                current_count: 0,
                sale_price_total,
                sale_date
            });

            // 2. Automatically log income
            DB.add('income', {
                source: 'Other',
                description: `Harvest sale revenue: Poultry Flock "${flock.name}"`,
                amount: sale_price_total,
                owner: flock.owner,
                date: sale_date,
                pig_id: '',
                notes: `Auto-generated from Poultry Flock Sale.`
            });

            App.showToast(`Flock "${flock.name}" successfully marked as Sold. Revenue logged in Income.`, 'success');
            App.closeModal();
            this.loadFlocksTable();
        };
    },

    viewFlockDetails(id) {
        const flock = DB.getById('flocks', id);
        if (!flock) return;

        const dailyLogs = DB.getAll('poultry_daily').filter(d => d.flock_id === id);
        const pExp = DB.getAll('poultry_expenses').filter(pe => pe.flock_id === id);

        const totalEggs = dailyLogs.reduce((sum, d) => sum + Number(d.collected_qty || 0), 0);
        const totalCracked = dailyLogs.reduce((sum, d) => sum + Number(d.cracked_qty || 0), 0);
        const totalDeaths = dailyLogs.reduce((sum, d) => sum + Number(d.mortality_qty || 0), 0);
        
        const feedCost = pExp.filter(e => e.type === 'Feed').reduce((sum, e) => sum + Number(e.cost || 0), 0);
        const medCost = pExp.filter(e => e.type === 'Medicine').reduce((sum, e) => sum + Number(e.cost || 0), 0);
        
        const totalCosts = flock.purchase_price + feedCost + medCost;
        const totalRevenues = flock.status === 'Sold' ? Number(flock.sale_price_total || 0) : 0;
        const netProfit = totalRevenues - totalCosts;

        const mortalityRate = flock.initial_count > 0 ? (totalDeaths / flock.initial_count) * 100 : 0;

        const bodyHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div><span class="text-muted">Flock Name:</span> <p style="font-size: 1.1rem; margin-top: 4px;"><strong>${flock.name}</strong></p></div>
                <div><span class="text-muted">Owner:</span> <p style="margin-top: 4px;">${App.ownerBadge(flock.owner)}</p></div>
                <div><span class="text-muted">Status:</span> <p style="margin-top: 4px;">${App.statusBadge(flock.status)}</p></div>
                <div><span class="text-muted">Coop Location:</span> <p style="margin-top: 4px;">${flock.coop_id}</p></div>
                <div><span class="text-muted">Production Breed / Type:</span> <p style="margin-top: 4px;">${flock.breed} (${flock.type})</p></div>
                <div><span class="text-muted">Mortality Index (%):</span> <p style="margin-top: 4px;" class="text-danger"><strong>${mortalityRate.toFixed(1)}%</strong> (${totalDeaths} birds lost)</p></div>
            </div>

            <div class="card mb-4" style="background: rgba(255,255,255,0.01); border-style: dashed; padding: 16px;">
                <h4 style="margin-bottom: 12px; color: var(--accent-secondary)">Flock Performance Ledger</h4>
                <div class="table-responsive">
                    <table class="data-table" style="margin-top:0;">
                        <tbody>
                            <tr><td>Initial Chicks Purchase Cost</td><td class="text-right">${App.formatCurrency(flock.purchase_price)}</td></tr>
                            <tr><td>Feed Expenses Sum</td><td class="text-right">${App.formatCurrency(feedCost)}</td></tr>
                            <tr><td>Medicine Expenses Sum</td><td class="text-right">${App.formatCurrency(medCost)}</td></tr>
                            <tr style="border-top:1px solid var(--glass-border)">
                                <td><strong>Total Operating Expenses</strong></td>
                                <td class="text-right text-danger font-bold">${App.formatCurrency(totalCosts)}</td>
                            </tr>
                            <tr>
                                <td><strong>Egg Yield Metrics</strong></td>
                                <td class="text-right text-success font-bold">${totalEggs} eggs collected (${totalCracked} cracked)</td>
                            </tr>
                            <tr>
                                <td><strong>Flock Sale Revenue</strong></td>
                                <td class="text-right text-success font-bold">${flock.status === 'Sold' ? App.formatCurrency(totalRevenues) : 'Active / Unsold'}</td>
                            </tr>
                            <tr style="border-top:1.5px solid var(--glass-border); background:rgba(255,255,255,0.02)">
                                <td><strong>Net Profit (Ledger)</strong></td>
                                <td class="text-right ${netProfit >= 0 ? 'text-success' : 'text-danger'} font-bold">${App.formatCurrency(netProfit)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div style="margin-top:20px;">
                ${App.auditInfo(flock)}
            </div>
        `;

        App.showModal(`Flock Analytics: ${flock.name}`, bodyHTML);
    },

    async deleteFlock(id) {
        const flock = DB.getById('flocks', id);
        if (!flock) return;

        const confirmDelete = await App.confirm(`Are you sure you want to delete flock "${flock.name}"? This wipes flock details and inventory counts.`);
        if (confirmDelete) {
            DB.delete('flocks', id);
            App.showToast('Flock deleted successfully.', 'success');
            this.loadFlocksTable();
        }
    },

    // ==========================================
    // TAB 2: DAILY EGG & LOGS
    // ==========================================
    renderDailyTab() {
        return `
            <div class="flex-between mb-2">
                <h3>Daily Flock Operations</h3>
                <button class="btn btn-primary" id="add-poultry-daily-btn">🥚 Record Daily Log</button>
            </div>
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Flock</th>
                                <th>Eggs Collected</th>
                                <th>Cracked / Broken</th>
                                <th>Lay Rate (%)</th>
                                <th>Bird Deaths</th>
                                <th>Notes / Remarks</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="daily-table-body">
                            <!-- Dynamically loaded -->
                        </tbody>
                    </table>
                </div>
                <div id="daily-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">🥚</div>
                    <h3>No daily logs recorded</h3>
                    <p>Enter daily egg collection counts and mortality numbers to compile flock health analytics.</p>
                </div>
            </div>
        `;
    },

    loadDailyTable() {
        const logs = DB.getAll('poultry_daily');
        const flocks = DB.getAll('flocks');
        const tbody = document.getElementById('daily-table-body');
        const emptyState = document.getElementById('daily-empty-state');
        if (!tbody) return;

        if (logs.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        logs.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = logs.map(l => {
            const flock = flocks.find(f => f.id === l.flock_id);
            const activeCount = flock ? flock.current_count : 0;
            const layRate = activeCount > 0 ? (Number(l.collected_qty || 0) / activeCount) * 100 : 0;

            return `
                <tr>
                    <td>${App.formatDate(l.date)}</td>
                    <td><strong>${flock ? flock.name : 'Unknown Flock'}</strong></td>
                    <td><span class="text-success font-bold">${l.collected_qty} eggs</span></td>
                    <td class="text-warning">${l.cracked_qty || 0} cracked</td>
                    <td><strong>${layRate.toFixed(1)}%</strong></td>
                    <td class="${l.mortality_qty > 0 ? 'text-danger font-bold' : 'text-muted'}">${l.mortality_qty || 0} birds</td>
                    <td><small>${l.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.poultry.openDailyModal('${l.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.poultry.deleteDaily('${l.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openDailyModal(id = '') {
        const log = id ? DB.getById('poultry_daily', id) : null;
        const title = log ? 'Edit Daily Log' : 'Record Daily Flock Log';

        const bodyHTML = `
            <form id="poultry-daily-form">
                <div class="form-group">
                    <label class="form-label">Select Flock *</label>
                    <select id="form-pld-flock" class="form-control" required>
                        ${App.flockOptions(log ? log.flock_id : '')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Eggs Collected (Qty) *</label>
                        <input type="number" id="form-pld-collected" class="form-control" value="${log ? log.collected_qty : ''}" min="0" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Cracked / Damaged *</label>
                        <input type="number" id="form-pld-cracked" class="form-control" value="${log ? log.cracked_qty : '0'}" min="0" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Bird Mortality (Deaths) *</label>
                        <input type="number" id="form-pld-mortality" class="form-control" value="${log ? log.mortality_qty : '0'}" min="0" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Logging Date *</label>
                        <input type="date" id="form-pld-date" class="form-control" value="${log ? log.date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes / Remarks</label>
                    <textarea id="form-pld-notes" class="form-control" rows="2">${log ? log.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-pld-btn">Save Log</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        document.getElementById('save-pld-btn').onclick = () => {
            const form = document.getElementById('poultry-daily-form');
            if (!form.reportValidity()) return;

            const flock_id = document.getElementById('form-pld-flock').value;
            const collected_qty = Number(document.getElementById('form-pld-collected').value);
            const cracked_qty = Number(document.getElementById('form-pld-cracked').value);
            const mortality_qty = Number(document.getElementById('form-pld-mortality').value);
            const date = document.getElementById('form-pld-date').value;
            const notes = document.getElementById('form-pld-notes').value.trim();

            const data = { flock_id, collected_qty, cracked_qty, mortality_qty, date, notes };

            const flock = DB.getById('flocks', flock_id);
            if (flock && !log && mortality_qty > flock.current_count) {
                App.showToast(`Error: Death count (${mortality_qty}) exceeds flock's headcount (${flock.current_count})`, 'error');
                return;
            }

            if (log) {
                // If editing, reverse the previous mortality update on headcount
                if (flock) {
                    const diff = mortality_qty - log.mortality_qty;
                    DB.update('flocks', flock_id, { current_count: flock.current_count - diff });
                }
                DB.update('poultry_daily', id, data);
                App.showToast('Daily log updated successfully.', 'success');
            } else {
                // Subtract bird deaths from the active flock count
                if (flock) {
                    DB.update('flocks', flock_id, { current_count: flock.current_count - mortality_qty });
                }
                DB.add('poultry_daily', data);
                App.showToast('Daily log saved.', 'success');
            }

            App.closeModal();
            this.loadDailyTable();
        };
    },

    async deleteDaily(id) {
        const log = DB.getById('poultry_daily', id);
        if (!log) return;

        const confirmDelete = await App.confirm('Delete this daily log? This restores subtracted mortality to active flock headcount.');
        if (confirmDelete) {
            const flock = DB.getById('flocks', log.flock_id);
            if (flock) {
                DB.update('flocks', log.flock_id, { current_count: flock.current_count + log.mortality_qty });
            }
            DB.delete('poultry_daily', id);
            App.showToast('Daily log deleted.', 'success');
            this.loadDailyTable();
        }
    },

    // ==========================================
    // TAB 3: FEED & EXPENSES
    // ==========================================
    renderExpensesTab() {
        return `
            <div class="flex-between mb-2">
                <h3>Poultry Feed & Med Costs</h3>
                <button class="btn btn-primary" id="add-poultry-exp-btn">🌾 Record Feed/Med Log</button>
            </div>
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Flock</th>
                                <th>Type</th>
                                <th>Feed Type / Medicine Name</th>
                                <th>Quantity / Dosage</th>
                                <th>Total Cost</th>
                                <th>Notes</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="poultry-exp-table-body">
                            <!-- Loaded dynamically -->
                        </tbody>
                    </table>
                </div>
                <div id="poultry-exp-empty-state" class="empty-state hidden">
                    <div class="empty-state-icon">🌾</div>
                    <h3>No flock logs found</h3>
                    <p>Enter flock feed bags purchases or vaccine applications to monitor dynamic production overhead.</p>
                </div>
            </div>
        `;
    },

    loadExpensesTable() {
        const logs = DB.getAll('poultry_expenses');
        const flocks = DB.getAll('flocks');
        const tbody = document.getElementById('poultry-exp-table-body');
        const emptyState = document.getElementById('poultry-exp-empty-state');
        if (!tbody) return;

        if (logs.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        logs.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = logs.map(e => {
            const flock = flocks.find(f => f.id === e.flock_id);
            const qtyLabel = e.type === 'Feed' ? `${e.quantity_kg} kg` : (e.dosage || '—');

            return `
                <tr>
                    <td>${App.formatDate(e.date)}</td>
                    <td><strong>${flock ? flock.name : 'Unknown Flock'}</strong></td>
                    <td>${App.statusBadge(e.type)}</td>
                    <td><strong>${e.item_name}</strong></td>
                    <td>${qtyLabel}</td>
                    <td class="text-danger font-bold">${App.formatCurrency(e.cost)}</td>
                    <td><small>${e.notes || ''}</small></td>
                    <td class="text-right">
                        <div class="flex gap-1 justify-end">
                            <button class="btn btn-sm btn-success" onclick="Pages.poultry.openExpenseModal('${e.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="Pages.poultry.deleteExpense('${e.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openExpenseModal(id = '') {
        const log = id ? DB.getById('poultry_expenses', id) : null;
        const title = log ? 'Edit Poultry Feed/Med Log' : 'Record Flock Feed / Medication';

        const bodyHTML = `
            <form id="poultry-exp-form">
                <div class="form-group">
                    <label class="form-label">Select Flock *</label>
                    <select id="form-ple-flock" class="form-control" required>
                        ${App.flockOptions(log ? log.flock_id : '')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Log Type *</label>
                        <select id="form-ple-type" class="form-control" required>
                            <option value="Feed" ${log && log.type === 'Feed' ? 'selected' : ''}>Feed Consumption</option>
                            <option value="Medicine" ${log && log.type === 'Medicine' ? 'selected' : ''}>Medication / Vaccine</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Total Cost (₱) *</label>
                        <input type="number" id="form-ple-cost" class="form-control" value="${log ? log.cost : ''}" min="0.01" step="0.01" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Feed/Medicine Item Name *</label>
                        <input type="text" id="form-ple-item" class="form-control" value="${log ? log.item_name : ''}" placeholder="e.g. Grower mash bag or Dewormer" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label class="form-label">Logging Date *</label>
                        <input type="date" id="form-ple-date" class="form-control" value="${log ? log.date : new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;" id="ple-qty-row">
                        <label class="form-label">Quantity Consumed (kg)</label>
                        <input type="number" id="form-ple-qty" class="form-control" value="${log ? log.quantity_kg : ''}" min="0.1" step="0.1">
                    </div>
                    <div class="form-group" style="flex: 1;" id="ple-dosage-row">
                        <label class="form-label">Dosage Instructions</label>
                        <input type="text" id="form-ple-dosage" class="form-control" value="${log ? log.dosage : ''}" placeholder="e.g. 5ml/liter water">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Detailed Notes</label>
                    <textarea id="form-ple-notes" class="form-control" rows="2">${log ? log.notes : ''}</textarea>
                </div>
            </form>
        `;

        const footerHTML = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" id="save-ple-btn">Save Entry</button>
        `;

        App.showModal(title, bodyHTML, footerHTML);

        // Toggle quantity/dosage input displays dynamically based on type selection
        const typeSelect = document.getElementById('form-ple-type');
        const qtyRow = document.getElementById('ple-qty-row');
        const dosageRow = document.getElementById('ple-dosage-row');

        const toggleInputs = () => {
            const isFeed = typeSelect.value === 'Feed';
            qtyRow.style.display = isFeed ? '' : 'none';
            dosageRow.style.display = isFeed ? 'none' : '';
        };

        typeSelect.onchange = toggleInputs;
        toggleInputs(); // Trigger on load

        document.getElementById('save-ple-btn').onclick = () => {
            const form = document.getElementById('poultry-exp-form');
            if (!form.reportValidity()) return;

            const flock_id = document.getElementById('form-ple-flock').value;
            const type = document.getElementById('form-ple-type').value;
            const cost = Number(document.getElementById('form-ple-cost').value);
            const item_name = document.getElementById('form-ple-item').value.trim();
            const date = document.getElementById('form-ple-date').value;
            const notes = document.getElementById('form-ple-notes').value.trim();
            
            const quantity_kg = type === 'Feed' ? Number(document.getElementById('form-ple-qty').value || 0) : 0;
            const dosage = type === 'Medicine' ? document.getElementById('form-ple-dosage').value.trim() : '';

            const data = { flock_id, type, cost, item_name, date, notes, quantity_kg, dosage };

            if (log) {
                DB.update('poultry_expenses', id, data);
                App.showToast('Flock exp log updated.', 'success');
            } else {
                DB.add('poultry_expenses', data);
                App.showToast('Flock log registered.', 'success');
            }

            App.closeModal();
            this.loadExpensesTable();
        };
    },

    async deleteExpense(id) {
        const confirmDelete = await App.confirm('Delete this flock expense log? This alters aggregate ledger statistics.');
        if (confirmDelete) {
            DB.delete('poultry_expenses', id);
            App.showToast('Log deleted successfully.', 'success');
            this.loadExpensesTable();
        }
    }
};

