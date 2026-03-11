'use strict';

// ==================== DOM READY UTILITY ====================
const domReady = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

// ==================== SCROLL REVEAL (using Intersection Observer) ====================
// If you prefer to keep ScrollReveal library, you can, but this is a lightweight custom implementation
const revealElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after reveal to save resources
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Adjust as needed
    });

    document.querySelectorAll('.hero, .page, .skill, .job, .edu-item, .cert-list li, .service-card, .step, .pricing-card, .faq-item, .contact')
        .forEach(el => observer.observe(el));
};

// ==================== SKILL BAR ANIMATION (Intersection Observer) ====================
const animateSkillBars = () => {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.progress');
                if (bar && bar.dataset.width && !bar.style.width) {
                    bar.style.width = bar.dataset.width;
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    document.querySelectorAll('.skill').forEach(skill => skillObserver.observe(skill));
};

// ==================== LIGHTBOX (Enhanced) ====================
class Lightbox {
    constructor() {
        this.images = document.querySelectorAll('.portfolio-item img');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.getElementById('lightbox-prev');
        this.nextBtn = document.getElementById('lightbox-next');
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;

        if (!this.lightbox || !this.images.length) return;

        this.init();
    }

    init() {
        // Bind methods
        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        // Add click listeners to images
        this.images.forEach((img, i) => {
            img.addEventListener('click', () => this.show(i));
            // Add lazy loading
            img.loading = 'lazy';
        });

        // Lightbox controls
        this.closeBtn.addEventListener('click', this.close);
        this.prevBtn.addEventListener('click', this.prev);
        this.nextBtn.addEventListener('click', this.next);

        // Keyboard and touch events
        this.lightbox.addEventListener('keydown', this.onKeyDown);
        this.lightbox.addEventListener('touchstart', this.onTouchStart);
        this.lightbox.addEventListener('touchend', this.onTouchEnd);

        // Set ARIA attributes
        this.lightbox.setAttribute('aria-label', 'Image lightbox');
        this.lightbox.setAttribute('role', 'dialog');
        this.lightbox.setAttribute('aria-modal', 'true');
        this.closeBtn.setAttribute('aria-label', 'Close lightbox');
        this.prevBtn.setAttribute('aria-label', 'Previous image');
        this.nextBtn.setAttribute('aria-label', 'Next image');
    }

    show(index) {
        this.currentIndex = index;
        this.lightboxImg.src = this.images[this.currentIndex].src;
        this.lightbox.style.display = 'flex';
        this.lightbox.setAttribute('aria-hidden', 'false');
        // Trap focus inside lightbox
        this.closeBtn.focus();
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    close() {
        this.lightbox.style.display = 'none';
        this.lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scroll
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.lightboxImg.src = this.images[this.currentIndex].src;
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.lightboxImg.src = this.images[this.currentIndex].src;
    }

    onKeyDown(e) {
        if (this.lightbox.style.display !== 'flex') return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.next();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prev();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }

    onTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    onTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        const diff = this.touchEndX - this.touchStartX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) this.prev();
            else this.next();
        }
    }
}

// ==================== SMOOTH SCROLL WITH OFFSET ====================
const setupSmoothScroll = () => {
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
};

// ==================== NAVIGATION SLIDER (Enhanced) ====================
class NavSlider {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.navContainer = document.querySelector('.nav-links');
        this.slider = document.querySelector('.nav-slider');
        this.currentLink = document.querySelector('.nav-links a[aria-current="page"]') || this.navLinks[0];

        if (!this.navContainer || !this.navLinks.length || !this.slider) return;

        this.init();
    }

    init() {
        this.moveSlider = this.moveSlider.bind(this);
        this.onResize = this.debounce(this.onResize.bind(this), 100);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        // Set initial slider position
        if (this.currentLink) {
            this.moveSlider(this.currentLink);
        }

        // Add event listeners
        this.navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => this.moveSlider(link));
            link.addEventListener('click', (e) => {
                this.moveSlider(link);
                // Update current link
                this.currentLink = link;
            });
        });

        this.navContainer.addEventListener('mouseleave', this.onMouseLeave);
        window.addEventListener('resize', this.onResize);
    }

    moveSlider(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const containerRect = this.navContainer.getBoundingClientRect();
        const left = rect.left - containerRect.left + this.navContainer.scrollLeft;
        this.slider.style.width = `${rect.width}px`;
        this.slider.style.transform = `translateX(${left}px)`;
    }

    onMouseLeave() {
        if (this.currentLink) {
            this.moveSlider(this.currentLink);
        }
    }

    onResize() {
        if (this.currentLink) {
            this.moveSlider(this.currentLink);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ==================== HAMBURGER MENU (Enhanced) ====================
class MobileMenu {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.header = document.querySelector('header');

        if (!this.navToggle || !this.navLinks) return;

        this.init();
    }

    init() {
        this.toggle = this.toggle.bind(this);
        this.closeOnClickOutside = this.closeOnClickOutside.bind(this);
        this.closeOnEscape = this.closeOnEscape.bind(this);
        this.closeOnLinkClick = this.closeOnLinkClick.bind(this);

        this.navToggle.addEventListener('click', this.toggle);

        // Close when clicking a link
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', this.closeOnLinkClick);
        });

        // Close on outside click
        document.addEventListener('click', this.closeOnClickOutside);

        // Close on escape key
        document.addEventListener('keydown', this.closeOnEscape);
    }

    toggle() {
        this.navToggle.classList.toggle('active');
        this.navLinks.classList.toggle('open');
        const isOpen = this.navLinks.classList.contains('open');
        this.navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    closeOnClickOutside(e) {
        if (!this.navLinks.classList.contains('open')) return;
        if (!this.navLinks.contains(e.target) && !this.navToggle.contains(e.target)) {
            this.navLinks.classList.remove('open');
            this.navToggle.classList.remove('active');
            this.navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    closeOnEscape(e) {
        if (e.key === 'Escape' && this.navLinks.classList.contains('open')) {
            this.navLinks.classList.remove('open');
            this.navToggle.classList.remove('active');
            this.navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    closeOnLinkClick() {
        this.navLinks.classList.remove('open');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// ==================== HEADER SHRINK ON SCROLL ====================
const headerShrink = () => {
    const header = document.querySelector('header');
    if (!header) return;

    const shrinkThreshold = 50;
    const toggleShrink = () => {
        header.classList.toggle('scrolled', window.scrollY > shrinkThreshold);
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(toggleShrink);
    });
    toggleShrink(); // Initial check
};

// ==================== LAZY LOAD IMAGES (native) ====================
const lazyLoadImages = () => {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback for older browsers – you can use a library like lazysizes
        // For simplicity, we skip
    }
};

// ==================== INITIALISE ALL ====================
domReady(() => {
    // Use requestAnimationFrame to batch DOM reads/writes
    requestAnimationFrame(() => {
        // Scroll reveal (if not using ScrollReveal library)
        revealElements();

        // Skill bars
        animateSkillBars();

        // Lightbox
        new Lightbox();

        // Smooth scroll
        setupSmoothScroll();

        // Nav slider
        new NavSlider();

        // Mobile menu
        new MobileMenu();

        // Header shrink
        headerShrink();

        // Lazy loading
        lazyLoadImages();

        // Optional: Remove loading class from body
        document.body.classList.remove('loading');
    });
});

// ==================== OPTIONAL: SCROLLREVEAL LIBRARY WRAPPER (if you want to keep it) ====================
// If you prefer to keep using ScrollReveal library, wrap it with a check:
/*
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({ reset: false, mobile: true });
    sr.reveal('.hero', { delay: 300, duration: 1000, distance: '50px', origin: 'bottom' });
    // ... other reveal configs
}
*/

// ==================== CLEANUP ON PAGE UNLOAD (optional) ====================
window.addEventListener('beforeunload', () => {
    // Remove event listeners if needed (but usually not necessary)
});