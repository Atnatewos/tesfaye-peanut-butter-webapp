// File: js/performance.js - UPDATED FOR PRODUCT IMAGES
/**
 * PERFORMANCE OPTIMIZATION SYSTEM - WITH PRODUCT IMAGE SUPPORT
 */

class PerformanceOptimizer {
  constructor() {
    this.images = [];
    this.observedImages = new Set();
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.preloadCriticalImages();
    this.setupPerformanceMonitoring();
    this.optimizeAnimations();

    console.log("✅ Performance Optimizer initialized");
  }

  lazyLoadImages() {
    // 🎯 UPDATED: Include product images in lazy loading
    const images = document.querySelectorAll(
      "img[data-src], .product-card-image img"
    );
    this.images = Array.from(images);

    if (!("IntersectionObserver" in window)) {
      this.loadAllImages();
      return;
    }

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
            this.observedImages.delete(img);
          }
        });
      },
      {
        rootMargin: "100px 0px", // 🎯 Increased for product images
        threshold: 0.1,
      }
    );

    this.images.forEach((img) => {
      // 🎯 Only observe images that aren't already loaded
      if (img.complete || img.src) return;

      imageObserver.observe(img);
      this.observedImages.add(img);
    });
  }

  loadImage(img) {
    // 🎯 UPDATED: Handle both data-src and regular src images
    const src = img.getAttribute("data-src") || img.src;
    if (!src || src.startsWith("data:")) return;

    const newImg = new Image();
    newImg.src = src;

    newImg.onload = () => {
      if (img.hasAttribute("data-src")) {
        img.src = src;
        img.removeAttribute("data-src");
      }
      img.classList.add("fade-in");
    };

    newImg.onerror = () => {
      console.warn("Failed to load image:", src);
      img.classList.add("image-error");
      // 🎯 Show placeholder for product images
      const placeholder = img.nextElementSibling;
      if (placeholder && placeholder.classList.contains("image-placeholder")) {
        placeholder.style.display = "flex";
      }
    };
  }

  preloadCriticalImages() {
    // 🎯 UPDATED: Preload product images that are above the fold
    const criticalImages = [
      "/images/gallery/wide angle hero image2.png",
      "/images/gallery/wide angle hero image-mobile1.png",
      "/images/logos/TPBM logo top.png",
    ];

    // 🎯 NEW: Preload first few product images
    const firstProductCards = document.querySelectorAll(
      ".product-card:nth-child(-n+3) img"
    );
    firstProductCards.forEach((img) => {
      const src = img.src;
      if (src && !src.startsWith("data:")) {
        criticalImages.push(src);
      }
    });

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  setupPerformanceMonitoring() {
    if ("connection" in navigator) {
      const connection = navigator.connection;
      if (connection.saveData === true) {
        this.enableDataSaverMode();
      }

      if (
        connection.effectiveType.includes("2g") ||
        connection.effectiveType.includes("3g")
      ) {
        this.enableLowBandwidthMode();
      }
    }

    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime);
            if (entry.startTime > 2500) {
              this.triggerPerformanceWarnings();
            }
          }
        }
      });

      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input"],
      });
    }
  }

  enableDataSaverMode() {
    document.documentElement.classList.add("data-saver-mode");

    const styles = document.createElement("style");
    styles.textContent = `
      .data-saver-mode * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .data-saver-mode .product-card-image img {
        filter: blur(5px);
        transform: scale(1.02);
      }
    `;
    document.head.appendChild(styles);
  }

  enableLowBandwidthMode() {
    document.documentElement.classList.add("low-bandwidth-mode");

    const decorativeImages = document.querySelectorAll(
      "img[data-low-priority]"
    );
    decorativeImages.forEach((img) => {
      img.style.display = "none";
    });
  }

  optimizeAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reduced-motion");
    }

    window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .addEventListener("change", (e) => {
        if (e.matches) {
          document.documentElement.classList.add("reduced-motion");
        } else {
          document.documentElement.classList.remove("reduced-motion");
        }
      });
  }

  loadAllImages() {
    this.images.forEach((img) => {
      const src = img.getAttribute("data-src");
      if (src) {
        img.src = src;
        img.removeAttribute("data-src");
      }
    });
  }

  triggerPerformanceWarnings() {
    console.warn("⚠️ Performance Warning: LCP above 2.5s");
  }
}

// Initialize performance optimizer
document.addEventListener("DOMContentLoaded", () => {
  new PerformanceOptimizer();
});
