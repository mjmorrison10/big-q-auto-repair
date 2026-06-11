// Big Q Auto Repair - Interactive Scripts

// ============================================
// Mobile Navigation Toggle (with smooth height transition)
// ============================================
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// ============================================
// Navbar scroll effect
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// Smooth scroll for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// Scroll Progress Bar
// ============================================
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// Back to Top Button
// ============================================
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', toggleBackToTop);

// ============================================
// Animated Counter (IntersectionObserver)
// ============================================
function animateCounter(element, target, duration) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);

        if (target >= 1000) {
            element.textContent = current.toLocaleString() + '+';
        } else {
            element.textContent = current + '+';
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function fadeInElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.5)';
    element.style.transition = 'all 0.6s ease';
    requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const count = el.getAttribute('data-count');
            const suffix = el.getAttribute('data-suffix');

            if (suffix) {
                // Non-numeric values like "A+"
                fadeInElement(el);
            } else if (count !== null) {
                const target = parseInt(count, 10);
                if (!isNaN(target) && target > 0) {
                    el.classList.add('counting');
                    animateCounter(el, target, 2000);
                } else {
                    fadeInElement(el);
                }
            }

            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-number[data-count]').forEach(el => {
    statsObserver.observe(el);
});

// ============================================
// Scroll Animation Observer (staggered)
// ============================================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay based on sibling index
            const parent = entry.target.parentElement;
            const siblings = Array.from(parent.children).filter(child =>
                child.classList.contains('service-card') ||
                child.classList.contains('review-card') ||
                child.classList.contains('why-feature') ||
                child.classList.contains('detail-card')
            );
            const siblingIndex = siblings.indexOf(entry.target);
            const delay = siblingIndex >= 0 ? siblingIndex * 0.1 : 0;

            entry.target.style.animationDelay = delay + 's';
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .review-card, .why-feature, .detail-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// Parallax Hero Effect
// ============================================
const heroContent = document.querySelector('.hero-content');

function parallaxHero() {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    if (scrolled < heroHeight) {
        const translateY = scrolled * 0.3;
        heroContent.style.transform = `translateY(${translateY}px)`;
    }
}

window.addEventListener('scroll', parallaxHero);

// ============================================
// Hero Particles
// ============================================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('hero-particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (3 + Math.random() * 3) + 's';
        particle.style.width = (4 + Math.random() * 6) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

createParticles();

// ============================================
// Testimonial Auto-Scroll on Mobile
// ============================================
let autoScrollInterval = null;

function startAutoScroll() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid || window.innerWidth >= 768) return;

    let scrollDirection = 1;
    autoScrollInterval = setInterval(() => {
        const maxScroll = reviewsGrid.scrollWidth - reviewsGrid.clientWidth;
        if (reviewsGrid.scrollLeft >= maxScroll - 2) {
            scrollDirection = -1;
        } else if (reviewsGrid.scrollLeft <= 2) {
            scrollDirection = 1;
        }
        reviewsGrid.scrollLeft += scrollDirection * 1;
    }, 30);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// Start auto scroll on mobile
function checkAutoScroll() {
    if (window.innerWidth < 768) {
        if (!autoScrollInterval) startAutoScroll();
    } else {
        stopAutoScroll();
    }
}

// Pause on touch
const reviewsGrid = document.getElementById('reviewsGrid');
if (reviewsGrid) {
    reviewsGrid.addEventListener('touchstart', stopAutoScroll);
    reviewsGrid.addEventListener('touchend', () => {
        setTimeout(() => {
            if (window.innerWidth < 768) startAutoScroll();
        }, 3000);
    });
}

window.addEventListener('resize', checkAutoScroll);
checkAutoScroll();

// ============================================
// Form Validation (real-time with green checkmarks)
// ============================================
const contactForm = document.getElementById('contactForm');
const formFields = contactForm.querySelectorAll('input, select, textarea');

formFields.forEach(field => {
    field.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        if (this.value.trim().length > 0) {
            formGroup.classList.add('valid');
        } else {
            formGroup.classList.remove('valid');
        }
    });

    field.addEventListener('blur', function() {
        const formGroup = this.closest('.form-group');
        if (this.hasAttribute('required') && this.value.trim().length === 0) {
            formGroup.classList.remove('valid');
        }
    });
});

// Form submission handler
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Build mailto link as fallback (no backend)
    const subject = encodeURIComponent(`Appointment Request - ${data.make || 'Vehicle'} ${data.year || ''}`);
    const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Phone: ${data.phone}\n` +
        `Email: ${data.email || 'N/A'}\n` +
        `Vehicle: ${data.make || 'N/A'} ${data.year || ''}\n` +
        `Service: ${data.service || 'N/A'}\n` +
        `Issue: ${data.message || 'N/A'}\n\n` +
        `Please call me to schedule an appointment.`
    );

    window.location.href = `mailto:info@bigqautorepair.com?subject=${subject}&body=${body}`;

    // Fallback: if mailto doesn't work, show alternative
    setTimeout(() => {
        if (!document.hidden) {
            // mailto likely didn't open an email client
            const formNote = document.querySelector('.form-note');
            if (formNote) {
                const originalNote = formNote.textContent;
                formNote.innerHTML = 'Email didn\'t open? Call us directly at <a href="tel:5623435681" style="color: var(--primary); font-weight: 700;">(562) 343-5681</a>';
                setTimeout(() => {
                    formNote.textContent = originalNote;
                }, 8000);
            }
        }
    }, 2000);

    // Show success message
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '&#10003; Request Sent!';
    btn.style.background = '#10b981';
    btn.style.borderColor = '#10b981';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        this.reset();
        // Remove valid classes
        formFields.forEach(field => {
            field.closest('.form-group').classList.remove('valid');
        });
    }, 3000);
});

// ============================================
// CTA Button Pulse (auto-add after 3 seconds)
// ============================================
setTimeout(() => {
    document.querySelectorAll('.hero-ctas .btn').forEach(btn => {
        btn.classList.add('btn-pulse');
    });
}, 3000);

// ============================================
// Smooth Nav Active State (based on scroll position)
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-links a[data-section]');

function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinksList.forEach(link => {
                link.classList.remove('active-section');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active-section');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ============================================
// Open/Closed Indicator
// ============================================
function updateOpenStatus() {
    const statusEl = document.getElementById('openStatus');
    if (!statusEl) return;
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    const hour = now.getHours();
    const isOpen = day >= 1 && day <= 6 && hour >= 8 && hour < 18;
    if (isOpen) {
        statusEl.innerHTML = '<span style="color: #10b981; font-weight: 700;">OPEN NOW</span> Mon-Sat: 8AM-6PM';
    } else {
        statusEl.innerHTML = '<span style="color: #ef4444; font-weight: 700;">CLOSED</span> Mon-Sat: 8AM-6PM';
    }

    const mobileHours = document.getElementById('mobileHours');
    if (mobileHours) {
        if (isOpen) {
            mobileHours.innerHTML = '<span style="color: #10b981; font-weight: 700;">OPEN</span> until 6PM';
        } else {
            mobileHours.textContent = 'Opens Mon 8AM';
        }
    }
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);

// ============================================
// Click-to-call tracking with location
// ============================================
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        // Determine which section the click came from
        let location = 'unknown';
        if (link.closest('.hero')) location = 'hero';
        else if (link.closest('.urgency-banner')) location = 'urgency-banner';
        else if (link.closest('.cta-section')) location = 'cta-section';
        else if (link.closest('.mobile-cta')) location = 'mobile-cta';
        else if (link.closest('.contact')) location = 'contact-section';
        else if (link.closest('.footer')) location = 'footer';
        else if (link.closest('.reviews')) location = 'reviews-section';

        if (typeof gtag === 'function') {
            gtag('event', 'click_to_call', { business: 'Big Q Auto Repair', click_location: location });
        }
    });
});

// ============================================
// Initial animations on load
// ============================================
window.addEventListener('load', () => {
    // Animate hero badge
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        heroBadge.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroBadge.style.transition = 'all 0.6s ease';
            heroBadge.style.opacity = '1';
            heroBadge.style.transform = 'translateY(0)';
        }, 200);
    }

    // Animate hero h1
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1) {
        heroH1.style.opacity = '0';
        heroH1.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroH1.style.transition = 'all 0.6s ease';
            heroH1.style.opacity = '1';
            heroH1.style.transform = 'translateY(0)';
        }, 400);
    }

    // Animate hero sub
    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
        heroSub.style.opacity = '0';
        heroSub.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroSub.style.transition = 'all 0.6s ease';
            heroSub.style.opacity = '1';
            heroSub.style.transform = 'translateY(0)';
        }, 600);
    }

    // Animate hero CTAs
    const heroCtas = document.querySelector('.hero-ctas');
    if (heroCtas) {
        heroCtas.style.opacity = '0';
        heroCtas.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroCtas.style.transition = 'all 0.6s ease';
            heroCtas.style.opacity = '1';
            heroCtas.style.transform = 'translateY(0)';
        }, 800);
    }

    // Animate hero trust
    const heroTrust = document.querySelector('.hero-trust');
    if (heroTrust) {
        heroTrust.style.opacity = '0';
        heroTrust.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTrust.style.transition = 'all 0.6s ease';
            heroTrust.style.opacity = '1';
            heroTrust.style.transform = 'translateY(0)';
        }, 1000);
    }

    // Trigger scroll progress update
    updateScrollProgress();
});
