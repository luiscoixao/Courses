// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQ_lzuLx_W7uxoseXds_dBra5a0wK-DOo",
  authDomain: "app-marche-880b8.firebaseapp.com",
  databaseURL: "https://app-marche-880b8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "app-marche-880b8",
  storageBucket: "app-marche-880b8.firebasestorage.app",
  messagingSenderId: "502480011388",
  appId: "1:502480011388:web:93ab2f7d4db876c7ddc9f9"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// État de l'app
let currentListId = null;
let currentFilter = "Tous";
let items = {};
let history = [];
let isOnline = true;

// Initialiser l'app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadOrCreateList();
});

// Initialiser l'app
function initializeApp() {
  renderFilterChips();
  renderItems();
  renderHistory();
  
  // Vérifier la connectivité
  window.addEventListener('online', () => {
    isOnline = true;
    console.log('En ligne');
  });
  window.addEventListener('offline', () => {
    isOnline = false;
    console.log('Hors ligne');
  });
}

// Charger ou créer une liste
function loadOrCreateList() {
  let listId = localStorage.getItem('currentListId');
  
  if (!listId) {
    // Créer une nouvelle liste
    listId = generateListId();
    localStorage.setItem('currentListId', listId);
    currentListId = listId;
    
    // Créer la structure dans Firebase
    database.ref(`lists/${listId}`).set({
      created: new Date().toISOString(),
      items: {},
      history: []
    });
  } else {
    currentListId = listId;
  }
  
  // Écouter les changements en temps réel
  listenToListChanges();
}

// Écouter les changements en temps réel
function listenToListChanges() {
  database.ref(`lists/${currentListId}/items`).on('value', (snapshot) => {
    items = snapshot.val() || {};
    renderItems();
  });
  
  database.ref(`lists/${currentListId}/history`).on('value', (snapshot) => {
    history = snapshot.val() || [];
    renderHistory();
  });
}

// Générer un ID de liste unique
function generateListId() {
  return 'list_' + Math.random().toString(36).substr(2, 9);
}

// Ajouter un article
function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const quantity = parseInt(document.getElementById('itemQuantity').value) || 1;
  const category = document.getElementById('itemCategory').value;
  
  if (!name) {
    alert('Veuillez entrer un nom d\'article');
    return;
  }
  
  const itemId = 'item_' + Date.now();
  const item = {
    id: itemId,
    name: name,
    quantity: quantity,
    category: category,
    checked: false,
    created: new Date().toISOString()
  };
  
  // Sauvegarder dans Firebase
  database.ref(`lists/${currentListId}/items/${itemId}`).set(item);
  
  closeModal();
}

// Cocher/Décocher un article
function toggleItem(itemId) {
  const item = items[itemId];
  if (!item) return;
  
  item.checked = !item.checked;
  
  if (item.checked) {
    // Ajouter à l'historique
    const historyEntry = {
      ...item,
      checkedAt: new Date().toISOString()
    };
    
    database.ref(`lists/${currentListId}/history`).push(historyEntry);
  }
  
  // Mettre à jour l'article
  database.ref(`lists/${currentListId}/items/${itemId}`).update({
    checked: item.checked
  });
}

// Supprimer un article
function deleteItem(itemId) {
  database.ref(`lists/${currentListId}/items/${itemId}`).remove();
}

// Rendre les articles
function renderItems() {
  const list = document.getElementById('itemsList');
  const empty = document.getElementById('emptyState');
  
  const filteredItems = Object.values(items).filter(item => {
    if (currentFilter === "Tous") return !item.checked;
    return item.category === currentFilter && !item.checked;
  });
  
  if (filteredItems.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    updateProgress();
    return;
  }
  
  empty.classList.add('hidden');
  
  list.innerHTML = filteredItems.map(item => `
    <div class="item-row ${item.checked ? 'checked' : ''}">
      <input type="checkbox" ${item.checked ? 'checked' : ''} 
             onchange="toggleItem('${item.id}')" class="item-checkbox">
      <div class="item-content">
        <span class="item-name">${escapeHtml(item.name)}</span>
        <span class="item-quantity">×${item.quantity}</span>
      </div>
      <button class="btn-delete" onclick="deleteItem('${item.id}')">🗑️</button>
    </div>
  `).join('');
  
  updateProgress();
}

// Rendre l'historique
function renderHistory() {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('emptyHistory');
  
  if (history.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  
  empty.classList.add('hidden');
  
  list.innerHTML = history.map(item => `
    <div class="item-row checked">
      <input type="checkbox" checked disabled class="item-checkbox">
      <div class="item-content">
        <span class="item-name">${escapeHtml(item.name)}</span>
        <span class="item-quantity">×${item.quantity}</span>
        <span class="item-date">${new Date(item.checkedAt).toLocaleString('fr-FR')}</span>
      </div>
    </div>
  `).join('');
}

// Rendre les filtres
function renderFilterChips() {
  const container = document.getElementById('filterChips');
  const categories = ["Tous", "Fruits & Légumes", "Viandes & Poissons", "Produits laitiers", 
                      "Boulangerie", "Boissons", "Épicerie", "Surgelés", "Hygiène"];
  
  container.innerHTML = categories.map(cat => `
    <button class="chip ${currentFilter === cat ? 'active' : ''}" 
            onclick="setFilter('${cat}')">${cat}</button>
  `).join('');
}

// Définir le filtre
function setFilter(category) {
  currentFilter = category;
  renderFilterChips();
  renderItems();
}

// Mettre à jour la progression
function updateProgress() {
  const total = Object.values(items).filter(item => !item.checked).length;
  const checked = Object.values(items).filter(item => item.checked).length;
  const progress = total === 0 ? 0 : (checked / (checked + total)) * 100;
  
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('progressText').textContent = `${checked}/${checked + total} articles`;
}

// Partager la liste
function openShareModal() {
  document.getElementById('shareCode').value = currentListId;
  document.getElementById('shareModal').classList.remove('hidden');
}

function closeShareModal() {
  document.getElementById('shareModal').classList.add('hidden');
}

function copyShareCode() {
  const code = document.getElementById('shareCode').value;
  navigator.clipboard.writeText(code).then(() => {
    alert('Code copié !');
  });
}

function joinSharedList() {
  const code = document.getElementById('joinCode').value.trim();
  if (!code) {
    alert('Veuillez entrer un code');
    return;
  }
  
  // Vérifier que la liste existe
  database.ref(`lists/${code}`).once('value', (snapshot) => {
    if (snapshot.exists()) {
      localStorage.setItem('currentListId', code);
      currentListId = code;
      items = {};
      history = [];
      listenToListChanges();
      closeShareModal();
      alert('Liste rejointe !');
    } else {
      alert('Code invalide');
    }
  });
}

// Vider l'historique
function clearHistory() {
  if (confirm('Êtes-vous sûr de vouloir vider l\'historique ?')) {
    database.ref(`lists/${currentListId}/history`).set([]);
  }
}

// Modal d'ajout
function openModal() {
  document.getElementById('addModal').classList.remove('hidden');
  document.getElementById('itemName').focus();
}

function closeModal() {
  document.getElementById('addModal').classList.add('hidden');
  document.getElementById('itemName').value = '';
  document.getElementById('itemQuantity').value = '1';
}

// Navigation
function toggleScreen() {
  const mainScreen = document.getElementById('mainScreen');
  const historyScreen = document.getElementById('historyScreen');
  const navLabel = document.getElementById('navLabel');
  
  if (mainScreen.classList.contains('hidden')) {
    mainScreen.classList.remove('hidden');
    historyScreen.classList.add('hidden');
    navLabel.textContent = 'Historique';
  } else {
    mainScreen.classList.add('hidden');
    historyScreen.classList.remove('hidden');
    navLabel.textContent = 'Ma Liste';
  }
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('addBtn').addEventListener('click', openModal);
  document.getElementById('shareBtn').addEventListener('click', openShareModal);
  document.getElementById('navToggle').addEventListener('click', toggleScreen);
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
  
  // Fermer le modal en cliquant en dehors
  document.getElementById('addModal').addEventListener('click', (e) => {
    if (e.target.id === 'addModal') closeModal();
  });
  
  document.getElementById('shareModal').addEventListener('click', (e) => {
    if (e.target.id === 'shareModal') closeShareModal();
  });
  
  // Entrée pour ajouter un article
  document.getElementById('itemName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
  });
}

// Échapper HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
