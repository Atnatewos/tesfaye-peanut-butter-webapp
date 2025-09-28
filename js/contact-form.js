// File: js/contact-form.js - ENHANCED
/**
 * CONTACT FORM SYSTEM - ENHANCED UX & VALIDATION
 * 🎯 PHASE 2: Better form validation, user feedback, and accessibility
 */

class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    this.successMessage = document.getElementById("form-success");

    if (!this.form) return;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupCharacterCount();
    console.log("✅ Contact Form initialized");
  }

  bindEvents() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Real-time validation
    const inputs = this.form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });

    // Reset form
    this.form.addEventListener("reset", () => this.handleReset());
  }

  setupCharacterCount() {
    const messageTextarea = document.getElementById("message");
    const charCount = document.getElementById("char-count");

    if (messageTextarea && charCount) {
      messageTextarea.addEventListener("input", () => {
        const length = messageTextarea.value.length;
        charCount.textContent = length;

        // Update character count styling
        const charCountElement =
          messageTextarea.nextElementSibling?.nextElementSibling;
        if (charCountElement) {
          charCountElement.classList.remove("warning", "error");
          if (length > 400) charCountElement.classList.add("warning");
          if (length > 500) charCountElement.classList.add("error");
        }
      });
    }
  }

  validateField(field) {
    const errorElement = document.getElementById(`${field.id}-error`);

    if (!field.checkValidity()) {
      this.showFieldError(field, errorElement);
      return false;
    }

    this.clearFieldError(field);
    return true;
  }

  showFieldError(field, errorElement) {
    field.classList.add("error");

    if (errorElement) {
      let message = "";

      if (field.validity.valueMissing) {
        message = "This field is required";
      } else if (field.validity.typeMismatch) {
        message = "Please enter a valid email address";
      } else if (field.validity.tooShort) {
        message = `Please enter at least ${field.minLength} characters`;
      } else if (field.validity.tooLong) {
        message = `Please enter no more than ${field.maxLength} characters`;
      } else {
        message = "Please check this field";
      }

      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.style.display = "none";
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const fields = this.form.querySelectorAll(
      "input[required], textarea[required], select[required]"
    );
    let isValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showToast("Please fix the errors before submitting", "error");
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Simulate form submission (replace with actual API call)
      await this.submitForm();

      // Show success message
      this.showSuccess();

      // Reset form
      this.form.reset();
      this.resetCharacterCount();
    } catch (error) {
      this.showToast("Failed to send message. Please try again.", "error");
      console.error("Form submission error:", error);
    } finally {
      this.setLoadingState(false);
    }
  }

  async submitForm() {
    // 🎯 PHASE 2: Simulate API call - replace with actual endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
          // 90% success rate for demo
          resolve();
        } else {
          reject(new Error("Network error"));
        }
      }, 1500);
    });
  }

  setLoadingState(loading) {
    if (this.submitBtn) {
      const btnText = this.submitBtn.querySelector(".btn-text");
      const btnSpinner = this.submitBtn.querySelector(".btn-spinner");

      if (loading) {
        this.submitBtn.disabled = true;
        btnText.textContent = "Sending...";
        btnSpinner.style.display = "inline-block";
      } else {
        this.submitBtn.disabled = false;
        btnText.textContent = "Send Message";
        btnSpinner.style.display = "none";
      }
    }
  }

  showSuccess() {
    if (this.successMessage) {
      this.successMessage.style.display = "block";

      // Scroll to success message
      this.successMessage.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.successMessage.style.display = "none";
      }, 5000);
    }
  }

  showToast(message, type = "info") {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === "error" ? "#e74c3c" : "#2ecc71"};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  handleReset() {
    // Clear all errors
    const errors = this.form.querySelectorAll(".form-error");
    errors.forEach((error) => (error.style.display = "none"));

    // Clear field errors
    const fields = this.form.querySelectorAll(".form-control");
    fields.forEach((field) => field.classList.remove("error"));

    // Reset character count
    this.resetCharacterCount();

    // Hide success message
    if (this.successMessage) {
      this.successMessage.style.display = "none";
    }
  }

  resetCharacterCount() {
    const charCount = document.getElementById("char-count");
    if (charCount) {
      charCount.textContent = "0";
      const charCountElement = charCount.parentElement;
      charCountElement.classList.remove("warning", "error");
    }
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactForm();
});
