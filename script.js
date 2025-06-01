// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      const isExpanded = navMenu.classList.contains("active")
      navMenu.classList.toggle("active")

      // Update ARIA attributes for accessibility
      mobileMenuToggle.setAttribute("aria-expanded", !isExpanded)

      const icon = mobileMenuToggle.querySelector("i")
      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Close mobile menu on nav link click
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove("active")
        mobileMenuToggle.setAttribute("aria-expanded", "false")
        const icon = mobileMenuToggle.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  })

  // Smooth scroll
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href === "#" || href === "#!") {
        e.preventDefault()
        return
      }
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = target.offsetTop - headerHeight - 20
        window.scrollTo({ top: targetPosition, behavior: "smooth" })

        // Update focus for accessibility
        target.focus({ preventScroll: true })
      }
    })
  })

  // Mobile dropdowns
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault()
        const dropdown = this.closest(".dropdown")
        const dropdownMenu = dropdown.querySelector(".dropdown-menu")
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.style.display = "none"
        })
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block"

        // Toggle ARIA attribute for accessibility
        this.setAttribute("aria-expanded", dropdownMenu.style.display === "block")
      }
    })

    // Keyboard support for dropdowns
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.click()
      }
    })
  })

  // Close dropdowns if clicked outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none"
      })
      document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false")
      })
    }
  })

  // Header scroll effect
  let lastScrollTop = 0
  const header = document.querySelector(".header")
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    header.style.transform = scrollTop > lastScrollTop && scrollTop > 100 ? "translateY(-100%)" : "translateY(0)"
    lastScrollTop = scrollTop
  })

  window.addEventListener("scroll", () => {
    header.style.backgroundColor = window.scrollY > 50 ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  })

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  const animateElements = document.querySelectorAll(
    ".hero-image-container img, .doctor-card.featured, .doctor-card, .doctor-tile, .service-card, .facility-card, .testimonial-card, .stat-item",
  )
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Lazy load images
  const images = document.querySelectorAll("img[src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.style.opacity = "0"
        img.style.transition = "opacity 0.3s ease"
        img.onload = function () {
          this.style.opacity = "1"
        }
        img.onerror = function () {
          this.style.opacity = "1"
          this.alt = "Image could not be loaded"
        }
        observer.unobserve(img)
      }
    })
  })
  images.forEach((img) => imageObserver.observe(img))

  // Back to top button
  const backToTopButton = document.createElement("button")
  backToTopButton.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>'
  backToTopButton.className = "back-to-top"
  backToTopButton.setAttribute("aria-label", "Back to top")
  backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `
  document.body.appendChild(backToTopButton)

  window.addEventListener("scroll", () => {
    const show = window.scrollY > 300
    backToTopButton.style.opacity = show ? "1" : "0"
    backToTopButton.style.visibility = show ? "visible" : "hidden"
  })

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  // External link spinner
  const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="https://maps.app.goo.gl"]')
  externalLinks.forEach((link) => {
    // Add security attributes
    if (link.hostname !== window.location.hostname) {
      link.setAttribute("rel", "noopener noreferrer")
      link.setAttribute("target", "_blank")
    }

    link.addEventListener("click", function () {
      this.style.opacity = "0.7"
      const originalHTML = this.innerHTML
      this.innerHTML += ' <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>'

      setTimeout(() => {
        this.style.opacity = "1"
        this.innerHTML = originalHTML
      }, 1000)
    })
  })

  // Emergency hover effect
  const emergencyButtons = document.querySelectorAll(".btn-danger, .btn-outline-danger")
  emergencyButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => (button.style.transform = "scale(1.05)"))
    button.addEventListener("mouseleave", () => (button.style.transform = "scale(1)"))
  })

  // Keyboard ESC closes mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      navMenu.classList.remove("active")
      mobileMenuToggle.setAttribute("aria-expanded", "false")
      const icon = mobileMenuToggle.querySelector("i")
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")

      // Close dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none"
      })
      document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false")
      })
    }
  })

  // Optional: Testimonial hover pause
  const testimonialGrid = document.querySelector(".testimonials-grid")
  if (testimonialGrid && window.innerWidth > 768) {
    testimonialGrid.addEventListener("mouseenter", () => {})
    testimonialGrid.addEventListener("mouseleave", () => {})
  }

  // Form validation and accessibility (if forms are added later)
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const requiredFields = this.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.setAttribute("aria-invalid", "true")
          field.focus()
        } else {
          field.setAttribute("aria-invalid", "false")
        }
      })

      if (!isValid) {
        e.preventDefault()
        showNotification("Please fill in all required fields", "error")
      }
    })
  })

  // Initialize Google Maps (placeholder for future implementation)
  initializeGoogleMaps()
})

// Utility functions
function formatPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.setAttribute("role", "alert")
  notification.setAttribute("aria-live", "polite")
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${type === "success" ? "#16a34a" : type === "error" ? "#dc3545" : "#2563eb"};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 300px;
  `
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.opacity = "1"
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 5000)
}

function initializeGoogleMaps() {
  // Placeholder for Google Maps integration
  console.log("Google Maps integration ready")
}

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType("navigation")[0]
    if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
      console.warn("Page load time is slow. Consider optimizing resources.")
    }
  })
}

// Service Worker registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
