// File: js/nav-main.js - ENHANCED STATE MANAGEMENT
/**
 * PROFESSIONAL NAVIGATION SYSTEM - ENHANCED VERSION
 * 🎯 PHASE 1 FIX: Better scroll performance with requestAnimationFrame
 * 🎯 PHASE 1 FIX: Clean state management without fragile dependencies
 */

class NavMain {
  constructor() {
    // 🎯 FIX: Robust element selection
    this.navbar = document.querySelector(".nav-main");
    this.toggle = document.querySelector(".nav-main__toggle");
    this.menu = document.querySelector(".nav-main__menu");
    this.links = document.querySelectorAll(".nav-main__link");

    // Graceful degradation if elements missing
    if (!this.navbar || !this.toggle || !this.menu) {
      console.warn("NavMain: Navigation elements not found");
      return;
    }

    this.isOpen = false;
    this.isHomepage = document.body.classList.contains("homepage");

    // 🎯 FIX: Proper method binding for event listeners
    this.boundHandleResize = this.handleResize.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupScrollHandler();
    this.setupAccessibility();

    console.log("✅ NavMain: Professional navigation system initialized");
  }

  bindEvents() {
    // 🎯 FIX: Reliable toggle with proper event handling
    this.toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    });

    // Mobile menu link handling
    this.links.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          this.closeMenu();
        }
      });
    });

    // Close menu on outside click
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.navbar.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Escape key support
    document.addEventListener("keydown", this.boundHandleKeydown);

    // Responsive behavior on resize
    window.addEventListener("resize", this.boundHandleResize);
  }

  setupScrollHandler() {
    // 🎯 FIX: Only apply scroll effects on homepage
    if (!this.isHomepage) return;

    let ticking = false; // 🎯 FIX: Performance optimization

    const updateNavbar = () => {
      const scrolled = window.scrollY > 50;
      this.navbar.classList.toggle("scrolled", scrolled);
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    // 🎯 FIX: Passive scroll listener for better performance
    window.addEventListener("scroll", requestTick, { passive: true });

    // Initial check
    updateNavbar();
  }

  setupAccessibility() {
    // ARIA attributes for screen readers
    this.toggle.setAttribute("aria-label", "Toggle navigation menu");
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.setAttribute("aria-controls", "nav-main-menu");

    this.menu.setAttribute("id", "nav-main-menu");
    this.menu.setAttribute("aria-label", "Main navigation");
  }

  handleResize() {
    // 🎯 FIX: Close mobile menu when resizing to desktop
    if (window.innerWidth > 768 && this.isOpen) {
      this.closeMenu();
    }
  }

  handleKeydown(e) {
    // Escape key closes menu
    if (e.key === "Escape" && this.isOpen) {
      this.closeMenu();
      this.toggle.focus(); // Return focus for accessibility
    }
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.toggle.classList.add("active");
    this.menu.classList.add("active");
    this.toggle.setAttribute("aria-expanded", "true");

    // 🎯 FIX: Prevent body scroll when menu is open
    document.body.style.overflow = "hidden";
    document.body.classList.add("nav-menu-open");
  }

  closeMenu() {
    this.isOpen = false;
    this.toggle.classList.remove("active");
    this.menu.classList.remove("active");
    this.toggle.setAttribute("aria-expanded", "false");

    // 🎯 FIX: Restore body scroll
    document.body.style.overflow = "";
    document.body.classList.remove("nav-menu-open");
  }

  // Cleanup method for potential SPA usage
  destroy() {
    window.removeEventListener("resize", this.boundHandleResize);
    document.removeEventListener("keydown", this.boundHandleKeydown);
  }
}

// 🎯 FIX: Bulletproof initialization
function initializeNavMain() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new NavMain());
  } else {
    new NavMain();
  }
}

// Auto-initialize
initializeNavMain();
