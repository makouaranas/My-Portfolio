// Enhanced Portfolio Scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles.js
    particlesJS.load('particles-js', '/assets/js/particles.config.js');

    // Typing Effect
    const typeWriter = new TypeWriter('#typed-text', {
        strings: ['Full Stack Development', 'Web Design', 'Desktop Apps', 'Penetration Testing'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced Scroll Animations
    const scrollReveal = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 2500,
        delay: 400
    });

    scrollReveal.reveal('.home .content', { origin: 'left' });
    scrollReveal.reveal('.home .image', { origin: 'right' });
    scrollReveal.reveal('.about .content', { interval: 100 });
    scrollReveal.reveal('.skills .skill-card', { interval: 100 });
    scrollReveal.reveal('.education .glass-card', { interval: 100 });
    scrollReveal.reveal('.experience .timeline-item', { interval: 100 });

    // Dynamic Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            header.style.backdropFilter = `blur(${Math.min(window.scrollY / 100, 20)}px)`;
        } else {
            header.classList.remove('scrolled');
            header.style.backdropFilter = 'blur(0px)';
        }
    });
 
    // Mobile Menu
    const menuBtn = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.navbar');
    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    });

    // Form Validation and Submission
    const contactForm = document.querySelector('#contact-form');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        
        try {
            // Replace with your actual form submission logic
            await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm);
            alert('Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
        }
    });

    // Skills Animation
    const skills = document.querySelectorAll('.skill-card');
    skills.forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        skill.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Dark/Light Theme Toggle
    const themeToggle = document.querySelector('#theme-toggle');
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Utility Classes
class TypeWriter {
    constructor(element, options) {
        this.element = document.querySelector(element);
        this.words = options.strings;
        this.speed = options.typeSpeed || 100;
        this.delay = options.backDelay || 2000;
        this.loop = options.loop || false;
        this.current = 0;
        this.start();
    }

    start() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const word = this.words[this.current];
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < word.length) {
                this.element.textContent = word.substring(0, i + 1);
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => this.erase(), this.delay);
            }
        }, this.speed);
    }

    erase() {
        const word = this.words[this.current];
        let i = word.length;
        const eraseInterval = setInterval(() => {
            if (i > 0) {
                this.element.textContent = word.substring(0, i - 1);
                i--;
            } else {
                clearInterval(eraseInterval);
                this.current = this.loop ? (this.current + 1) % this.words.length : this.current + 1;
                if (this.current < this.words.length) {
                    setTimeout(() => this.type(), 500);
                }
            }
        }, this.speed / 2);
    }
}