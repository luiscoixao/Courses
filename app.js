// ─── Catégories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'fruits-legumes', label: 'Fruits & Légumes', emoji: '🥦', color: '#4CAF50' },
    { id: 'viandes-poissons', label: 'Viandes & Poissons', emoji: '🥩', color: '#F44336' },
    { id: 'produits-laitiers', label: 'Produits laitiers', emoji: '🧀', color: '#FFC107' },
    { id: 'epicerie', label: 'Épicerie', emoji: '🛒', color: '#FF9800' },
    { id: 'boissons', label: 'Boissons', emoji: '🥤', color: '#2196F3' },
    { id: 'hygiene-beaute', label: 'Hygiène & Beauté', emoji: '🧴', color: '#9C27B0' },
    { id: 'surgeles', label: 'Surgelés', emoji: '❄️', color: '#00BCD4' },
    { id: 'autres', label: 'Autres', emoji: '📦', color: '#607D8B' }
];

function getCategoryById(id) {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

// ─── State ────────────────────────────────────────────────────────────────────

let state = {
    items: [],
    activeCategory: 'all',
    quantity: 1
};

const STORAGE_KEY = 'marche_items';

// ─── Storage ──────────────────────────────────────────────────────────────────

function loadItems() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            state.items = JSON.parse(raw);
        } catch (e) {
            console.error('Error loading items:', e);
        }
    }
}

function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function addItem(name, quantity, categoryId) {
    const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        quantity,
        categoryId,
        checked: false,
        createdAt: Date.now()
    };
    state.items.push(item);
    saveItems();
    render();
}

function toggleItem(id) {
    const item = state.items.find(i => i.id === id);
    if (item) {
        item.checked = !item.checked;
        if (item.checked) {
            item.checkedAt = Date.now();
        } else {
            delete item.checkedAt;
        }
        saveItems();
        render();
    }
}

function removeItem(id) {
    state.items = state.items.filter(i => i.id !== id);
    saveItems();
    render();
}

function clearChecked() {
    state.items = state.items.filter(i => !i.checked);
    saveItems();
    render();
}

function resetAll() {
    state.items = [];
    saveItems();
    render();
}

// ─── DOM Updates ──────────────────────────────────────────────────────────────

function render() {
    renderListTab();
    renderHistoryTab();
}

function renderListTab() {
    const unchecked = state.items.filter(i => !i.checked);
    const checked = state.items.filter(i => i.checked);
    const total = state.items.length;

    // Header
    const headerCount = document.getElementById('header-count');
    if (total > 0) {
        headerCount.textContent = `${checked.length}/${total} article${total > 1 ? 's' : ''}`;
    } else {
        headerCount.textContent = '';
    }

    // Progress
    const progressContainer = document.getElementById('progress-container');
    if (total > 0) {
        progressContainer.style.display = 'flex';
        const progress = total > 0 ? checked.length / total : 0;
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = (progress * 100) + '%';
        
        const progressText = document.getElementById('progress-text');
        if (checked.length === total && total > 0) {
            progressText.textContent = '🎉 Liste complète !';
        } else {
            progressText.textContent = `${Math.round(progress * 100)}% complété`;
        }
    } else {
        progressContainer.style.display = 'none';
    }

    // Filter
    const filterScroll = document.getElementById('filter-scroll');
    const presentCategories = [...new Set(state.items.map(i => i.categoryId))];
    if (presentCategories.length > 1) {
        filterScroll.style.display = 'flex';
    } else {
        filterScroll.style.display = 'none';
    }

    // Empty state
    const emptyState = document.getElementById('empty-state');
    const itemsList = document.getElementById('items-list');
    if (total === 0) {
        emptyState.style.display = 'flex';
        itemsList.innerHTML = '';
    } else {
        emptyState.style.display = 'none';
        
        // Filter items
        let filtered = unchecked;
        if (state.activeCategory !== 'all') {
            filtered = filtered.filter(i => i.categoryId === state.activeCategory);
        }

        let filteredChecked = checked;
        if (state.activeCategory !== 'all') {
            filteredChecked = filteredChecked.filter(i => i.categoryId === state.activeCategory);
        }

        // Render items
        let html = '';
        filtered.forEach(item => {
            html += renderItemRow(item);
        });

        if (filteredChecked.length > 0) {
            html += `<div class="section-header">
                <span>Déjà dans le panier (${filteredChecked.length})</span>
                <button class="btn-clear-checked" onclick="clearCheckedItems()">Supprimer</button>
            </div>`;
            filteredChecked.forEach(item => {
                html += renderItemRow(item);
            });
        }

        itemsList.innerHTML = html;
    }

    // Reset button
    const btnReset = document.getElementById('btn-reset');
    btnReset.style.display = total > 0 ? 'block' : 'none';
}

function renderItemRow(item) {
    const category = getCategoryById(item.categoryId);
    const checked = item.checked ? 'checked' : '';
    const strikethrough = item.checked ? 'text-decoration: line-through; color: var(--muted);' : '';
    
    return `
        <div class="item-row ${checked}">
            <button class="item-checkbox ${checked}" onclick="toggleItem('${item.id}')" title="Cocher">
                ${item.checked ? '✓' : ''}
            </button>
            <div class="item-content">
                <div class="item-name" style="${strikethrough}">${escapeHtml(item.name)}</div>
                <div class="item-meta">
                    <div class="category-badge" style="background-color: ${category.color}22; color: ${category.color}">
                        <span class="category-emoji">${category.emoji}</span>
                        <span>${category.label}</span>
                    </div>
                    ${item.quantity > 1 ? `<div class="qty-badge">×${item.quantity}</div>` : ''}
                </div>
            </div>
            <button class="btn-delete" onclick="removeItem('${item.id}')" title="Supprimer">✕</button>
        </div>
    `;
}

function renderHistoryTab() {
    const checked = [...state.items.filter(i => i.checked)].sort((a, b) => (b.checkedAt || 0) - (a.checkedAt || 0));
    
    const historyCount = document.getElementById('history-count');
    historyCount.textContent = `${checked.length} article${checked.length !== 1 ? 's' : ''} coché${checked.length !== 1 ? 's' : ''}`;

    const btnClearHistory = document.getElementById('btn-clear-history');
    btnClearHistory.style.display = checked.length > 0 ? 'block' : 'none';

    const emptyHistory = document.getElementById('empty-history');
    const historyList = document.getElementById('history-list');

    if (checked.length === 0) {
        emptyHistory.style.display = 'flex';
        historyList.innerHTML = '';
    } else {
        emptyHistory.style.display = 'none';
        
        let html = '';
        checked.forEach(item => {
            const category = getCategoryById(item.categoryId);
            const date = formatDate(item.checkedAt);
            html += `
                <div class="history-item">
                    <div class="history-check">✓</div>
                    <div class="history-content">
                        <div class="history-name">${escapeHtml(item.name)}</div>
                        <div class="item-meta">
                            <div class="category-badge" style="background-color: ${category.color}22; color: ${category.color}">
                                <span class="category-emoji">${category.emoji}</span>
                                <span>${category.label}</span>
                            </div>
                            ${item.quantity > 1 ? `<div class="qty-badge">×${item.quantity}</div>` : ''}
                        </div>
                    </div>
                    <div class="history-date">${date}</div>
                </div>
            `;
        });
        historyList.innerHTML = html;
    }
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function openModal() {
    state.quantity = 1;
    document.getElementById('modal-add').classList.add('active');
    document.getElementById('input-name').focus();
    renderCategoryGrid();
}

function closeModal() {
    document.getElementById('modal-add').classList.remove('active');
}

function renderCategoryGrid() {
    const grid = document.getElementById('category-grid');
    let html = '';
    CATEGORIES.forEach(cat => {
        html += `
            <button class="category-btn" style="border-color: ${cat.color}; background-color: var(--surface); color: var(--foreground);" 
                    onclick="selectCategory('${cat.id}')">
                <span class="category-emoji">${cat.emoji}</span>
                <span>${cat.label}</span>
            </button>
        `;
    });
    grid.innerHTML = html;
    selectCategory('autres');
}

function selectCategory(id) {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    const selected = Array.from(buttons).find(btn => btn.textContent.includes(getCategoryById(id).label));
    if (selected) {
        selected.classList.add('active');
        const cat = getCategoryById(id);
        selected.style.backgroundColor = cat.color;
        selected.style.color = 'white';
    }
    state.selectedCategory = id;
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    render();

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            document.getElementById(tab + '-tab').classList.add('active');
        });
    });

    // Modal
    document.getElementById('btn-add').addEventListener('click', openModal);
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', closeModal);

    // Quantity
    document.getElementById('btn-qty-minus').addEventListener('click', () => {
        state.quantity = Math.max(1, state.quantity - 1);
        document.getElementById('qty-value').textContent = state.quantity;
    });

    document.getElementById('btn-qty-plus').addEventListener('click', () => {
        state.quantity++;
        document.getElementById('qty-value').textContent = state.quantity;
    });

    // Add item
    document.getElementById('btn-add-item').addEventListener('click', () => {
        const name = document.getElementById('input-name').value.trim();
        if (!name) return;
        addItem(name, state.quantity, state.selectedCategory || 'autres');
        closeModal();
    });

    // Enter key in input
    document.getElementById('input-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('btn-add-item').click();
        }
    });

    // Reset
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm('Voulez-vous supprimer tous les articles ?')) {
            resetAll();
        }
    });

    // Clear history
    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if (confirm('Supprimer tous les articles cochés ?')) {
            clearChecked();
        }
    });

    // Filter
    document.getElementById('filter-scroll').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-chip')) {
            document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
            e.target.classList.add('active');
            state.activeCategory = e.target.dataset.category;
            renderListTab();
        }
    });

    // Initialize filter chips
    const filterScroll = document.getElementById('filter-scroll');
    CATEGORIES.forEach(cat => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip';
        chip.dataset.category = cat.id;
        chip.textContent = `${cat.emoji} ${cat.label}`;
        chip.style.borderColor = cat.color;
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.activeCategory = cat.id;
            renderListTab();
        });
        filterScroll.appendChild(chip);
    });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Global functions for inline onclick
window.toggleItem = toggleItem;
window.removeItem = removeItem;
window.selectCategory = selectCategory;
window.clearCheckedItems = clearChecked;
