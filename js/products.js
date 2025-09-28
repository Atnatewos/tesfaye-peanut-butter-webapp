// File: js/products.js - UPDATED WITH IMAGE SUPPORT
/**
 * PRODUCT GALLERY SYSTEM - WITH IMAGE SUPPORT
 */

class ProductGallery {
  constructor() {
    this.products = [];
    this.container = document.getElementById("product-list");
    this.init();
  }

  async init() {
    this.showLoadingState();

    try {
      await this.loadProducts();
      this.renderProducts();
    } catch (error) {
      this.showErrorState(error);
    }
  }

  showLoadingState() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="loading-state fade-in-section">
          <div class="loading-spinner"></div>
          <p>Loading our delicious products...</p>
        </div>
      `;
    }
  }

  async loadProducts() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch("data/products.json", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Failed to load products: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid product data format");
      }

      this.products = data.products;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  showErrorState(error) {
    console.error("Product Gallery Error:", error);

    if (this.container) {
      this.container.innerHTML = `
        <div class="error-state fade-in-section">
          <div class="error-icon">⚠️</div>
          <h3>Unable to Load Products</h3>
          <p>We're having trouble loading our product catalog. Please check your connection and try again.</p>
          <button class="btn btn-secondary" onclick="location.reload()">Retry</button>
          <p class="error-detail">${error.message}</p>
        </div>
      `;
    }
  }

  renderProducts() {
    if (!this.products.length) {
      this.showEmptyState();
      return;
    }

    const productsHTML = this.products
      .map(
        (product, index) => `
        <div class="product-card fade-in-section" data-category="${
          product.category
        }">
          <div class="product-card-image">
            <img src="${product.image}" 
                 alt="${product.name} - Tesfaye Peanut Butter" 
                 loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="image-placeholder">
              <span>${product.name}</span>
            </div>
          </div>
          <div class="product-card-content">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <ul class="product-features">
              ${product.features
                .map((feature) => `<li>${feature}</li>`)
                .join("")}
            </ul>
            <div class="product-price">${product.price}</div>
          </div>
        </div>
      `
      )
      .join("");

    if (this.container) {
      this.container.innerHTML = productsHTML;
      this.initAnimations();
      this.setupProductInteractions();
    }
  }

  showEmptyState() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="empty-state fade-in-section">
          <div class="empty-icon">📦</div>
          <h3>No Products Available</h3>
          <p>We're currently updating our product catalog. Please check back soon!</p>
        </div>
      `;
    }
  }

  initAnimations() {
    const productCards = this.container.querySelectorAll(".fade-in-section");

    if (!productCards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = Array.from(productCards).indexOf(card);
            card.style.setProperty("--animation-delay", `${index * 0.1}s`);

            setTimeout(() => {
              card.classList.add("is-visible");
            }, index * 100);

            observer.unobserve(card);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    productCards.forEach((card) => observer.observe(card));
  }

  setupProductInteractions() {
    const productCards = this.container.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      card.addEventListener("click", () => {
        // Future enhancement: Product detail modal
        console.log("Product clicked:", card.querySelector("h3").textContent);
      });

      // Keyboard accessibility
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
}

// Initialize product gallery
function initializeProductGallery() {
  try {
    if (document.getElementById("product-list")) {
      new ProductGallery();
      console.log("✅ Product Gallery initialized successfully");
    }
  } catch (error) {
    console.error("❌ Product Gallery initialization failed:", error);

    const container = document.getElementById("product-list");
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <p>Failed to initialize product gallery. Please refresh the page.</p>
        </div>
      `;
    }
  }
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeProductGallery);
} else {
  initializeProductGallery();
}
