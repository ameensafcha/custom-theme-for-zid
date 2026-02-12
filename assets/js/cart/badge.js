/**
 * Cart Badge Module
 *
 * Updates cart count badge in header/nav.
 * Shows price + count format: "£18.90 (2)" or "9+" for items > 9
 * Shows "0" when cart is empty.
 */

/**
 * Update all cart badges on the page
 * @param {Object} cart - Optional cart data (if not provided, will fetch)
 */
export async function refreshBadge(cart) {
  try {
    if (!window.zid) return;

    // Use provided cart data or fetch if not provided
    const cartData = cart || (await window.zid.cart.get());
    const count = cartData?.cart_items_quantity ?? cartData?.products_count ?? 0;

    // Get formatted total price from totals array
    let formattedPrice = "";
    if (cartData?.totals && cartData.totals.length > 0) {
      const totalEntry = cartData.totals.find((t) => t.code === "total");
      if (totalEntry) {
        formattedPrice = totalEntry.value_string || "";
      }
    }

    // Format count display: 9+ for > 9, otherwise show number
    const countDisplay = count > 9 ? "9+" : String(count);

    // Build badge text: "price (count)" or "0" when empty
    let badgeText;
    if (count === 0) {
      badgeText = "0";
    } else if (formattedPrice) {
      badgeText = formattedPrice + " (" + countDisplay + ")";
    } else {
      badgeText = countDisplay;
    }

    // Update all badge elements with old data-cart-badge attribute (count only)
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      el.textContent = countDisplay;
      el.hidden = count === 0;
    });

    // Update the header pill button badge text (price + count)
    document.querySelectorAll("[data-cart-badge-text]").forEach((el) => {
      el.textContent = badgeText;
    });
  } catch (err) {
    console.error("[Cart] Refresh badge failed:", err);
  }
}
