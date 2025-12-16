/**
 * Quantity Input Module
 *
 * Handles all quantity inputs with +/- buttons.
 * Supports syncing between multiple inputs (e.g., product page + sticky CTA).
 *
 * Data attributes:
 *   - data-qty-input="<id>"     : Wrapper element with input ID
 *   - data-qty-sync="<id>"      : ID of another input to sync with
 *   - data-qty-action="increase|decrease|remove" : Button actions
 *   - data-qty-value            : The input element
 *
 * Events:
 *   - qty:change : Dispatched on input when value changes (detail: { id, value, source })
 *   - qty:remove : Dispatched on wrapper when remove is clicked
 */
(function () {
  "use strict";

  // Track initialized wrappers to avoid double-init
  const initializedWrappers = new WeakSet();

  // Handle quantity change
  function updateQuantity(wrapper, delta) {
    const input = wrapper.querySelector("[data-qty-value]");
    if (!input) return;

    const current = parseInt(input.value) || 1;
    const min = parseInt(input.min) || 1;
    const max = input.max ? parseInt(input.max) : Infinity;

    const newValue = Math.max(min, Math.min(max, current + delta));

    if (newValue !== current) {
      input.value = newValue;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      dispatchQtyChange(wrapper, newValue);
    }
  }

  // Dispatch custom qty:change event
  function dispatchQtyChange(wrapper, value) {
    const id = wrapper.dataset.qtyInput;
    wrapper.dispatchEvent(
      new CustomEvent("qty:change", {
        bubbles: true,
        detail: { id, value }
      })
    );
  }

  // Sync with target input
  function syncWithTarget(wrapper, value) {
    const targetId = wrapper.dataset.qtySync;
    if (!targetId) return;

    const targetWrapper = document.querySelector(`[data-qty-input="${targetId}"]`);
    if (!targetWrapper) return;

    const targetInput = targetWrapper.querySelector("[data-qty-value]");
    if (targetInput && parseInt(targetInput.value) !== value) {
      targetInput.value = value;
      // Don't dispatch change to avoid infinite loop - just update value
    }
  }

  // Update delete/minus button visibility
  function updateButtonVisibility(wrapper, value) {
    const deleteBtn = wrapper.querySelector('[data-qty-action="remove"]');
    const decreaseBtn = wrapper.querySelector('[data-qty-action="decrease"]');

    if (deleteBtn && decreaseBtn) {
      // Has delete button - toggle visibility
      deleteBtn.classList.toggle("hidden", value > 1);
      decreaseBtn.classList.toggle("hidden", value <= 1);
    }
  }

  // Handle input change/input events
  function handleInputChange(wrapper, input) {
    const value = parseInt(input.value) || 1;
    const min = parseInt(input.min) || 1;
    const max = input.max ? parseInt(input.max) : Infinity;

    // Clamp value
    const clampedValue = Math.max(min, Math.min(max, value));
    if (clampedValue !== value) {
      input.value = clampedValue;
    }

    updateButtonVisibility(wrapper, clampedValue);
    syncWithTarget(wrapper, clampedValue);
    dispatchQtyChange(wrapper, clampedValue);
  }

  // Initialize a single quantity input wrapper
  function initWrapper(wrapper) {
    if (initializedWrappers.has(wrapper)) return;
    initializedWrappers.add(wrapper);

    const input = wrapper.querySelector("[data-qty-value]");
    const buttons = wrapper.querySelectorAll("[data-qty-action]");

    // Attach click handlers to buttons
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.qtyAction;

        if (action === "increase") {
          updateQuantity(wrapper, 1);
        } else if (action === "decrease") {
          updateQuantity(wrapper, -1);
        } else if (action === "remove") {
          wrapper.dispatchEvent(new CustomEvent("qty:remove", { bubbles: true }));
        }
      });
    });

    // Attach change/input handlers to input
    if (input) {
      input.addEventListener("change", () => handleInputChange(wrapper, input));
      input.addEventListener("input", () => handleInputChange(wrapper, input));
    }
  }

  // Initialize all quantity inputs on page
  function initAll() {
    document.querySelectorAll("[data-qty-input]").forEach(initWrapper);
  }

  // Update max value for an input (called on variant change)
  window.updateQtyMax = function (inputId, maxValue) {
    const wrapper = document.querySelector(`[data-qty-input="${inputId}"]`);
    if (!wrapper) return;

    const input = wrapper.querySelector("[data-qty-value]");
    if (!input) return;

    input.max = maxValue;

    // Clamp current value if needed
    const current = parseInt(input.value) || 1;
    if (current > maxValue) {
      input.value = maxValue;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  // Expose init for dynamically added inputs
  window.initQtyInputs = initAll;

  // Initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Re-init when products are updated (AJAX filtering, quick view, etc.)
  window.addEventListener("products-updated", initAll);
  window.addEventListener("quick-view-content-loaded", initAll);
})();
