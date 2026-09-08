// Main Application Controller for Pig Farm Management System
const PERMISSIONS = {
    Administrator: {
        users: ['create', 'read', 'update', 'delete'],
        settings: ['read', 'update'],
        backup: ['create', 'restore'],
        pigs: ['create', 'read', 'update', 'delete'],
        feed: ['create', 'read', 'update', 'delete'],
        medicine: ['create', 'read', 'update', 'delete'],
        weight: ['create', 'read', 'update', 'delete'],
        expenses: ['create', 'read', 'update', 'delete'],
        income: ['create', 'read', 'update', 'delete'],
        housing: ['create', 'read', 'update', 'delete'],
        breeding: ['create', 'read', 'update', 'delete'],
        reports: ['read', 'export'],
        owners: ['manage'],
        import_data: ['create'],
        batches: ['create', 'read', 'update', 'delete'],
        poultry: ['create', 'read', 'update', 'delete'],
        sync: ['read', 'create']
    },
    Manager: {
        pigs: ['create', 'read', 'update'],
        feed: ['create', 'read', 'update'],
        medicine: ['create', 'read', 'update'],
        weight: ['create', 'read', 'update'],
        expenses: ['create', 'read', 'update'],
        income: ['create', 'read', 'update'],
        housing: ['create', 'read', 'update'],
        breeding: ['create', 'read', 'update'],
        reports: ['read'],
        batches: ['create', 'read', 'update'],
        poultry: ['create', 'read', 'update'],
        sync: ['read', 'create']
    }
};

window.App = {
    currentUser: null,
    currentPage: 'dashboard',

    init() {
        // Initialize Database
        DB.init();

        // Check login session
        const sessionUser = DB.getCurrentUser();
        if (sessionUser) {
            this.currentUser = sessionUser;
            this.showApp();
        } else {
            this.showLogin();
        }

        // Register Service Worker for PWA (iOS/Android)
        this.registerServiceWorker();
    },

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('app-shell').classList.add('hidden');
        this.setupLoginHandlers();
    },

    setupLoginHandlers() {
        const loginBtn = document.getElementById('login-btn');
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');
        const errorEl = document.getElementById('login-error');

        const doLogin = () => {
            const username = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value;
            errorEl.textContent = '';

            if (!username || !password) {
                errorEl.textContent = 'Please enter both username and password';
                return;
            }

            const user = DB.authenticate(username, password);
            if (user) {
                this.currentUser = user;
                this.showApp();
                this.showToast(`Welcome back, ${user.name}!`, 'success');
            } else {
                errorEl.textContent = 'Invalid username or password';
                passwordInput.value = '';
            }
        };

        loginBtn.onclick = doLogin;
        passwordInput.onkeydown = (e) => { if (e.key === 'Enter') doLogin(); };
        usernameInput.onkeydown = (e) => { if (e.key === 'Enter') passwordInput.focus(); };

        setTimeout(() => usernameInput.focus(), 100);
    },

    showApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-shell').classList.remove('hidden');

        this.updateUserInfo();
        this.applyRBAC();
        this.setupNavigation();
        
        // Load page based on URL hash or default to dashboard
        const hash = window.location.hash.replace('#', '');
        const defaultPage = ['dashboard', 'pigs', 'batches', 'poultry', 'feeding', 'medicine', 'weight', 'expenses', 'income', 'housing', 'breeding', 'reports', 'sync', 'users', 'settings'].includes(hash) ? hash : 'dashboard';
        
        this.navigate(defaultPage);
    },

    updateUserInfo() {
        const nameEl = document.getElementById('user-display-name');
        const roleEl = document.getElementById('user-display-role');
        if (nameEl) nameEl.textContent = this.currentUser.name;
        if (roleEl) {
            roleEl.textContent = this.currentUser.role;
            roleEl.className = 'user-role badge ' + (this.currentUser.role === 'Administrator' ? 'badge-admin' : 'badge-manager');
        }
    },

    applyRBAC() {
        // Hide nav items the current user doesn't have access to
        const adminItems = document.querySelectorAll('.admin-only');
        const isAdmin = this.currentUser.role === 'Administrator';
        adminItems.forEach(item => {
            if (isAdmin) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    },

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigate(page);
                // Close sidebar on mobile after clicking
                document.getElementById('sidebar').classList.remove('open');
            };
        });

        // Logout handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                DB.logout();
                this.currentUser = null;
                this.showLogin();
                this.showToast('You have been logged out.', 'info');
            };
        }

        // Hamburger Menu toggle
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        if (hamburgerBtn && sidebar) {
            hamburgerBtn.onclick = () => {
                sidebar.classList.toggle('open');
            };
        }

        // Close sidebar if clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    },

    navigate(page) {
        // Enforce RBAC navigation guard
        if (['users', 'settings'].includes(page) && !this.isAdmin()) {
            this.showToast('Access Denied: Administrators only.', 'error');
            this.navigate('dashboard');
            return;
        }

        this.currentPage = page;
        window.location.hash = page;

        // Active state in sidebar navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Render target page
        const contentArea = document.getElementById('main-content');
        if (window.Pages && window.Pages[page]) {
            contentArea.innerHTML = window.Pages[page].render();
            // Initialize event listeners for the page
            if (window.Pages[page].init) {
                window.Pages[page].init();
            }
        } else {
            contentArea.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚧</div>
                    <h3>Page Under Construction</h3>
                    <p>The module for "${page}" is currently being developed.</p>
                </div>
            `;
        }
    },

    // --- Permissions Helpers ---
    hasPermission(module, action) {
        if (!this.currentUser) return false;
        const role = this.currentUser.role;
        return PERMISSIONS[role] && PERMISSIONS[role][module] && PERMISSIONS[role][module].includes(action);
    },

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'Administrator';
    },

    // --- UI Notifications and Dialogs ---
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'warning') icon = '⚠️';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Remove toast after animation finishes
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    },

    showModal(title, bodyHTML, footerHTML) {
        const overlay = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalFooter = document.getElementById('modal-footer');

        if (!overlay || !modalTitle || !modalBody || !modalFooter) return;

        modalTitle.textContent = title;
        modalBody.innerHTML = bodyHTML;
        modalFooter.innerHTML = footerHTML || `<button class="btn btn-secondary" onclick="App.closeModal()">Close</button>`;

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    },

    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    },

    confirm(message) {
        return new Promise((resolve) => {
            const bodyHTML = `<p style="color: var(--text-secondary); font-size: 1.05rem;">${message}</p>`;
            const footerHTML = `
                <button class="btn btn-secondary" id="confirm-cancel-btn">Cancel</button>
                <button class="btn btn-danger" id="confirm-ok-btn">Confirm</button>
            `;
            this.showModal('Confirmation Required', bodyHTML, footerHTML);

            document.getElementById('confirm-cancel-btn').onclick = () => {
                this.closeModal();
                resolve(false);
            };
            document.getElementById('confirm-ok-btn').onclick = () => {
                this.closeModal();
                resolve(true);
            };
        });
    },

    // --- Formatting Helpers ---
    formatCurrency(amount) {
        const settings = DB.getSettings();
        const currency = settings.currency || '₱';
        return `${currency}${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    formatDateTime(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    ownerBadge(owner) {
        let badgeClass = 'badge-shared';
        if (owner === 'Banjo') badgeClass = 'badge-banjo';
        if (owner === 'Albe') badgeClass = 'badge-albe';
        return `<span class="badge ${badgeClass}">${owner}</span>`;
    },

    statusBadge(status) {
        let badgeClass = 'badge-info';
        if (['Active', 'Pregnant', 'Active Pen'].includes(status)) badgeClass = 'badge-success';
        if (['Deceased', 'Failed', 'Maintenance'].includes(status)) badgeClass = 'badge-danger';
        if (['Breeding', 'Mated', 'Farrowing'].includes(status)) badgeClass = 'badge-warning';
        return `<span class="badge ${badgeClass}">${status}</span>`;
    },

    // --- Dropdown options helpers ---
    ownerOptions(selected = '') {
        return `
            <option value="Banjo" ${selected === 'Banjo' ? 'selected' : ''}>Banjo</option>
            <option value="Albe" ${selected === 'Albe' ? 'selected' : ''}>Albe</option>
            <option value="Shared" ${selected === 'Shared' ? 'selected' : ''}>Shared</option>
        `;
    },

    pigOptions(selectedId = '', genderFilter = '') {
        let pigs = DB.getAll('pigs');
        if (genderFilter) {
            pigs = pigs.filter(p => p.gender === genderFilter);
        }
        return `
            <option value="" disabled ${!selectedId ? 'selected' : ''}>Select a pig...</option>
            ${pigs.map(p => `<option value="${p.id}" ${selectedId === p.id ? 'selected' : ''}>[${p.tag}] ${p.name} (${p.owner})</option>`).join('')}
        `;
    },

    housingOptions(selectedId = '') {
        const pens = DB.getAll('housing').filter(h => h.status === 'Active');
        return `
            <option value="" disabled ${!selectedId ? 'selected' : ''}>Select a pen...</option>
            ${pens.map(p => `<option value="${p.id}" ${selectedId === p.id ? 'selected' : ''}>${p.pen_number} - ${p.type} (${p.location})</option>`).join('')}
        `;
    },

    batchOptions(selectedId = '') {
        const batches = DB.getAll('batches').filter(b => b.status === 'Active');
        return `
            <option value="">No Batch Assignment</option>
            ${batches.map(b => `<option value="${b.id}" ${selectedId === b.id ? 'selected' : ''}>${b.name} (${b.owner})</option>`).join('')}
        `;
    },

    flockOptions(selectedId = '') {
        const flocks = DB.getAll('flocks').filter(f => f.status === 'Active');
        return `
            <option value="" disabled ${!selectedId ? 'selected' : ''}>Select a flock...</option>
            ${flocks.map(f => `<option value="${f.id}" ${selectedId === f.id ? 'selected' : ''}>${f.name} (${f.owner})</option>`).join('')}
        `;
    },

    auditInfo(record) {
        return `
            <div class="audit-info">
                <div class="audit-row"><span class="audit-label">Created By:</span> <span>${record.created_by || 'System'}</span></div>
                <div class="audit-row"><span class="audit-label">Date Created:</span> <span>${this.formatDateTime(record.created_at)}</span></div>
                ${record.updated_by ? `<div class="audit-row"><span class="audit-label">Last Updated By:</span> <span>${record.updated_by}</span></div>` : ''}
                ${record.updated_at ? `<div class="audit-row"><span class="audit-label">Date Modified:</span> <span>${this.formatDateTime(record.updated_at)}</span></div>` : ''}
            </div>
        `;
    },

    // --- Register Service Worker for offline / mobile capability ---
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            const register = () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(reg => console.log('Service Worker registered successfully.', reg.scope))
                    .catch(err => console.log('Service Worker registration failed: ', err));
            };
            if (document.readyState === 'complete') {
                register();
            } else {
                window.addEventListener('load', register);
            }
        }
    }
};

// Start app on DOM content loaded
document.addEventListener('DOMContentLoaded', () => App.init());
