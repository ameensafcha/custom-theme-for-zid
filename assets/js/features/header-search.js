/**
 * Header Search Module
 *
 * Provides live search results directly in the header search bar.
 * Shows product suggestions as the user types, with debounced API calls.
 */

class HeaderSearch {
    constructor() {
        this.container = null;
        this.form = null;
        this.input = null;
        this.clearBtn = null;
        this.dropdown = null;
        this.loadingEl = null;
        this.resultsEl = null;
        this.productsEl = null;
        this.emptyEl = null;
        this.viewAllLink = null;

        this.debounceTimeout = null;
        this.debounceDelay = 300;
        this.minQueryLength = 2;
        this.maxResults = 6;
    }

    init() {
        this.container = document.querySelector("[data-header-search]");
        if (!this.container) return;

        this.form = this.container.querySelector("[data-header-search-form]");
        this.input = this.container.querySelector("[data-header-search-input]");
        this.clearBtn = this.container.querySelector("[data-header-search-clear]");
        this.dropdown = this.container.querySelector("[data-header-search-dropdown]");
        this.loadingEl = this.container.querySelector("[data-header-search-loading]");
        this.resultsEl = this.container.querySelector("[data-header-search-results]");
        this.productsEl = this.container.querySelector("[data-header-search-products]");
        this.emptyEl = this.container.querySelector("[data-header-search-empty]");
        this.viewAllLink = this.container.querySelector("[data-header-search-all]");

        if (!this.input) return;

        this.bindEvents();
    }

    bindEvents() {
        // Live search on input
        this.input.addEventListener("input", () => this.handleInput());

        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearInput();
                this.input.focus();
            });
        }

        // Form submit — navigate to search page
        if (this.form) {
            this.form.addEventListener("submit", (e) => {
                const query = this.input.value.trim();
                if (query.length < this.minQueryLength) {
                    e.preventDefault();
                    return;
                }
                // Allow default form submit to /products?q=...
                this.hideDropdown();
            });
        }

        // Close dropdown on click outside
        document.addEventListener("click", (e) => {
            if (this.container && !this.container.contains(e.target)) {
                this.hideDropdown();
            }
        });

        // Close on Escape
        this.input.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.hideDropdown();
                this.input.blur();
            }
        });

        // Re-show dropdown on focus if there's a query
        this.input.addEventListener("focus", () => {
            const query = this.input.value.trim();
            if (query.length >= this.minQueryLength && this.productsEl && this.productsEl.innerHTML.trim()) {
                this.showDropdown();
                this.showState("results");
            }
        });
    }

    handleInput() {
        const query = this.input.value.trim();

        // Toggle clear button
        if (this.clearBtn) {
            this.clearBtn.classList.toggle("hidden", query.length === 0);
            if (query.length > 0) {
                this.clearBtn.classList.add("flex");
            } else {
                this.clearBtn.classList.remove("flex");
            }
        }

        // Update "View all" link
        this.updateViewAllLink(query);

        clearTimeout(this.debounceTimeout);

        if (query.length < this.minQueryLength) {
            this.hideDropdown();
            return;
        }

        this.debounceTimeout = setTimeout(() => {
            this.search(query);
        }, this.debounceDelay);
    }

    async search(query) {
        this.showDropdown();
        this.showState("loading");

        try {
            const response = await zid.products.list(
                { page_size: this.maxResults, q: query },
                { showErrorNotification: false }
            );

            if (response && response.results && response.results.length > 0) {
                this.renderResults(response.results);
                this.showState("results");
            } else {
                this.showState("empty");
            }
        } catch (error) {
            this.showState("empty");
        }
    }

    renderResults(products) {
        if (!this.productsEl) return;

        const lang = document.documentElement.lang || "ar";

        const html = products
            .map((product) => {
                const image = product.main_image?.image?.small || product.images?.[0]?.image?.small || "";
                const name = this.escapeHtml(product.name || "");
                const price = product.formatted_sale_price || product.formatted_price || "";
                const originalPrice = product.formatted_sale_price ? product.formatted_price : "";
                const url = product.html_url || "#";

                return `
          <a href="${url}" class="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0">
            <div class="size-12 shrink-0 rounded-lg overflow-hidden bg-secondary">
              ${image ? `<img src="${image}" alt="${name}" class="size-full object-cover" loading="lazy" />` : ""}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground truncate">${name}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-sm font-medium text-foreground">${this.escapeHtml(price)}</span>
                ${originalPrice ? `<span class="text-xs text-muted-foreground line-through">${this.escapeHtml(originalPrice)}</span>` : ""}
              </div>
            </div>
          </a>
        `;
            })
            .join("");

        this.productsEl.innerHTML = html;
    }

    showState(state) {
        // Hide all states
        if (this.loadingEl) {
            this.loadingEl.classList.add("hidden");
            this.loadingEl.classList.remove("flex");
        }
        if (this.resultsEl) this.resultsEl.classList.add("hidden");
        if (this.emptyEl) this.emptyEl.classList.add("hidden");

        // Show requested state
        if (state === "loading" && this.loadingEl) {
            this.loadingEl.classList.remove("hidden");
            this.loadingEl.classList.add("flex");
        } else if (state === "results" && this.resultsEl) {
            this.resultsEl.classList.remove("hidden");
        } else if (state === "empty" && this.emptyEl) {
            this.emptyEl.classList.remove("hidden");
        }
    }

    showDropdown() {
        if (this.dropdown) {
            this.dropdown.classList.remove("hidden");
        }
    }

    hideDropdown() {
        if (this.dropdown) {
            this.dropdown.classList.add("hidden");
        }
    }

    updateViewAllLink(query) {
        if (!this.viewAllLink) return;
        const url = new URL(window.location.origin + "/products");
        if (query) {
            url.searchParams.set("q", query);
        }
        this.viewAllLink.setAttribute("href", url.toString());
    }

    clearInput() {
        this.input.value = "";
        if (this.clearBtn) {
            this.clearBtn.classList.add("hidden");
            this.clearBtn.classList.remove("flex");
        }
        this.hideDropdown();
        if (this.productsEl) this.productsEl.innerHTML = "";
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
}

// ─────────────────────────────────────────────────────────────
// Initialization
// ─────────────────────────────────────────────────────────────

const headerSearch = new HeaderSearch();

export function init() {
    headerSearch.init();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

export { headerSearch };
export default HeaderSearch;
