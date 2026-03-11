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

// Trigger on scroll and load
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

// Click on portfolio images
portfolioImages.forEach((img, i) => {
img.addEventListener('click', () => showLightbox(i));
});

// Close lightbox
closeBtn.addEventListener('click', () => lightbox.style.display = 'none');

// Navigate images
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

// Keyboard support
document.addEventListener('keydown', (e) => {
if (lightbox.style.display === 'flex') {
if (e.key === 'ArrowRight') showNext();
if (e.key === 'ArrowLeft') showPrev();
if (e.key === 'Escape') lightbox.style.display = 'none';
}
});

// Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
lightbox.addEventListener('touchend', e => {
touchEndX = e.changedTouches[0].screenX;
if (touchEndX - touchStartX > 50) showPrev();      // Swipe right
if (touchStartX - touchEndX > 50) showNext();      // Swipe left
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
logoImg.style.transform = translateY(${offset}px);
}, 3000);
}