// ============================================
// PIZZERIA DA GIANNI - JAVASCRIPT
// Created by Terry - Terragon Labs
// ============================================

// ============================================
// API Configuration
// ============================================
const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_ENDPOINTS = {
  products: '/products',
  categories: '/categories',
  cart: '/cart',
  orders: '/orders',
  reservations: '/reservations',
  deliveryZones: '/delivery-zones/check',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout'
  }
};

// ============================================
// State Management
// ============================================
const AppState = {
  user: null,
  cart: [],
  products: [],
  categories: [],
  currentCategory: 'all',
  isLoading: false
};

// ============================================
// Authentication Manager
// ============================================
class AuthManager {
  static getToken() {
    return localStorage.getItem('auth_token');
  }

  static setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  static removeToken() {
    localStorage.removeItem('auth_token');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      this.setToken(data.data.token);
      AppState.user = data.data;
      return data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      if (this.isAuthenticated()) {
        await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.getToken()}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
      AppState.user = null;
      AppState.cart = [];
      updateUI();
    }
  }

  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      this.setToken(data.data.token);
      AppState.user = data.data;
      return data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}

// ============================================
// API Service
// ============================================
class APIService {
  static async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (AuthManager.isAuthenticated()) {
      headers['Authorization'] = `Bearer ${AuthManager.getToken()}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  static async getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`${API_ENDPOINTS.products}?${params}`);
  }

  static async getProduct(id) {
    return this.request(`${API_ENDPOINTS.products}/${id}`);
  }

  static async getCart() {
    if (!AuthManager.isAuthenticated()) {
      return { data: { cart_items: [], summary: { subtotal: 0, item_count: 0 } } };
    }
    return this.request(API_ENDPOINTS.cart);
  }

  static async addToCart(item) {
    return this.request(API_ENDPOINTS.cart, {
      method: 'POST',
      body: JSON.stringify(item)
    });
  }

  static async updateCartItem(cartId, quantity) {
    return this.request(`${API_ENDPOINTS.cart}/${cartId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  static async removeFromCart(cartId) {
    return this.request(`${API_ENDPOINTS.cart}/${cartId}`, {
      method: 'DELETE'
    });
  }

  static async createReservation(data) {
    return this.request(API_ENDPOINTS.reservations, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async checkDeliveryZone(postalCode) {
    return this.request(`${API_ENDPOINTS.deliveryZones}?postal_code=${postalCode}`);
  }
}

// ============================================
// Cart Manager
// ============================================
class CartManager {
  static async loadCart() {
    try {
      if (AuthManager.isAuthenticated()) {
        const response = await APIService.getCart();
        AppState.cart = response.data.cart_items || [];
      } else {
        // Load from localStorage for guest users
        AppState.cart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      }
      this.updateCartUI();
    } catch (error) {
      console.error('Error loading cart:', error);
      AppState.cart = [];
    }
  }

  static async addItem(productId, sizeId, quantity = 1, customizations = []) {
    try {
      if (AuthManager.isAuthenticated()) {
        await APIService.addToCart({ product_id: productId, size_id: sizeId, quantity, customizations });
        await this.loadCart();
      } else {
        // Guest cart
        const item = {
          product_id: productId,
          size_id: sizeId,
          quantity,
          customizations
        };
        AppState.cart.push(item);
        localStorage.setItem('guest_cart', JSON.stringify(AppState.cart));
        this.updateCartUI();
      }
      showNotification('Prodotto aggiunto al carrello!', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Errore nell\'aggiungere il prodotto', 'error');
    }
  }

  static async updateQuantity(cartId, quantity) {
    try {
      if (AuthManager.isAuthenticated()) {
        await APIService.updateCartItem(cartId, quantity);
        await this.loadCart();
      } else {
        const item = AppState.cart.find(i => i.cart_id === cartId);
        if (item) item.quantity = quantity;
        localStorage.setItem('guest_cart', JSON.stringify(AppState.cart));
        this.updateCartUI();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  static async removeItem(cartId) {
    try {
      if (AuthManager.isAuthenticated()) {
        await APIService.removeFromCart(cartId);
        await this.loadCart();
      } else {
        AppState.cart = AppState.cart.filter(i => i.cart_id !== cartId);
        localStorage.setItem('guest_cart', JSON.stringify(AppState.cart));
        this.updateCartUI();
      }
      showNotification('Prodotto rimosso dal carrello', 'success');
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  static updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = AppState.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;

    // Update cart modal if open
    if (document.getElementById('cartModal').classList.contains('active')) {
      this.renderCartModal();
    }
  }

  static renderCartModal() {
    const cartItemsContainer = document.getElementById('cartItems');

    if (AppState.cart.length === 0) {
      cartItemsContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">Il carrello è vuoto</p>';
      document.getElementById('cartSubtotal').textContent = '€0.00';
      document.getElementById('cartTax').textContent = '€0.00';
      document.getElementById('cartTotal').textContent = '€0.00';
      return;
    }

    // Render cart items (mockup data)
    const subtotal = 25.50; // This would be calculated from actual cart data
    const deliveryFee = 2.50;
    const taxRate = 0.22;
    const tax = (subtotal + deliveryFee) * taxRate;
    const total = subtotal + deliveryFee + tax;

    document.getElementById('cartSubtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('cartTax').textContent = `€${tax.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `€${total.toFixed(2)}`;

    // Render items (simplified for mockup)
    cartItemsContainer.innerHTML = AppState.cart.map((item, index) => `
      <div class="cart-item" style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid #eee;">
        <img src="/images/pizzas/placeholder.jpg" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1;">
          <h4>Pizza Margherita</h4>
          <p style="color: #7f8c8d; font-size: 0.9rem;">Media (30cm)</p>
          <p style="color: var(--primary-color); font-weight: 600;">€10.50</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button onclick="CartManager.updateQuantity(${index}, ${item.quantity - 1})" style="width: 30px; height: 30px; background: #f0f0f0; border-radius: 50%;">-</button>
          <span>${item.quantity || 1}</span>
          <button onclick="CartManager.updateQuantity(${index}, ${item.quantity + 1})" style="width: 30px; height: 30px; background: #f0f0f0; border-radius: 50%;">+</button>
          <button onclick="CartManager.removeItem(${index})" style="color: #e74c3c; margin-left: 0.5rem;">🗑️</button>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// Product Manager
// ============================================
class ProductManager {
  static async loadProducts(filters = {}) {
    try {
      AppState.isLoading = true;
      showLoading();

      // Mock data for demonstration
      AppState.products = [
        {
          product_id: 1,
          product_name: 'Margherita',
          description: 'Pomodoro, mozzarella, basilico fresco',
          base_price: 7.50,
          image_url: '/images/pizzas/margherita.jpg',
          category_id: 1,
          is_vegetarian: true,
          avg_rating: 4.8,
          review_count: 156,
          sizes: [
            { size_id: 1, size_name: 'Piccola', price: 7.50 },
            { size_id: 2, size_name: 'Media', price: 10.50 },
            { size_id: 3, size_name: 'Grande', price: 12.50 }
          ]
        },
        {
          product_id: 2,
          product_name: 'Diavola',
          description: 'Pomodoro, mozzarella, salame piccante',
          base_price: 9.50,
          image_url: '/images/pizzas/diavola.jpg',
          category_id: 2,
          is_vegetarian: false,
          is_spicy: true,
          avg_rating: 4.7,
          review_count: 203,
          sizes: [
            { size_id: 1, size_name: 'Piccola', price: 9.50 },
            { size_id: 2, size_name: 'Media', price: 12.50 },
            { size_id: 3, size_name: 'Grande', price: 14.50 }
          ]
        },
        {
          product_id: 3,
          product_name: 'Quattro Formaggi',
          description: 'Mozzarella, gorgonzola, parmigiano, fontina',
          base_price: 11.00,
          image_url: '/images/pizzas/quattro-formaggi.jpg',
          category_id: 2,
          is_vegetarian: true,
          avg_rating: 4.9,
          review_count: 178,
          sizes: [
            { size_id: 1, size_name: 'Piccola', price: 11.00 },
            { size_id: 2, size_name: 'Media', price: 14.00 },
            { size_id: 3, size_name: 'Grande', price: 16.00 }
          ]
        },
        {
          product_id: 4,
          product_name: 'Vegetariana',
          description: 'Pomodoro, mozzarella, melanzane, zucchine, peperoni',
          base_price: 9.50,
          image_url: '/images/pizzas/vegetariana.jpg',
          category_id: 2,
          is_vegetarian: true,
          avg_rating: 4.6,
          review_count: 142,
          sizes: [
            { size_id: 1, size_name: 'Piccola', price: 9.50 },
            { size_id: 2, size_name: 'Media', price: 12.50 },
            { size_id: 3, size_name: 'Grande', price: 14.50 }
          ]
        },
        {
          product_id: 5,
          product_name: 'Capricciosa',
          description: 'Pomodoro, mozzarella, prosciutto, funghi, carciofi, olive',
          base_price: 10.50,
          image_url: '/images/pizzas/capricciosa.jpg',
          category_id: 1,
          is_vegetarian: false,
          avg_rating: 4.8,
          review_count: 189,
          sizes: [
            { size_id: 1, size_name: 'Piccola', price: 10.50 },
            { size_id: 2, size_name: 'Media', price: 13.50 },
            { size_id: 3, size_name: 'Grande', price: 15.50 }
          ]
        },
        {
          product_id: 6,
          product_name: 'Bianca Bufala',
          description: 'Mozzarella di bufala, pomodorini, rucola, grana',
          base_price: 12.50,
          image_url: '/images/pizzas/bianca-bufala.jpg',
          category_id: 3,
          is_vegetarian: true,
          avg_rating: 5.0,
          review_count: 234,
          sizes: [
            { size_id: 1, size_name: 'Piccola', price: 12.50 },
            { size_id: 2, size_name: 'Media', price: 15.50 },
            { size_id: 3, size_name: 'Grande', price: 17.50 }
          ]
        }
      ];

      this.renderProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('Errore nel caricamento del menu', 'error');
    } finally {
      AppState.isLoading = false;
    }
  }

  static filterProducts(category) {
    AppState.currentCategory = category;
    this.renderProducts();
  }

  static renderProducts() {
    const menuGrid = document.getElementById('menuGrid');
    let filteredProducts = AppState.products;

    if (AppState.currentCategory !== 'all') {
      if (AppState.currentCategory === 'vegetarian') {
        filteredProducts = AppState.products.filter(p => p.is_vegetarian);
      } else {
        filteredProducts = AppState.products.filter(p => p.category_id == AppState.currentCategory);
      }
    }

    if (filteredProducts.length === 0) {
      menuGrid.innerHTML = '<p class="loading">Nessun prodotto trovato</p>';
      return;
    }

    menuGrid.innerHTML = filteredProducts.map(product => `
      <div class="menu-card" onclick="ProductManager.openProductModal(${product.product_id})">
        <div class="menu-card-image">
          <img src="${product.image_url}" alt="${product.product_name}" onerror="this.src='/images/pizza-placeholder.jpg'">
          <div class="menu-card-badges">
            ${product.is_vegetarian ? '<span class="badge badge-vegetarian">🌱 Vegetariana</span>' : ''}
            ${product.is_spicy ? '<span class="badge badge-spicy">🌶️ Piccante</span>' : ''}
            ${product.review_count > 200 ? '<span class="badge badge-popular">⭐ Popolare</span>' : ''}
          </div>
        </div>
        <div class="menu-card-content">
          <div class="menu-card-header">
            <h3 class="menu-card-title">${product.product_name}</h3>
            <span class="menu-card-price">€${product.base_price.toFixed(2)}</span>
          </div>
          <p class="menu-card-description">${product.description}</p>
          <div class="menu-card-footer">
            <div class="menu-card-rating">
              <span>⭐</span>
              <span>${product.avg_rating}</span>
              <span style="color: #7f8c8d;">(${product.review_count})</span>
            </div>
            <button class="menu-card-add" onclick="event.stopPropagation(); ProductManager.quickAdd(${product.product_id})">
              Aggiungi
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  static quickAdd(productId) {
    const product = AppState.products.find(p => p.product_id === productId);
    if (product && product.sizes && product.sizes.length > 0) {
      CartManager.addItem(productId, product.sizes[0].size_id, 1);
    }
  }

  static openProductModal(productId) {
    const product = AppState.products.find(p => p.product_id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const detail = document.getElementById('productDetail');

    detail.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
        <div>
          <img src="${product.image_url}" alt="${product.product_name}" style="width: 100%; border-radius: 12px;" onerror="this.src='/images/pizza-placeholder.jpg'">
        </div>
        <div>
          <h2 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem;">${product.product_name}</h2>
          <p style="color: #7f8c8d; margin-bottom: 1rem;">${product.description}</p>

          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.25rem; color: #f1c40f;">
              <span>⭐</span>
              <span style="font-weight: 600;">${product.avg_rating}</span>
              <span style="color: #7f8c8d;">(${product.review_count} recensioni)</span>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 0.5rem;">Scegli la dimensione:</h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${product.sizes.map((size, index) => `
                <button onclick="ProductManager.selectSize(${product.product_id}, ${size.size_id})"
                        id="size-${size.size_id}"
                        class="size-btn ${index === 0 ? 'active' : ''}"
                        style="padding: 0.75rem 1.5rem; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; transition: all 0.3s;">
                  <div style="font-weight: 600;">${size.size_name}</div>
                  <div style="color: var(--primary-color);">€${size.price.toFixed(2)}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button onclick="ProductManager.addToCartFromModal(${product.product_id})" class="btn btn-primary" style="flex: 1;">
              Aggiungi al Carrello
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  static selectedSize = null;

  static selectSize(productId, sizeId) {
    this.selectedSize = sizeId;
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.style.borderColor = '#e0e0e0';
      btn.style.background = 'white';
    });
    const btn = document.getElementById(`size-${sizeId}`);
    btn.style.borderColor = 'var(--primary-color)';
    btn.style.background = 'var(--accent-cream)';
  }

  static addToCartFromModal(productId) {
    const product = AppState.products.find(p => p.product_id === productId);
    const sizeId = this.selectedSize || (product.sizes && product.sizes[0].size_id);
    CartManager.addItem(productId, sizeId, 1);
    closeProductModal();
  }
}

// ============================================
// UI Functions
// ============================================
function showLoading() {
  const menuGrid = document.getElementById('menuGrid');
  menuGrid.innerHTML = '<div class="loading">Caricamento menu...</div>';
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function updateUI() {
  const userBtn = document.getElementById('userBtn');
  if (AuthManager.isAuthenticated()) {
    userBtn.textContent = '👤';
  } else {
    userBtn.textContent = '👤';
  }
}

function openCart() {
  CartManager.renderCartModal();
  document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function openUserModal() {
  const modal = document.getElementById('userModal');
  const userMenu = document.getElementById('userMenu');

  if (AuthManager.isAuthenticated()) {
    userMenu.innerHTML = `
      <div style="padding: 1rem;">
        <p style="margin-bottom: 1rem;">Benvenuto, ${AppState.user?.first_name || 'Utente'}!</p>
        <button onclick="viewOrders()" class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem;">I Miei Ordini</button>
        <button onclick="viewProfile()" class="btn btn-secondary" style="width: 100%; margin-bottom: 0.5rem;">Profilo</button>
        <button onclick="AuthManager.logout()" class="btn btn-secondary" style="width: 100%;">Logout</button>
      </div>
    `;
  } else {
    userMenu.innerHTML = `
      <div style="padding: 1rem;">
        <form onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="email" id="loginEmail" placeholder="Email" required>
          <input type="password" id="loginPassword" placeholder="Password" required>
          <button type="submit" class="btn btn-primary">Accedi</button>
        </form>
        <p style="text-align: center; margin: 1rem 0;">oppure</p>
        <button onclick="showRegisterForm()" class="btn btn-secondary" style="width: 100%;">Registrati</button>
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeUserModal() {
  document.getElementById('userModal').classList.remove('active');
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await AuthManager.login(email, password);
    closeUserModal();
    showNotification('Login effettuato con successo!', 'success');
    await CartManager.loadCart();
  } catch (error) {
    showNotification('Credenziali non valide', 'error');
  }
}

function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function openReservation() {
  document.getElementById('reservations').scrollIntoView({ behavior: 'smooth' });
}

async function checkDelivery() {
  const postalCode = document.getElementById('postalCodeInput').value;
  const resultDiv = document.getElementById('deliveryResult');

  if (!postalCode) {
    resultDiv.className = 'delivery-result error';
    resultDiv.textContent = 'Inserisci un CAP valido';
    return;
  }

  // Mock delivery check
  const validZones = ['37100', '37121', '37122', '37123', '37124', '37125', '37126', '37127', '37128', '37129', '37130', '37131'];

  if (validZones.includes(postalCode)) {
    resultDiv.className = 'delivery-result success';
    resultDiv.textContent = '✅ Consegniamo nella tua zona!';
  } else {
    resultDiv.className = 'delivery-result error';
    resultDiv.textContent = '❌ Spiacenti, non consegniamo ancora nella tua zona';
  }
}

function applyPromoCode() {
  const code = document.getElementById('promoCodeInput').value;
  if (code) {
    showNotification('Codice promozionale applicato!', 'success');
  }
}

function proceedToCheckout() {
  if (!AuthManager.isAuthenticated()) {
    closeCart();
    openUserModal();
    showNotification('Effettua il login per continuare', 'info');
  } else {
    showNotification('Procedendo al checkout...', 'info');
    // Would redirect to checkout page
  }
}

// ============================================
// Event Listeners
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Load initial data
  ProductManager.loadProducts();
  CartManager.loadCart();

  // Cart button
  document.getElementById('cartBtn').addEventListener('click', openCart);

  // User button
  document.getElementById('userBtn').addEventListener('click', openUserModal);

  // Category filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const category = e.target.dataset.category;
      ProductManager.filterProducts(category);
    });
  });

  // Reservation form
  document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      customer_name: document.getElementById('resName').value,
      customer_phone: document.getElementById('resPhone').value,
      customer_email: document.getElementById('resEmail').value,
      party_size: parseInt(document.getElementById('resGuests').value),
      reservation_date: document.getElementById('resDate').value,
      reservation_time: document.getElementById('resTime').value,
      special_requests: document.getElementById('resNotes').value
    };

    try {
      // await APIService.createReservation(formData);
      showNotification('Prenotazione effettuata con successo!', 'success');
      e.target.reset();
    } catch (error) {
      showNotification('Errore nella prenotazione', 'error');
    }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile menu toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  });
});

// ============================================
// Export for use in HTML
// ============================================
window.CartManager = CartManager;
window.ProductManager = ProductManager;
window.AuthManager = AuthManager;
window.openCart = openCart;
window.closeCart = closeCart;
window.closeProductModal = closeProductModal;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.handleLogin = handleLogin;
window.scrollToMenu = scrollToMenu;
window.openReservation = openReservation;
window.checkDelivery = checkDelivery;
window.applyPromoCode = applyPromoCode;
window.proceedToCheckout = proceedToCheckout;
