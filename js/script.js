// ==================== SCROLLREVEAL ====================
ScrollReveal().reveal('.hero', { delay: 300, duration: 1000, distance: '50px', origin: 'bottom' });
ScrollReveal().reveal('.page', { delay: 200, duration: 800, distance: '50px', origin: 'bottom' });
ScrollReveal().reveal('.skill', { interval: 200, duration: 1000, distance: '20px', origin: 'left' });
ScrollReveal().reveal('.job', { interval: 200, duration: 800, distance: '50px', origin: 'left' });
ScrollReveal().reveal('.edu-item', { interval: 200, duration: 800, distance: '50px', origin: 'bottom' });
ScrollReveal().reveal('.cert-list li', { interval: 150, duration: 600, distance: '30px', origin: 'bottom' });
ScrollReveal().reveal('.service-card', { interval: 200, duration: 800, distance: '50px', origin: 'bottom' });
ScrollReveal().reveal('.step', { interval: 200, duration: 800, distance: '30px', origin: 'bottom' });
ScrollReveal().reveal('.pricing-card', { interval: 200, duration: 800, distance: '30px', origin: 'bottom' });
ScrollReveal().reveal('.faq-item', { interval: 150, duration: 600, distance: '20px', origin: 'bottom' });
ScrollReveal().reveal('.contact', { delay: 200, duration: 1000, distance: '50px', origin: 'bottom' });

// ==================== SKILL BAR ANIMATION ====================
function animateSkills() {
    document.querySelectorAll('.skill').forEach(skill => {
        const bar = skill.querySelector('.progress');
        const position = skill.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (position < screenPosition && !skill.classList.contains('revealed')) {
            skill.classList.add('revealed');
            if (bar && !bar.style.width) {
                bar.style.width = bar.getAttribute('data-width');
            }
        }
    });
}

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

// ==================== PORTFOLIO LIGHTBOX ====================
const portfolioImages = document.querySelectorAll('.portfolio-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.getElementById('lightbox-prev');
const nextBtn = document.getElementById('lightbox-next');

let currentIndex = 0;

function showLightbox(index) {
    currentIndex = index;
    lightbox.style.display = 'flex';
    lightboxImg.src = portfolioImages[currentIndex].src;
}

portfolioImages.forEach((img, i) => {
    img.addEventListener('click', () => showLightbox(i));
});

closeBtn.addEventListener('click', () => lightbox.style.display = 'none');

function showNext() {
    currentIndex = (currentIndex + 1) % portfolioImages.length;
    lightboxImg.src = portfolioImages[currentIndex].src;
}
function showPrev() {
    currentIndex = (currentIndex - 1 + portfolioImages.length) % portfolioImages.length;
    lightboxImg.src = portfolioImages[currentIndex].src;
}

nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') lightbox.style.display = 'none';
    }
});

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 50) showPrev();
    if (touchStartX - touchEndX > 50) showNext();
});

// ==================== SMOOTH SCROLL FOR NAV LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== OPTIONAL: FLOATING HERO LOGO ====================
const logoImg = document.querySelector('.logo-img');
if (logoImg) {
    let offset = 0;
    setInterval(() => {
        offset = offset === 0 ? -15 : 0;
        logoImg.style.transform = `translateY(${offset}px)`;
    }, 3000);
}

// ==================== NAVIGATION SLIDER & HAMBURGER PREMIUM ====================
const navLinks = document.querySelectorAll('.nav-links a');
const navLinksContainer = document.querySelector('.nav-links');
const navToggle = document.querySelector('.nav-toggle');

// Create gradient slider element
let slider = document.createElement('div');
slider.classList.add('nav-slider');
navLinksContainer.appendChild(slider);

// HAMBURGER TOGGLE & ANIMATION
navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// Function to move slider with smooth gradient transition
function moveSlider(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    slider.style.width = rect.width + 'px';
    slider.style.left = (rect.left - parentRect.left) + 'px';
    slider.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    slider.style.background = 'linear-gradient(90deg, #ff00ff, #00ffff, #ff9900)';
    slider.style.height = '3px';
    slider.style.position = 'absolute';
    slider.style.bottom = '0';
    slider.style.borderRadius = '2px';
}

// Hover & click events for slider
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveSlider(link));
    link.addEventListener('click', () => moveSlider(link));
});

// Set slider to current page
const currentLink = document.querySelector('.nav-links a[aria-current="page"]');
if(currentLink) moveSlider(currentLink);

// Reset slider to current page on mouse leave
navLinksContainer.addEventListener('mouseleave', () => {
    if(currentLink) moveSlider(currentLink);
});