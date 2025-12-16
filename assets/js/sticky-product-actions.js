/**
 * Sticky CTA Module
 *
 * Shows a fixed bottom bar with product info and add-to-cart button
 * when user scrolls past the main add-to-cart section.
 *
 * Quantity handling is delegated to qty-input.js
 */
(function () {
  "use strict";

  const stickyCta = document.querySelector("[data-sticky-cta]");
  if (!stickyCta) return;

  // Elements
  const productActions = document.querySelector("[data-product-actions]");
  const mainAddToCartBtn = document.querySelector("[data-add-to-cart-form]");
  const stickyAddToCartBtn = document.querySelector("[data-sticky-cta-add-to-cart]");
  const stickyPriceEl = document.querySelector("[data-sticky-cta-price]");
  const stickyOptionsEl = document.querySelector("[data-sticky-cta-options]");
  const stickyImageEl = document.querySelector("[data-sticky-cta-image]");

  // Button state elements
  const btnDefault = document.querySelector("[data-sticky-cta-btn-default]");
  const btnLoading = document.querySelector("[data-sticky-cta-btn-loading]");
  const btnSuccess = document.querySelector("[data-sticky-cta-btn-success]");

  // Stock state elements
  const inStockSection = document.querySelector("[data-sticky-cta-in-stock]");
  const outOfStockSection = document.querySelector("[data-sticky-cta-out-of-stock]");

  let isVisible = false;
  let isAddingToCart = false;

  function show() {
    if (isVisible) return;
    isVisible = true;
    stickyCta.classList.remove("hidden");
    stickyCta.setAttribute("aria-hidden", "false");
  }

  function hide() {
    if (!isVisible) return;
    isVisible = false;
    stickyCta.setAttribute("aria-hidden", "true");
    stickyCta.classList.add("translate-y-full");
    setTimeout(() => {
      if (!isVisible) {
        stickyCta.classList.add("hidden");
        stickyCta.classList.remove("translate-y-full");
      }
    }, 300);
  }

  function setButtonState(state) {
    if (!btnDefault || !btnLoading || !btnSuccess) return;

    btnDefault.classList.toggle("hidden", state !== "default");
    btnDefault.classList.toggle("inline-flex", state === "default");
    btnLoading.classList.toggle("hidden", state !== "loading");
    btnLoading.classList.toggle("inline-flex", state === "loading");
    btnSuccess.classList.toggle("hidden", state !== "success");
    btnSuccess.classList.toggle("inline-flex", state === "success");

    if (stickyAddToCartBtn) stickyAddToCartBtn.disabled = state === "loading";
  }

  function handleAddToCart() {
    if (isAddingToCart) return;
    isAddingToCart = true;
    setButtonState("loading");
    if (mainAddToCartBtn) mainAddToCartBtn.click();
  }

  function handleCartUpdated() {
    if (!isAddingToCart) return;
    setButtonState("success");
    setTimeout(() => {
      setButtonState("default");
      isAddingToCart = false;
    }, 1500);
  }

  function handleCartError() {
    if (!isAddingToCart) return;
    setButtonState("default");
    isAddingToCart = false;
  }

  function updateStockState(inStock) {
    inStockSection?.classList.toggle("hidden", !inStock);
    outOfStockSection?.classList.toggle("hidden", inStock);
  }

  function handleVariantChange(event) {
    const selectedProduct = event.detail?.selectedProduct;

    if (!selectedProduct) {
      updateStockState(false);
      return;
    }

    updateStockState(selectedProduct.in_stock);

    if (stickyPriceEl) {
      stickyPriceEl.textContent = selectedProduct.formatted_sale_price || selectedProduct.formatted_price;
    }

    if (stickyOptionsEl && selectedProduct.attributes) {
      stickyOptionsEl.textContent = selectedProduct.attributes
        .map((a) => a.value)
        .filter(Boolean)
        .join(" • ");
    }

    if (stickyImageEl && selectedProduct.media?.[0]?.image) {
      const img = selectedProduct.media[0].image;
      if (img.thumbnail || img.medium) stickyImageEl.src = img.thumbnail || img.medium;
    }

    // Update max quantity via qty-input.js
    if (!selectedProduct.is_infinite && selectedProduct.in_stock && window.updateQtyMax) {
      const maxQty = Math.min(selectedProduct.quantity, 100);
      window.updateQtyMax("product-quantity", maxQty);
      window.updateQtyMax("sticky-qty", maxQty);
    }
  }

  function init() {
    // Intersection Observer for show/hide (observe parent that's always visible)
    if (productActions) {
      const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? hide() : show()), {
        threshold: 0
      });
      observer.observe(productActions);
    }

    // Add to cart
    stickyAddToCartBtn?.addEventListener("click", handleAddToCart);

    // Event listeners
    window.addEventListener("product:variant-changed", handleVariantChange);
    window.addEventListener("cart:updated", handleCartUpdated);
    window.addEventListener("cart:error", handleCartError);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
