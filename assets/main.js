// ============================================================
// ZID VITRIN THEME — main.js
// ============================================================
// SECTIONS:
//  1. CATEGORIES
//  2. CART
//  3. ADD TO CART
//  4. PRODUCTS
//  5. SEARCH
//  6. MOBILE MENU
//  7. NAV SCROLL
//  8. INIT
// ============================================================


// ============================================================
// 1. CATEGORIES
// ============================================================

async function loadCategories() {
  const navContainer = document.getElementById('nav-categories');
  const mobileContainer = document.getElementById('mobile-categories');

  try {
    const response = await fetch('/api/v1/categories', {
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
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
// 2. CART — load & open/close
// ============================================================

async function loadCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  try {
    const response = await fetch('/api/v1/cart', {
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
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

    const badgeDesktop = document.getElementById('cart-badge-desktop');
    const badgeMobile  = document.getElementById('cart-badge-mobile');
    const priceDesktop = document.getElementById('cart-price-desktop');
    const priceMobile  = document.getElementById('cart-price-mobile');
    const subtotalEl   = document.getElementById('cart-subtotal');

    if (badgeDesktop) badgeDesktop.textContent = count;
    if (badgeMobile)  badgeMobile.textContent  = count;
    if (priceDesktop) priceDesktop.textContent = total + ' SAR';
    if (priceMobile)  priceMobile.textContent  = total + ' SAR';
    if (subtotalEl)   subtotalEl.textContent   = total + ' SAR';

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
// 3. ADD TO CART — ek hi jagah defined
// ============================================================

async function addToCart(productId, quantity = 1, btn = null) {
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Adding...';
  }

  try {
    const response = await fetch('/api/v1/cart/items', {
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

    if (btn) {
      btn.textContent = 'Added! ✓';
      btn.classList.replace('bg-green-700', 'bg-gray-800');
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Add To Cart';
        btn.classList.replace('bg-gray-800', 'bg-green-700');
      }, 2000);
    }

  } catch (err) {
    console.error('[Cart] Add error:', err);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Failed — Retry';
      btn.classList.replace('bg-green-700', 'bg-red-500');
      setTimeout(() => {
        btn.textContent = 'Add To Cart';
        btn.classList.replace('bg-red-500', 'bg-green-700');
      }, 2000);
    }
  }
}


// ============================================================
// 4. PRODUCTS — fetch & render
// ============================================================

async function loadProducts() {
  const skeleton = document.getElementById('products-skeleton');
  const grid     = document.getElementById('products-grid');
  const errorEl  = document.getElementById('products-error');

  if (!grid) return;

  try {
    const response = await fetch('/api/v1/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) throw new Error('Status: ' + response.status);

    const result = await response.json();
    let products = result?.results || [];
    if (!Array.isArray(products)) products = [];

    if (skeleton) skeleton.classList.add('hidden');

    if (!products.length) {
      grid.classList.remove('hidden');
      grid.innerHTML = `<p class="col-span-4 text-center text-gray-400 py-20">No products found</p>`;
      return;
    }

    grid.classList.remove('hidden');
    grid.innerHTML = products.map(product => {

      // Price
      const price     = product.formatted_price || '';
      const salePrice = product.formatted_sale_price || null;
      const discount  = product.discount_percentage || 0;

      // Badges
      const discountBadge = discount > 0
        ? `<span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded z-10">-${discount}%</span>`
        : '';

      const bestSeller = (product.is_best_seller || product.best_seller)
        ? `<span class="absolute top-3 left-3 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded z-10">BEST SELLER</span>`
        : '';

      // Images — primary & secondary (hover)
      const img1 = product.images?.[0]?.image?.medium
        || product.images?.[0]?.image?.full_size
        || 'https://placehold.co/400x500?text=No+Image';

      const img2 = product.images?.[1]?.image?.medium
        || product.images?.[1]?.image?.full_size
        || img1; // agar second image nahi toh same image

      const name = product.name || '';
      const slug = product.slug || product.id || '';
      const id   = product.id || '';
      const desc = product.description?.short || product.short_description || product.subtitle || '';

      return `
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col">

          <!-- Image with hover effect -->

            <a href="/p/${slug}" class="block relative overflow-hidden bg-gray-50 product-img-wrap" style="height: 420px; min-height: 420px;">
            <img
              src="${img1}"
              alt="${name}"
              class="img-primary w-full h-full object-cover"
            >
            <img
              src="${img2}"
              alt="${name}"
              class="img-secondary w-full h-full object-cover"
            >
            ${discountBadge}
            ${bestSeller}
            ${!product.in_stock
              ? `<div class="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                   <span class="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded">Out of Stock</span>
                 </div>`
              : ''}
          </a>

          <!-- Info -->
          <div class="p-5 flex flex-col flex-1">

            <!-- Price -->
            <div class="mb-1 flex items-center gap-2">
              ${salePrice
                ? `<span class="text-gray-900 font-bold text-sm">${salePrice}</span>
                   <span class="text-gray-400 line-through text-xs">${price}</span>`
                : `<span class="text-gray-900 font-bold text-sm">${price}</span>`
              }
            </div>

            <!-- Name -->
            <a href="/p/${slug}"
              class="text-lg font-bold text-gray-900 hover:text-green-700 transition leading-tight mb-1">
              ${name}
            </a>

            <!-- Desc -->
            ${desc
              ? `<p class="text-sm text-gray-400 mb-4 line-clamp-2">${desc}</p>`
              : `<div class="flex-1 mb-4"></div>`
            }

            <!-- Add to Cart -->
            <button
              onclick="addToCart('${id}', 1, this)"
              ${!product.in_stock ? 'disabled' : ''}
              class="w-full ${product.in_stock
                ? 'bg-green-800 hover:bg-green-900'
                : 'bg-gray-300 cursor-not-allowed'} text-white font-semibold py-3.5 rounded-full transition text-sm tracking-wider">
              ${product.in_stock ? 'Add To Cart' : 'Out of Stock'}
            </button>

          </div>
        </div>`;

    }).join('');

  } catch (err) {
    console.error('[Products] Error:', err);
    if (skeleton) skeleton.classList.add('hidden');
    if (errorEl)  errorEl.classList.remove('hidden');
  }
}


// ============================================================
// 5. SEARCH
// ============================================================

function initSearch() {
  const searchInput     = document.getElementById('search-input');
  const searchDropdown  = document.getElementById('search-dropdown');
  const searchContainer = document.getElementById('search-container');

  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener('input', function () {
    if (this.value.trim()) {
      searchDropdown.classList.remove('hidden');
      searchDropdown.innerHTML = `<p class="text-gray-500 text-sm">Searching for "<strong>${this.value}</strong>"...</p>`;
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
// 6. MOBILE MENU
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
// 7. NAV SCROLL
// ============================================================

function initNavScroll() {
  const navLinks = document.getElementById('nav-links');
  document.getElementById('scroll-left')?.addEventListener('click', () =>
    navLinks?.scrollBy({ left: -200, behavior: 'smooth' }));
  document.getElementById('scroll-right')?.addEventListener('click', () =>
    navLinks?.scrollBy({ left: 200, behavior: 'smooth' }));
}


// ============================================================
// 8. INIT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  console.log('[Theme] Initializing...');

  loadCategories();
  loadCart();
  loadProducts();     // ✅ yahan call ho raha hai
  initSearch();
  initMobileMenu();
  initNavScroll();

  document.getElementById('cart-trigger')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  console.log('[Theme] Ready ✓');
});