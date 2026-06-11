/* ============================================
   BIG Q AUTO REPAIR — "THE FIGHTER" JS
   ============================================ */

(function() {
  'use strict';

  // --- DOM Ready ---
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupScrollProgress();
    setupNavbar();
    setupMobileMenu();
    setupScrollAnimations();
    setupHonestyCounter();
    setupBackToTop();
    setupMobileCtaBar();
    setupOpenStatus();
    setupContactForm();
    setupClickToCall();
  }

  // =========================
  // SCROLL PROGRESS BAR
  // =========================
  function setupScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    // Use requestAnimationFrame for smooth updates
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  // =========================
  // NAVBAR
  // =========================
  function setupNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Smooth scroll for nav links
    navbar.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Close mobile menu
        closeMobileMenu();
      });
    });
  }

  // =========================
  // MOBILE MENU
  // =========================
  var mobileMenuOpen = false;

  function setupMobileMenu() {
    var toggle = document.getElementById('mobileToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
      mobileMenuOpen = !mobileMenuOpen;
      toggle.classList.toggle('active', mobileMenuOpen);
      menu.classList.toggle('open', mobileMenuOpen);
      document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        closeMobileMenu();
        // Smooth scroll
        var href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          var target = document.querySelector(href);
          if (target) {
            setTimeout(function() {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }
      });
    });
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    var toggle = document.getElementById('mobileToggle');
    var menu = document.getElementById('mobileMenu');
    if (toggle) toggle.classList.remove('active');
    if (menu) menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // =========================
  // SCROLL ANIMATIONS (IntersectionObserver)
  // =========================
  function setupScrollAnimations() {
    var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all
      elements.forEach(function(el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function(el) { observer.observe(el); });
  }

  // =========================
  // HONESTY SCORE COUNTER
  // =========================
  function setupHonestyCounter() {
    var counter = document.getElementById('honestyCounter');
    if (!counter) return;

    var target = 200000;
    var duration = 2500;
    var started = false;

    if (!('IntersectionObserver' in window)) {
      animateCounter(counter, target, duration);
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          animateCounter(counter, target, duration);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counter);
  }

  function animateCounter(element, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      
      element.textContent = '$' + current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = '$' + target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  // =========================
  // BACK TO TOP
  // =========================
  function setupBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 600) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // =========================
  // MOBILE CTA BAR
  // =========================
  function setupMobileCtaBar() {
    var bar = document.getElementById('mobileCtaBar');
    if (!bar) return;

    // Only show on mobile
    if (window.innerWidth >= 1024) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 400) {
            bar.classList.add('visible');
          } else {
            bar.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // =========================
  // OPEN/CLOSED STATUS
  // =========================
  function setupOpenStatus() {
    var statusDot = document.getElementById('statusDot');
    var statusText = document.getElementById('statusText');
    if (!statusDot || !statusText) return;

    function updateStatus() {
      var now = new Date();
      var day = now.getDay(); // 0=Sun, 1=Mon...6=Sat
      var hour = now.getHours();
      var minute = now.getMinutes();
      var currentTime = hour * 60 + minute;

      var isOpen = false;
      var statusStr = '';

      if (day === 0) {
        // Sunday - Closed
        isOpen = false;
        statusStr = 'Closed — Opens Mon 8AM';
      } else if (day >= 1 && day <= 5) {
        // Mon-Fri: 8AM-6PM
        var openTime = 8 * 60; // 480
        var closeTime = 18 * 60; // 1080
        isOpen = currentTime >= openTime && currentTime < closeTime;
        if (isOpen) {
          statusStr = 'Open Now — Closes at 6PM';
        } else if (currentTime < openTime) {
          statusStr = 'Closed — Opens at 8AM';
        } else {
          statusStr = 'Closed — Opens Mon 8AM';
          // If it's Friday night, say Saturday
          if (day === 5) statusStr = 'Closed — Opens Sat 8AM';
        }
      } else if (day === 6) {
        // Saturday: 8AM-6PM
        var openTime = 8 * 60;
        var closeTime = 18 * 60;
        isOpen = currentTime >= openTime && currentTime < closeTime;
        if (isOpen) {
          statusStr = 'Open Now — Closes at 6PM';
        } else if (currentTime < openTime) {
          statusStr = 'Closed — Opens at 8AM';
        } else {
          statusStr = 'Closed — Opens Mon 8AM';
        }
      }

      statusDot.classList.toggle('closed', !isOpen);
      statusText.textContent = statusStr;
    }

    updateStatus();
    setInterval(updateStatus, 60000); // Update every 60 seconds
  }

  // =========================
  // CONTACT FORM
  // =========================
  function setupContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var formEl = form;
    var successEl = document.getElementById('formSuccess');
    var errorEl = document.getElementById('formError');

    formEl.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = formEl.querySelector('#name').value.trim();
      var phone = formEl.querySelector('#phone').value.trim();

      if (!name || !phone) {
        if (errorEl) {
          errorEl.classList.add('show');
          setTimeout(function() { errorEl.classList.remove('show'); }, 3000);
        }
        return;
      }

      // Collect form data
      var email = formEl.querySelector('#email').value.trim();
      var make = formEl.querySelector('#make').value.trim();
      var year = formEl.querySelector('#year').value.trim();
      var service = formEl.querySelector('#service').value;
      var issue = formEl.querySelector('#issue').value.trim();

      // Build mailto body
      var subject = 'Appointment Request from ' + name;
      var body = 'Name: ' + name + '\n';
      body += 'Phone: ' + phone + '\n';
      if (email) body += 'Email: ' + email + '\n';
      if (make) body += 'Vehicle Make: ' + make + '\n';
      if (year) body += 'Year: ' + year + '\n';
      if (service) body += 'Service Needed: ' + service + '\n';
      if (issue) body += 'Issue: ' + issue + '\n';

      // Try mailto first
      var mailtoLink = 'mailto:info@bigqautorepair.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      
      // Show success and redirect
      if (successEl) {
        formEl.style.display = 'none';
        successEl.classList.add('show');
      }

      // Open mailto
      window.location.href = mailtoLink;

      // Fallback: after 2 seconds, suggest calling
      setTimeout(function() {
        if (confirm('If your email didn\'t open, please call us directly at (562) 343-5681 to schedule your appointment.')) {
          window.location.href = 'tel:5623435681';
        }
      }, 2000);
    });
  }

  // =========================
  // CLICK-TO-CALL TRACKING
  // =========================
  function setupClickToCall() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
      link.addEventListener('click', function() {
        // gtag event
        if (typeof gtag === 'function') {
          gtag('event', 'click_to_call', {
            event_category: 'Contact',
            event_label: 'Phone Call',
            value: 1
          });
        }
      });
    });
  }

})();
