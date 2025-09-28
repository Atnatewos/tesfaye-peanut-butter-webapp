// File: js/main.js - UPDATED SCROLL DETECTION
class MobileMenu {
  constructor() {
    this.toggleButton = document.querySelector(".mobile-menu-toggle");
    this.navLinks = document.querySelector(".nav-links");
    this.body = document.body;

    this.init();
  }

  init() {
    if (this.toggleButton && this.navLinks) {
      this.toggleButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // Close menu when clicking on nav links
      this.navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          this.closeMenu();
        }
      });

      this.setupClickOutside();
    }
  }

  toggleMenu() {
    const isOpening = !this.toggleButton.classList.contains("mobile-open");

    this.toggleButton.classList.toggle("mobile-open", isOpening);
    this.navLinks.classList.toggle("mobile-open", isOpening);
    this.body.classList.toggle("menu-open", isOpening);
  }

  closeMenu() {
    this.toggleButton.classList.remove("mobile-open");
    this.navLinks.classList.remove("mobile-open");
    this.body.classList.remove("menu-open");
  }

  setupClickOutside() {
    document.addEventListener("click", (event) => {
      if (
        this.toggleButton.classList.contains("mobile-open") &&
        !this.navLinks.contains(event.target) &&
        !this.toggleButton.contains(event.target)
      ) {
        this.closeMenu();
      }
    });
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initialize mobile menu
  new MobileMenu();

  // Scroll effect for header - FIXED
  const header = document.querySelector(".main-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  // Fade-in animations
  const fadeSections = document.querySelectorAll(".fade-in-section");
  if (fadeSections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeSections.forEach((section) => observer.observe(section));
  }
});
