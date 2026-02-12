/**
 * Categories Scroll
 *
 * Handles horizontal scroll navigation for the header categories bar.
 * Adds left/right arrow button functionality on desktop.
 * On mobile/tablet, native touch-scroll is used (arrows hidden via CSS).
 *
 * Supports RTL: scroll directions are automatically reversed.
 */

const SCROLL_AMOUNT = 200;

function initCategoriesScroll() {
    const container = document.querySelector("[data-categories-scroll]");
    if (!container) return;

    const leftBtn = document.querySelector("[data-scroll-left]");
    const rightBtn = document.querySelector("[data-scroll-right]");

    if (!leftBtn || !rightBtn) return;

    const isRtl = document.documentElement.dir === "rtl";

    function updateArrows() {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const atStart = Math.abs(scrollLeft) < 2;
        const atEnd = Math.abs(scrollLeft) + clientWidth >= scrollWidth - 2;

        leftBtn.disabled = atStart;
        rightBtn.disabled = atEnd;
    }

    leftBtn.addEventListener("click", () => {
        const direction = isRtl ? 1 : -1;
        container.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
        const direction = isRtl ? -1 : 1;
        container.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
    });

    container.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    // Initial state
    updateArrows();
}

// Initialize
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCategoriesScroll);
} else {
    initCategoriesScroll();
}

export { initCategoriesScroll };
