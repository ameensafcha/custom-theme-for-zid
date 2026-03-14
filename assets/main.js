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
// 2. CART
// ============================================================

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

    const cart = await response.json();

    const products = cart?.products || [];
    const count    = cart?.products_count || products.length || 0;
    const totalStr = cart?.total?.value_string || '0 SAR';

    const badgeDesktop = document.getElementById('cart-badge-desktop');
    const badgeMobile  = document.getElementById('cart-badge-mobile');
    const priceDesktop = document.getElementById('cart-price-desktop');
    const priceMobile  = document.getElementById('cart-price-mobile');
    const subtotalEl   = document.getElementById('cart-subtotal');

    if (badgeDesktop) badgeDesktop.textContent = count;
    if (badgeMobile)  badgeMobile.textContent  = count;
    if (priceDesktop) priceDesktop.textContent = totalStr;
    if (priceMobile)  priceMobile.textContent  = totalStr;
    if (subtotalEl)   subtotalEl.textContent   = totalStr;

    if (badgeMobile && count > 0) {
      badgeMobile.classList.remove('hidden');
      badgeMobile.classList.add('flex');
    }

    if (!products.length) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center py-20">
          <svg class="w-14 h-14 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M10 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm7 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
          </svg>
          <p class="text-gray-400 font-medium text-sm">Your cart is empty</p>
          <a href="/products" class="mt-4 text-green-700 text-sm font-semibold hover:underline">
            Continue Shopping →
          </a>
        </div>`;
      return;
    }

    container.innerHTML = products.map(item => {

      const image = item.images?.[0]?.thumbs?.small
        || item.images?.[0]?.thumbs?.thumbnail
        || item.images?.[0]?.origin
        || 'https://placehold.co/80x80?text=?';

      const name          = item.name || '';
      const itemId        = item.id;
      const qty           = item.quantity || 1;
      const priceStr      = item.price_string || item.price + ' SAR' || '';
      const totalStr2     = item.total_string || item.total + ' SAR' || '';
      const originalPrice = item.price_before_string || null;

      return `
        <div class="flex items-center gap-3 py-4 border-b border-gray-100 last:border-0">

          <img src="${image}" alt="${name}"
            class="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-100"
            onerror="this.src='https://placehold.co/64x64?text=?'">

          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 leading-tight mb-1">${name}</p>
            <div class="flex items-center gap-3">
              <button onclick="updateCartItem(${itemId}, ${qty - 1}, this)" data-symbol="−"
                class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-base transition">
                −
              </button>
              <span class="text-sm font-semibold text-gray-800 w-4 text-center">${qty}</span>
              <button onclick="updateCartItem(${itemId}, ${qty + 1}, this)" data-symbol="+"
                class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-base transition">
                +
              </button>
            </div>
          </div>

          <div class="flex flex-col items-end justify-between gap-3 flex-shrink-0">
            <button onclick="removeCartItem(${itemId}, this)"
              class="text-gray-300 hover:text-red-400 transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
            <div class="text-right">
              <span class="text-sm font-bold text-gray-900">${totalStr2}</span>
              ${originalPrice ? `<span class="text-xs text-gray-400 line-through block">${originalPrice}</span>` : ''}
            </div>
          </div>

        </div>`;
    }).join('');

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

async function updateCartItem(itemId, newQty, btn = null) {
  if (newQty < 1) {
    await removeCartItem(itemId);
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>`;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('quantity', newQty);

    const response = await fetch(`/api/v1/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData.toString()
    });

    if (!response.ok) throw new Error('Status: ' + response.status);
    await loadCart();

  } catch (err) {
    console.error('[Cart] Update error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.symbol || '?';
    }
  }
}

async function removeCartItem(itemId, btn = null) {
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>`;
  }

  try {
    const response = await fetch(`/api/v1/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) throw new Error('Status: ' + response.status);
    await loadCart();

  } catch (err) {
    console.error('[Cart] Remove error:', err);
  }
}

// ============================================================
// CART PAGE — full page render
// ============================================================

async function loadCartPage() {
  const itemsContainer = document.getElementById('cart-page-items');
  const skeleton       = document.getElementById('cart-page-skeleton');
  if (!itemsContainer) return;

  try {
    const response = await fetch('/api/v1/cart', {
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    });
    if (!response.ok) throw new Error('Status: ' + response.status);

    const cart     = await response.json();
    const products = cart?.products || [];
    const total    = cart?.total?.value_string || '0 SAR';
    const subtotal = cart?.totals?.find(t => t.code === 'subtotal')?.value_string || total;

    // Summary update
    const subtotalEl = document.getElementById('cart-page-subtotal');
    const totalEl    = document.getElementById('cart-page-total');
    if (subtotalEl) subtotalEl.textContent = subtotal;
    if (totalEl)    totalEl.textContent    = total;

    if (skeleton) skeleton.remove();

    if (!products.length) {
      itemsContainer.innerHTML = `
        <div class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M10 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm7 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
          </svg>
          <p class="text-gray-400 font-medium mb-4">Your cart is empty</p>
          <a href="/products" class="inline-block bg-green-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-900 transition">
            Shop Now
          </a>
        </div>`;
      return;
    }

    itemsContainer.innerHTML = products.map(item => {

      const image = item.images?.[0]?.thumbs?.small
        || item.images?.[0]?.thumbs?.thumbnail
        || item.images?.[0]?.origin
        || 'https://placehold.co/80x80?text=?';

      const name      = item.name || '';
      const itemId    = item.id;
      const qty       = item.quantity || 1;
      const priceStr  = item.price_string || '';
      const totalStr  = item.total_string || '';

      return `
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 mb-4">

          <!-- Image -->
          <img src="${image}" alt="${name}"
            class="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100"
            onerror="this.src='https://placehold.co/80x80?text=?'">

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 text-sm mb-3">${name}</p>
            <div class="flex items-center gap-3">
              <button onclick="updateCartPageItem(${itemId}, ${qty - 1}, this)" data-symbol="−"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition">
                −
              </button>
              <span class="text-sm font-bold text-gray-800 w-5 text-center">${qty}</span>
              <button onclick="updateCartPageItem(${itemId}, ${qty + 1}, this)" data-symbol="+"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition">
                +
              </button>
            </div>
          </div>

          <!-- Price & Remove -->
          <div class="flex flex-col items-end gap-2 flex-shrink-0">
            <span class="font-bold text-gray-900">${totalStr}</span>
            <span class="text-xs text-gray-400">per item ${priceStr}</span>
            <button onclick="removeCartPageItem(${itemId}, this)"
              class="text-xs text-gray-400 hover:text-red-500 transition mt-1">
              Remove
            </button>
          </div>

        </div>`;
    }).join('');

  } catch (err) {
    console.error('[CartPage] Error:', err);
  }
}

async function updateCartPageItem(itemId, newQty, btn = null) {
  if (newQty < 1) { await removeCartPageItem(itemId); return; }
  if (btn) { btn.disabled = true; btn.innerHTML = `<svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>`; }
  try {
    const formData = new URLSearchParams();
    formData.append('quantity', newQty);
    const response = await fetch(`/api/v1/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: formData.toString()
    });
    if (!response.ok) throw new Error('Status: ' + response.status);
    await loadCartPage();
  } catch (err) {
    console.error('[CartPage] Update error:', err);
    if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.symbol || '?'; }
  }
}

async function removeCartPageItem(itemId, btn = null) {
  if (btn) { btn.disabled = true; btn.textContent = '...'; }
  try {
    const response = await fetch(`/api/v1/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    });
    if (!response.ok) throw new Error('Status: ' + response.status);
    await loadCartPage();
  } catch (err) {
    console.error('[CartPage] Remove error:', err);
  }
}

async function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const msg   = document.getElementById('coupon-msg');
  if (!input?.value.trim()) return;

  try {
    const formData = new URLSearchParams();
    formData.append('code', input.value.trim());
    const response = await fetch('/api/v1/cart/coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: formData.toString()
    });
    if (!response.ok) throw new Error('Invalid coupon');
    msg.textContent = '✓ Coupon applied!';
    msg.className = 'text-xs mt-1 text-green-600';
    msg.classList.remove('hidden');
    await loadCartPage();
  } catch (err) {
    msg.textContent = '✗ Invalid or expired coupon';
    msg.className = 'text-xs mt-1 text-red-500';
    msg.classList.remove('hidden');
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

async function applySidebarCoupon() {
  const input = document.getElementById('sidebar-coupon-input');
  const msg   = document.getElementById('sidebar-coupon-msg');
  if (!input?.value.trim()) return;

  const btn = input.nextElementSibling;
  if (btn) { btn.disabled = true; btn.textContent = '...'; }

  try {
    const response = await fetch(`/api/v1/cart/coupons?coupon_code=${encodeURIComponent(input.value.trim())}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) throw new Error('Invalid');

    msg.textContent = '✓ Coupon applied!';
    msg.className = 'text-xs mt-1 text-green-600';
    msg.classList.remove('hidden');
    input.value = '';
    await loadCart();

  } catch (err) {
    msg.textContent = '✗ Invalid or expired coupon';
    msg.className = 'text-xs mt-1 text-red-500';
    msg.classList.remove('hidden');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Apply'; }
  }
}


// ============================================================
// 3. ADD TO CART
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
      btn.classList.replace('bg-green-800', 'bg-gray-800');
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Add To Cart';
        btn.classList.replace('bg-gray-800', 'bg-green-800');
      }, 2000);
    }

  } catch (err) {
    console.error('[Cart] Add error:', err);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Failed — Retry';
      btn.classList.replace('bg-green-800', 'bg-red-500');
      setTimeout(() => {
        btn.textContent = 'Add To Cart';
        btn.classList.replace('bg-red-500', 'bg-green-800');
      }, 2000);
    }
  }
}


// ============================================================
// 4. PRODUCTS
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

      const price     = product.formatted_price || '';
      const salePrice = product.formatted_sale_price || null;
      const discount  = product.discount_percentage || 0;

      const discountBadge = discount > 0
        ? `<span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded z-10">-${discount}%</span>`
        : '';

      const bestSeller = (product.is_best_seller || product.best_seller)
        ? `<span class="absolute top-3 left-3 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded z-10">BEST SELLER</span>`
        : '';

      const img1 = product.images?.[0]?.image?.medium
        || product.images?.[0]?.image?.full_size
        || 'https://placehold.co/400x500?text=No+Image';

      const img2 = product.images?.[1]?.image?.medium
        || product.images?.[1]?.image?.full_size
        || img1;

      const name = product.name || '';
      const slug = product.slug || product.id || '';
      const id   = product.id || '';

      // ✅ short_description — HTML tags strip karo
      const rawDesc = product.short_description || product.description?.short || product.subtitle || '';
      const desc    = rawDesc.replace(/<[^>]*>/g, '').trim();

      return `
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col">
          <a href="/p/${slug}" class="block relative overflow-hidden bg-gray-50 product-img-wrap" style="height: 420px; min-height: 420px;">
            <img src="${img1}" alt="${name}" class="img-primary w-full h-full object-cover">
            <img src="${img2}" alt="${name}" class="img-secondary w-full h-full object-cover">
            ${discountBadge}
            ${bestSeller}
            ${!product.in_stock
              ? `<div class="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                   <span class="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded">Out of Stock</span>
                 </div>`
              : ''}
          </a>
          <div class="p-5 flex flex-col flex-1">
            <div class="mb-1 flex items-center gap-2">
              ${salePrice
                ? `<span class="text-gray-900 font-bold text-sm">${salePrice}</span>
                   <span class="text-gray-400 line-through text-xs">${price}</span>`
                : `<span class="text-gray-900 font-bold text-sm">${price}</span>`
              }
            </div>
            <a href="/p/${slug}" class="text-lg font-bold text-gray-900 hover:text-green-700 transition leading-tight mb-1">
              ${name}
            </a>
            ${desc
              ? `<p class="text-sm text-gray-400 mb-4 line-clamp-2">${desc}</p>`
              : `<div class="flex-1 mb-4"></div>`
            }
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
  loadProducts();
  loadCartPage();
  initSearch();
  initMobileMenu();
  initNavScroll();

  document.getElementById('cart-trigger')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  console.log('[Theme] Ready ✓');
});