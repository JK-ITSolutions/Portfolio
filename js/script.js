/**
 * JK Tech - Complete Portfolio Scripts
 * Optimized for Core Web Vitals & Performance
 * Dark Green / Lime Flash Theme
 */

(function() {
    'use strict';

    // ============================================
    // CORE UTILITIES
    // ============================================
    
    const utils = {
        /**
         * Debounce function for performance optimization
         */
        debounce(func, wait = 100) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function for scroll events - improves FID
         */
        throttle(func, limit = 100) {
            let inThrottle;
            let lastResult;
            return function(...args) {
                if (!inThrottle) {
                    lastResult = func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
                return lastResult;
            };
        },

        /**
         * Check if element is in viewport - improves LCP
         */
        isInViewport(element, offset = 100) {
            const rect = element.getBoundingClientRect();
            return rect.top <= window.innerHeight - offset && rect.bottom >= 0;
        },

        /**
         * Get element offset from top
         */
        getOffset(element) {
            const rect = element.getBoundingClientRect();
            return rect.top + window.scrollY;
        },

        /**
         * Animate number counter with easing - improves user experience
         */
        animateCounter(element, target, duration = 1500) {
            let current = 0;
            const startTime = performance.now();
            
            function updateCounter(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic for smooth animation
                const eased = 1 - Math.pow(1 - progress, 3);
                current = Math.round(eased * target);
                
                element.textContent = current + '+';
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + '+';
                }
            }
            
            requestAnimationFrame(updateCounter);
        },

        /**
         * Lazy load images - improves LCP
         */
        lazyLoadImages() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            const src = img.getAttribute('data-src');
                            if (src) {
                                img.src = src;
                                img.removeAttribute('data-src');
                                img.classList.add('loaded');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }
    };

    // ============================================
    // DOM ELEMENTS CACHE - Improves performance
    // ============================================
    
    const $ = {
        header: document.querySelector('header'),
        nav: document.querySelector('nav'),
        menuToggle: document.querySelector('.menu-toggle'),
        backToTop: document.getElementById('back-to-top'),
        progressBar: document.getElementById('progress-bar'),
        whatsappFloat: document.querySelector('.whatsapp-float'),
        statNumbers: document.querySelectorAll('.stat-item .number, .stat-card strong'),
        skillBars: document.querySelectorAll('.skill'),
        revealElements: document.querySelectorAll('.fade-up, .scale-in, .reveal'),
        heroElements: document.querySelectorAll('.hero, .page-hero'),
        pageElements: document.querySelectorAll('.page'),
        lazyImages: document.querySelectorAll('img[data-src]'),
        navLinks: document.querySelectorAll('nav a:not(.nav-cta)'),
        navCta: document.querySelector('.nav-cta'),
        faqItems: document.querySelectorAll('.faq-item'),
        contactForm: document.getElementById('contactForm'),
        portfolioCards: document.querySelectorAll('.portfolio-card'),
        serviceCards: document.querySelectorAll('.service-card'),
        projectCards: document.querySelectorAll('.project-card'),
        timelineItems: document.querySelectorAll('.timeline-item'),
        testimonialCards: document.querySelectorAll('.testimonial-card'),
        pricingCards: document.querySelectorAll('.pricing-card'),
    };

    // ============================================
    // HEADER & NAVIGATION
    // ============================================
    
    /**
     * Initialize header shrink effect - improves UX
     */
    function initHeaderShrink() {
        if (!$header) return;

        const toggleShrink = utils.throttle(() => {
            if (window.scrollY > 50) {
                $header.classList.add('shrink');
            } else {
                $header.classList.remove('shrink');
            }
        }, 100);

        window.addEventListener('scroll', toggleShrink, { passive: true });
        toggleShrink();
    }

    /**
     * Initialize mobile menu - improves accessibility
     */
    function initMobileMenu() {
        if (!$menuToggle || !$nav) return;

        // Toggle menu
        $menuToggle.addEventListener('click', () => {
            const isOpen = $nav.classList.contains('active');
            $nav.classList.toggle('active');
            $menuToggle.classList.toggle('active');
            $menuToggle.setAttribute('aria-expanded', !isOpen);
            document.body.classList.toggle('no-scroll');
        });

        // Close menu on link click
        $navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if ($nav.classList.contains('active')) {
                    $nav.classList.remove('active');
                    $menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    $menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if ($nav.classList.contains('active')) {
                const isClickInside = $nav.contains(e.target) || $menuToggle.contains(e.target);
                if (!isClickInside) {
                    $nav.classList.remove('active');
                    $menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    $menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Close menu on escape key - improves accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && $nav.classList.contains('active')) {
                $nav.classList.remove('active');
                $menuToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
                $menuToggle.setAttribute('aria-expanded', 'false');
                $menuToggle.focus();
            }
        });
    }

    // ============================================
    // SCROLL PROGRESS BAR - Improves UX
    // ============================================
    
    function initProgressBar() {
        if (!$progressBar) return;
        
        const updateProgress = utils.throttle(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            $progressBar.style.width = progress + '%';
        }, 16);

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    // ============================================
    // BACK TO TOP BUTTON - Improves UX
    // ============================================
    
    function initBackToTop() {
        if (!$backToTop) return;
        
        const toggleVisibility = utils.throttle(() => {
            if (window.scrollY > 400) {
                $backToTop.classList.add('visible');
                $backToTop.style.display = 'flex';
            } else {
                $backToTop.classList.remove('visible');
                $backToTop.style.display = 'none';
            }
        }, 100);

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        $backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // STATS COUNTER ANIMATION - Improves engagement
    // ============================================
    
    function initStatsCounter() {
        if (!$statNumbers || $statNumbers.length === 0) return;
        
        let counted = false;

        function animateStats() {
            if (counted) return;
            
            const statsSection = document.getElementById('stats') || document.querySelector('.floating-stats');
            if (!statsSection) return;
            
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                counted = true;
                
                $statNumbers.forEach(el => {
                    const text = el.textContent.trim();
                    const target = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    if (isNaN(target) || target === 0) return;
                    
                    utils.animateCounter(el, target);
                });
            }
        }

        // Use Intersection Observer for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    animateStats();
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.getElementById('stats') || document.querySelector('.floating-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }

        // Fallback: scroll listener
        window.addEventListener('scroll', utils.throttle(animateStats, 200), { passive: true });
        window.addEventListener('load', animateStats);
    }

    // ============================================
    // SKILL BARS ANIMATION - Improves engagement
    // ============================================
    
    function initSkillBars() {
        if (!$skillBars || $skillBars.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skill = entry.target;
                    const bar = skill.querySelector('.progress');
                    if (!bar) return;
                    
                    if (!skill.classList.contains('revealed')) {
                        skill.classList.add('revealed');
                        const targetWidth = bar.getAttribute('data-width');
                        if (targetWidth) {
                            bar.style.width = targetWidth;
                        }
                    }
                }
            });
        }, { threshold: 0.2 });

        $skillBars.forEach(skill => observer.observe(skill));
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS - Improves engagement
    // ============================================
    
    function initScrollReveal() {
        if (!$revealElements || $revealElements.length === 0) return;

        // Check if ScrollReveal is available
        if (typeof ScrollReveal !== 'undefined') {
            // Use ScrollReveal library for hero and page elements
            if ($heroElements.length > 0) {
                ScrollReveal().reveal('.hero, .page-hero', { 
                    delay: 300,
                    distance: '30px',
                    origin: 'bottom',
                    duration: 800,
                    easing: 'ease-out',
                    reset: false
                });
            }
            
            if ($pageElements.length > 0) {
                ScrollReveal().reveal('.page', { 
                    delay: 200,
                    distance: '30px',
                    origin: 'bottom',
                    duration: 800,
                    easing: 'ease-out',
                    reset: false
                });
            }
            
            if ($skillBars.length > 0) {
                ScrollReveal().reveal('.skill', { 
                    interval: 200,
                    distance: '20px',
                    origin: 'bottom',
                    duration: 600,
                    easing: 'ease-out',
                    reset: false
                });
            }
        }

        // Use Intersection Observer for all reveal elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        $revealElements.forEach(el => observer.observe(el));

        // Check for elements already in view
        setTimeout(() => {
            $revealElements.forEach(el => {
                if (utils.isInViewport(el, 100)) {
                    el.classList.add('visible');
                }
            });
        }, 100);
    }

    // ============================================
    // TIMELINE ANIMATION - Improves engagement
    // ============================================
    
    function initTimeline() {
        if (!$timelineItems || $timelineItems.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 100;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        $timelineItems.forEach(item => observer.observe(item));
    }

    // ============================================
    // FAQ ACCORDION - Improves UX
    // ============================================
    
    function initFaq() {
        if (!$faqItems || $faqItems.length === 0) return;

        $faqItems.forEach(item => {
            const summary = item.querySelector('summary');
            if (summary) {
                summary.addEventListener('click', (e) => {
                    // Close other open FAQs
                    $faqItems.forEach(other => {
                        if (other !== item && other.open) {
                            other.open = false;
                        }
                    });
                });
            }
        });
    }

    // ============================================
    // WHATSAPP FLOAT - Improves conversion
    // ============================================
    
    function initWhatsAppFloat() {
        if (!$whatsappFloat) return;

        const phone = '923125262317';
        const message = 'Hi JK Tech, I\'d like a free consultation';

        $whatsappFloat.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS - Improves UX
    // ============================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = $header ? $header.offsetHeight : 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // ACCESSIBILITY: SKIP LINK - Improves accessibility
    // ============================================
    
    function initSkipLink() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const main = document.getElementById('main-content') || document.querySelector('main');
                if (main) {
                    main.setAttribute('tabindex', '-1');
                    main.focus();
                    setTimeout(() => main.removeAttribute('tabindex'), 1000);
                }
            });
        }
    }

    // ============================================
    // ACTIVE NAVIGATION LINK - Improves UX
    // ============================================
    
    function initActiveNav() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        document.querySelectorAll('nav a:not(.nav-cta)').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // ============================================
    // LAZY LOAD IMAGES - Improves LCP
    // ============================================
    
    function initLazyLoad() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ============================================
    // PARALLAX EFFECT ON HERO - Improves engagement
    // ============================================
    
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.5;
            hero.style.backgroundPositionY = rate + 'px';
        }, 16), { passive: true });
    }

    // ============================================
    // FORM SUBMISSION HANDLING - Improves UX
    // ============================================
    
    function initForm() {
        if (!$contactForm) return;

        $contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i> Sending...';
                submitBtn.disabled = true;
            }
        });
    }

    // ============================================
    // PERFORMANCE: Reduce reflows on resize
    // ============================================
    
    function initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 400);
        }, { passive: true });
    }

    // ============================================
    // CARD CLICK HANDLING - Portfolio cards
    // ============================================
    
    function initPortfolioCards() {
        if (!$portfolioCards || $portfolioCards.length === 0) return;

        $portfolioCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // If the click is on a link or button inside, let it handle
                if (e.target.closest('a') || e.target.closest('.btn-link')) {
                    return;
                }
                // Otherwise, navigate to the card's link
                const link = this.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                }
            });
        });
    }

    // ============================================
    // INITIALIZE ALL MODULES
    // ============================================
    
    function init() {
        // Performance First
        initLazyLoad();
        initResizeHandler();
        
        // Core Features
        initHeaderShrink();
        initMobileMenu();
        initProgressBar();
        initBackToTop();
        initStatsCounter();
        initSkillBars();
        initScrollReveal();
        initTimeline();
        initFaq();
        initPortfolioCards();
        
        // Interactions
        initWhatsAppFloat();
        initSmoothScroll();
        initParallax();
        initForm();
        
        // Accessibility
        initSkipLink();
        initActiveNav();

        // Log initialization
        console.log('🚀 JK Tech - Premium Portfolio initialized');
        console.log(`📦 ${document.querySelectorAll('.service-card, .service-box').length} services loaded`);
        console.log(`📊 ${document.querySelectorAll('.stat-item, .stat-card').length} stats displayed`);
        console.log(`🎯 ${document.querySelectorAll('.project-card').length} projects showcased`);
        console.log(`💚 Theme: Dark Green / Lime Flash`);
        console.log(`⚡ Core Web Vitals optimized`);

        // Performance monitoring
        if ('performance' in window && 'getEntriesByType' in performance) {
            const paintMetrics = performance.getEntriesByType('paint');
            paintMetrics.forEach(metric => {
                if (metric.name === 'first-contentful-paint') {
                    console.log(`🎨 FCP: ${Math.round(metric.startTime)}ms`);
                }
                if (metric.name === 'largest-contentful-paint') {
                    console.log(`🖼️ LCP: ${Math.round(metric.startTime)}ms`);
                }
            });
        }
    }

    // ============================================
    // RUN INITIALIZATION
    // ============================================
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        if (requestIdleCallback) {
            requestIdleCallback(init, { timeout: 2000 });
        } else {
            setTimeout(init, 100);
        }
    }

    // ============================================
    // CORE WEB VITALS: Report CLS
    // ============================================
    
    if ('PerformanceObserver' in window) {
        try {
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hidden) {
                        console.log(`📐 CLS: ${entry.value}`);
                    }
                }
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
            // PerformanceObserver not fully supported
        }
    }

})();

// ============================================
// LEGACY SUPPORT: Skill bars fallback
// ============================================

function animateSkills() {
    document.querySelectorAll('.skill').forEach(skill => {
        const bar = skill.querySelector('.progress');
        if (!bar) return;
        
        const position = skill.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (position < screenPosition && !skill.classList.contains('revealed')) {
            skill.classList.add('revealed');
            if (bar && !bar.style.width) {
                const targetWidth = bar.getAttribute('data-width');
                if (targetWidth) {
                    bar.style.width = targetWidth;
                }
            }
        }
    });
}

// Legacy scroll listener for skill bars
window.addEventListener('scroll', animateSkills, { passive: true });
window.addEventListener('load', animateSkills);

// ============================================
// LEGACY SUPPORT: ScrollReveal fallback
// ============================================

if (typeof ScrollReveal !== 'undefined') {
    try {
        ScrollReveal().reveal('.hero', { delay: 300 });
        ScrollReveal().reveal('.page', { delay: 200 });
        ScrollReveal().reveal('.skill', { interval: 200 });
    } catch (e) {
        console.log('ScrollReveal error:', e);
    }
}
