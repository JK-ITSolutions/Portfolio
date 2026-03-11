ScrollReveal().reveal('.hero', { delay: 300 });
ScrollReveal().reveal('.page', { delay: 200 });
ScrollReveal().reveal('.skill', { interval: 200 });

// Skill bar reveal + width animation
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