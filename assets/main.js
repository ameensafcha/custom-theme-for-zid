// ============================================================
// ZID VITRIN THEME — main.js
// ============================================================
// SECTIONS:
//  1. CATEGORIES
//  2. CART
//  3. SEARCH
//  4. MOBILE MENU
//  5. NAV SCROLL
//  6. INIT (DOMContentLoaded)
// ============================================================


// ============================================================
// 1. CATEGORIES
// ============================================================

async function loadCategories() {
  const navContainer = document.getElementById('nav-categories');
  const mobileContainer = document.getElementById('mobile-categories');

  try {
    const response = await fetch('/api/v1/categories', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) throw new Error('Status: ' + response.status);

    const result = await response.json();
    let cats = result?.categories || result?.data?.categories || result?.data || result || [];
    if (!Array.isArray(cats)) cats = [];

    if (!cats.length) {
      if (navContainer) navContainer.innerHTML = `<span class="text-xs text-red-300">No categories found</span>`;
      return;
    }

    if (navContainer) {
      navContainer.innerHTML = cats.map(cat => `
        <a href="/category/${cat.slug}"
          class="text-sm md:text-lg font-medium whitespace-nowrap text-white hover:opacity-80">
          ${cat.name}
        </a>`).join('');
    }

    if (mobileContainer) {
      mobileContainer.innerHTML = cats.map(cat => `
        <a href="/category/${cat.slug}"
          class="block py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 border-b border-gray-100">
          ${cat.name}
        </a>`).join('');
    }

  } catch (err) {
    console.error('[Categories] Error:', err);
    if (navContainer) navContainer.innerHTML = `<span class="text-xs text-red-300">⚠ Failed to load</span>`;
    if (mobileContainer) mobileContainer.innerHTML = `<div class="text-red-500 text-sm py-2">⚠ Failed to load categories</div>`;
  }
}


// ============================================================
// 2. CART
// ============================================================

async function addToCart(productId, quantity = 1) {
  try {
    const response = await fetch('/api/v1/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ product_id: productId, quantity: quantity })
    });

    if (!response.ok) throw new Error('Status: ' + response.status);

    await loadCart();
    openCart();

  } catch (err) {
    console.error('[Cart] Add error:', err);
    alert('Failed to add to cart');
  }
}

async function loadCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  try {
    const response = await fetch('/api/v1/cart', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) throw new Error('Status: ' + response.status);

    const result = await response.json();
    const cart = result?.cart || result?.data?.cart || result?.data || null;

    if (!cart) {
      container.innerHTML = '<p class="text-center text-gray-400 text-sm mt-10">Your cart is empty</p>';
      return;
    }

    const products = cart.products || cart.items || [];
    const count    = products.length || 0;
    const total    = cart.total || cart.subtotal || '0';

    // Badges & prices update
    const badgeDesktop = document.getElementById('cart-badge-desktop');
    const badgeMobile  = document.getElementById('cart-badge-mobile');
    const priceDesktop = document.getElementById('cart-price-desktop');
    const priceMobile  = document.getElementById('cart-price-mobile');
    const subtotalEl   = document.getElementById('cart-subtotal');

    if (badgeDesktop) badgeDesktop.textContent = count;
    if (badgeMobile)  badgeMobile.textContent  = count;
    if (priceDesktop) priceDesktop.textContent  = total + ' SAR';
    if (priceMobile)  priceMobile.textContent   = total + ' SAR';
    if (subtotalEl)   subtotalEl.textContent    = total + ' SAR';

    if (badgeMobile && count > 0) {
      badgeMobile.classList.remove('hidden');
      badgeMobile.classList.add('flex');
    }

    if (!products.length) {
      container.innerHTML = '<p class="text-center text-gray-400 text-sm mt-10">Your cart is empty</p>';
      return;
    }

    container.innerHTML = products.map(item => `
      <div class="flex gap-3 pb-4 mb-4 border-b border-gray-100 last:border-0">
        <img
          src="${item.product?.images?.[0]?.url || item.image || ''}"
          alt="${item.product?.name || item.name || ''}"
          class="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800">${item.product?.name || item.name || ''}</p>
          <span class="text-green-600 font-bold text-sm mt-1 block">
            ${item.price?.formatted || item.price || ''} SAR
          </span>
          <div class="flex items-center gap-2 mt-2">
            <button class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-base">−</button>
            <span class="text-sm font-semibold w-5 text-center">${item.quantity || 1}</span>
            <button class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-base">+</button>
          </div>
        </div>
      </div>`).join('');

  } catch (err) {
    console.error('[Cart] Error:', err);
    const c = document.getElementById('cart-items-container');
    if (c) c.innerHTML = `
      <div class="flex flex-col items-center mt-16 gap-3 text-center px-4">
        <p class="text-red-500 font-semibold text-sm">⚠ Failed to load cart</p>
        <button onclick="loadCart()"
          class="px-4 py-2 bg-green-700 text-white text-xs rounded-full hover:bg-green-800 transition">
          Try Again
        </button>
      </div>`;
  }
}

function openCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.style.transform = 'translateX(0)';
  if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all'; }
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.style.transform = 'translateX(100%)';
  if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
  document.body.style.overflow = '';
}


// ============================================================
// 3. SEARCH
// ============================================================

function initSearch() {
  const searchInput    = document.getElementById('search-input');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchContainer = document.getElementById('search-container');

  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener('input', function () {
    if (this.value.trim()) {
      searchDropdown.classList.remove('hidden');
      searchDropdown.innerHTML = `
        <p class="text-gray-500 text-sm">
          Searching for "<strong>${this.value}</strong>"...
        </p>`;
    } else {
      searchDropdown.classList.add('hidden');
    }
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && this.value.trim()) {
      window.location.href = '/products?search=' + encodeURIComponent(this.value.trim());
    }
  });

  document.addEventListener('mousedown', function (e) {
    if (searchContainer && !searchContainer.contains(e.target)) {
      searchDropdown.classList.add('hidden');
    }
  });
}


// ============================================================
// 4. MOBILE MENU
// ============================================================

function openMobileMenu() {
  document.getElementById('mobile-menu')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  document.getElementById('mobile-menu')?.classList.add('hidden');
  document.body.style.overflow = '';
}

function initMobileMenu() {
  document.getElementById('mobile-toggle')?.addEventListener('click', openMobileMenu);
  document.getElementById('mobile-close')?.addEventListener('click', closeMobileMenu);
  document.getElementById('mobile-menu')?.addEventListener('click', function (e) {
    if (e.target === this) closeMobileMenu();
  });
}


// ============================================================
// 5. NAV SCROLL
// ============================================================

function initNavScroll() {
  const navLinks = document.getElementById('nav-links');
  document.getElementById('scroll-left')?.addEventListener('click', () =>
    navLinks?.scrollBy({ left: -200, behavior: 'smooth' }));
  document.getElementById('scroll-right')?.addEventListener('click', () =>
    navLinks?.scrollBy({ left: 200, behavior: 'smooth' }));
}


// ============================================================
// 6. INIT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  console.log('[Theme] Initializing...');

  loadCategories();
  loadCart();
  initSearch();
  initMobileMenu();
  initNavScroll();

  // Cart sidebar events
  document.getElementById('cart-trigger')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  console.log('[Theme] Ready ✓');
});