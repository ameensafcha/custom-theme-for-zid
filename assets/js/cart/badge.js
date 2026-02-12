/**
 * Cart Badge Module
 *
 * Updates cart badge in header - real-time on both mobile and desktop.
 * Desktop pill: "price (count)" or "0"
 * Mobile: total quantity on badge (top of icon), price below
 * Quantity = sum of all product quantities in cart
 * Count > 9 shows "9+"
 */

/**
 * Update all cart badges on the page
 * @param {Object} cart - Optional cart data (if not provided, will fetch)
 */
export async function refreshBadge(cart) {
  try {
    if (!window.zid) return;

    // Always fetch fresh cart data to ensure we have totals + products
    let cartData;
    try {
      cartData = await window.zid.cart.get();
    } catch (e) {
      cartData = cart;
    }

    if (!cartData) return;

    // Calculate total quantity (sum of all product quantities)
    let totalQuantity = 0;

    // Try products array first (has individual quantities)
    if (cartData.products && cartData.products.length > 0) {
      for (let i = 0; i < cartData.products.length; i++) {
        totalQuantity += (cartData.products[i].quantity || 1);
      }
    }

    // Fallback: try cart_items array
    if (totalQuantity === 0 && cartData.cart_items && cartData.cart_items.length > 0) {
      for (let i = 0; i < cartData.cart_items.length; i++) {
        totalQuantity += (cartData.cart_items[i].quantity || 1);
      }
    }

    // Fallback: use API count fields
    if (totalQuantity === 0) {
      totalQuantity = cartData.cart_items_quantity || cartData.products_count || cartData.items_count || 0;
    }

    // Get formatted total price from totals array
    let formattedPrice = "";
    let rawPrice = 0;

    if (cartData.totals && cartData.totals.length > 0) {
      for (let i = 0; i < cartData.totals.length; i++) {
        if (cartData.totals[i].code === "total") {
          formattedPrice = cartData.totals[i].value_string || "";
          rawPrice = cartData.totals[i].value || 0;
          break;
        }
      }
    }

    // Fallback: try sub_total or total_price
    if (!formattedPrice && cartData.sub_total) {
      formattedPrice = cartData.sub_total.formatted || cartData.sub_total.value_string || "";
      rawPrice = cartData.sub_total.amount || cartData.sub_total.value || 0;
    }
    if (!formattedPrice && cartData.total_price) {
      formattedPrice = String(cartData.total_price);
      rawPrice = Number(cartData.total_price) || 0;
    }

    // Format quantity display: 9+ for > 9
    var qtyDisplay = totalQuantity > 9 ? "9+" : String(totalQuantity);

    // Desktop pill text: "price (count)" or "0"
    var pillText;
    if (totalQuantity === 0) {
      pillText = "0";
    } else if (formattedPrice) {
      pillText = formattedPrice + " (" + qtyDisplay + ")";
    } else {
      pillText = qtyDisplay;
    }

    // Mobile price text: plain price
    var mobilePriceText;
    if (totalQuantity === 0) {
      mobilePriceText = "0.00";
    } else if (formattedPrice) {
      mobilePriceText = formattedPrice;
    } else if (rawPrice > 0) {
      mobilePriceText = rawPrice.toFixed(2);
    } else {
      mobilePriceText = "0.00";
    }

    // ===== Update ALL DOM elements =====

    // Desktop pill badge text (price + count)
    var pillEls = document.querySelectorAll("[data-cart-badge-text]");
    for (var i = 0; i < pillEls.length; i++) {
      pillEls[i].textContent = pillText;
    }

    // Mobile badge count (on top of cart icon)
    var badgeEls = document.querySelectorAll("[data-cart-badge]");
    for (var i = 0; i < badgeEls.length; i++) {
      badgeEls[i].textContent = qtyDisplay;
      badgeEls[i].hidden = totalQuantity === 0;
    }

    // Mobile price below icon
    var priceEls = document.querySelectorAll("[data-cart-badge-price]");
    for (var i = 0; i < priceEls.length; i++) {
      priceEls[i].textContent = mobilePriceText;
    }
  } catch (err) {
    console.error("[Cart] Refresh badge failed:", err);
  }
}

// Expose globally so controller.js and refresh.js can call window.cartManager.refreshBadge()
window.cartManager = { refreshBadge };
