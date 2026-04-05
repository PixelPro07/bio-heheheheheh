// Portfolio JavaScript - Mobile-first functionality
// Author: Chaitanya Rajabhoj

// DOM Elements
const elements = {
    themeToggle: document.getElementById('themeToggle'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    navbar: document.getElementById('navbar'),
    scrollTopBtn: document.getElementById('scrollTop'),
    typingText: document.getElementById('typingText'),
    contactForm: document.getElementById('contactForm'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    progressBars: document.querySelectorAll('.progress-bar')
};

// Typing Animation Configuration
const typingConfig = {
    texts: [
        'A Passionate Web Developer',
        'Frontend & Backend Developer',
        'HTML | CSS | JavaScript Expert',
        'Building Beautiful Websites'
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 2000
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initTypingAnimation();
    initSmoothScroll();
    initScrollEffects();
    initContactForm();
    initSkillBars();
});

// ================================
// THEME MANAGEMENT
// ================================
function initTheme() {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
    setTheme(savedTheme);

    // Theme toggle click handler
    elements.themeToggle.addEventListener('click', toggleTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolioTheme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ================================
// MOBILE NAVIGATION
// ================================
function initMobileNav() {
    // Toggle mobile menu
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileMenuBtn.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenuBtn.classList.remove('active');
            elements.navMenu.classList.remove('active');
            document.body.style.overflow = '';

            // Update active link
            elements.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ================================
// TYPING ANIMATION
// ================================
function initTypingAnimation() {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = typingConfig.texts[textIndex];

        if (isDeleting) {
            // Deleting text
            elements.typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Typing text
            elements.typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? typingConfig.deletingSpeed : typingConfig.typingSpeed;

        // Check if word is complete
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = typingConfig.pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingConfig.texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing animation
    type();
}

// ================================
// SMOOTH SCROLL
// ================================
function initSmoothScroll() {
    // Handle all anchor link clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll to top button
    elements.scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// SCROLL EFFECTS
// ================================
function initScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        // Navbar styling
        if (window.scrollY > 50) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }

        // Show/hide scroll to top button
        if (window.scrollY > 500) {
            elements.scrollTopBtn.classList.add('visible');
        } else {
            elements.scrollTopBtn.classList.remove('visible');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();

        // Animate skill bars when in view
        animateSkillBars();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop - 80;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < bottom) {
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ================================
// SKILL BARS ANIMATION
// ================================
function initSkillBars() {
    // Store target progress values
    elements.progressBars.forEach(bar => {
        bar.dataset.target = bar.dataset.progress;
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    elements.progressBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isInViewport && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const target = bar.dataset.target;
            setTimeout(() => {
                bar.style.width = `${target}%`;
            }, 100);
        }
    });
}

// ================================
// CONTACT FORM
// ================================
function initContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(elements.contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !message) {
            showToast('Please fill in all fields');
            return;
        }

        // Simulate form submission
        showToast('Message sent successfully!');
        elements.contactForm.reset();

        // In a real app, you would send this to a server
        console.log('Form submitted:', { name, email, message });
    });
}

// ================================
// TOAST NOTIFICATION
// ================================
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.skill-card, .project-card, .quote-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animate-in class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ================================
// PERFORMANCE: Debounce scroll events
// ================================
function debounce(func, wait) {
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

// Apply debounce to scroll handler
window.addEventListener('scroll', debounce(() => {
    // Additional scroll-based effects can be added here
}, 16));

// ================================
// Haptic Feedback (Mobile)
// ================================
function hapticFeedback() {
    if (navigator.vibrate && window.matchMedia('(pointer: coarse)').matches) {
        navigator.vibrate(10);
    }
}

// Add haptic feedback to buttons
document.querySelectorAll('.btn, .social-link').forEach(btn => {
    btn.addEventListener('click', hapticFeedback);
});

// ================================
// CONSOLE GREETING
// ================================
console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cThanks for checking out my portfolio!', 'font-size: 14px; color: #475569;');
console.log('%cFeel free to connect with me!', 'font-size: 14px; color: #475569;');
