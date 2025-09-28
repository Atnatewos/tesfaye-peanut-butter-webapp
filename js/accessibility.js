// File: js/accessibility.js - SIMPLIFIED VERSION
/**
 * BASIC ACCESSIBILITY ENHANCEMENTS
 * 🎯 Simple improvements without annoying features
 */

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.enhanceKeyboardNavigation();
    this.enhanceImageAccessibility();
    console.log("✅ Basic Accessibility enhancements loaded");
  }

  enhanceKeyboardNavigation() {
    // 🎯 Simple keyboard support for product cards
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // 🎯 Escape key closes mobile menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const mobileMenu = document.querySelector(".nav-main__menu.active");
        if (mobileMenu) {
          const toggle = document.querySelector(".nav-main__toggle");
          toggle?.click();
        }
      }
    });
  }

  enhanceImageAccessibility() {
    // 🎯 Ensure images have alt text for screen readers
    const images = document.querySelectorAll("img:not([alt])");
    images.forEach((img) => {
      if (!img.hasAttribute("alt")) {
        img.setAttribute("alt", "Tesfaye Peanut Butter product image");
      }
    });
  }
}

// Initialize only if needed
if (document.querySelector(".product-card")) {
  document.addEventListener("DOMContentLoaded", () => {
    new AccessibilityEnhancer();
  });
}
