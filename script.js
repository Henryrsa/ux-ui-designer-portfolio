// Canvas Background Animation
const canvas = document.getElementById('bgCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let particles = [];
let particleCount = window.innerWidth < 768 ? 30 : 60;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;

        const colors = ['#ff6b9d', '#c792ea', '#7ee8fa', '#ffeaa7'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function connectParticles() {
    if (!ctx) return;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = '#c792ea';
                ctx.globalAlpha = (150 - distance) / 150 * 0.15;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function animate() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

function initParticles() {
    if (!canvas) return;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

if (canvas && ctx && !prefersReducedMotion) {
    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        particleCount = window.innerWidth < 768 ? 30 : 60;
        resizeCanvas();
        initParticles();
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Scroll reveal animation
const revealElements = document.querySelectorAll('.skill-card, .qualification-card, .project-card, .contact-card, .poster-card');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('reveal');
            element.classList.add('active');
        }
    });
};

if (!prefersReducedMotion) {
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
} else {
    revealElements.forEach(element => {
        element.classList.add('reveal');
        element.classList.add('active');
    });
}

// Add staggered animation delay to cards
document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Typing effect for hero subtitle
const typingText = document.querySelector('.typing-text');
const phrases = ['UX/UI Designer', 'Creative Thinker', 'Web Developer', 'Visual Storyteller'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingText) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

if (typingText) {
    if (prefersReducedMotion) {
        typingText.textContent = phrases[0];
    } else {
        typeEffect();
    }
}

// Navbar mobile toggle
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (!navbarCollapse) return;
        navbarCollapse.classList.remove('show');
    });
});

// Poster filters
const filterButtons = document.querySelectorAll('.filter-btn');
const posterCards = document.querySelectorAll('.poster-card');

if (filterButtons.length && posterCards.length) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            posterCards.forEach(card => {
                const tools = card.dataset.tools || '';
                const shouldShow = filter === 'all' || tools.includes(filter);
                card.style.display = shouldShow ? 'flex' : 'none';
            });
        });
    });
}

// Poster lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-nav.prev');
const lightboxNext = document.querySelector('.lightbox-nav.next');

if (lightbox && lightboxImage && lightboxCaption) {
    const posterLinks = Array.from(document.querySelectorAll('.poster-image'));
    let currentIndex = 0;

    const openLightboxAt = (index) => {
        const link = posterLinks[index];
        if (!link) return;
        const img = link.querySelector('img');
        if (!img) return;
        lightboxImage.src = link.getAttribute('href');
        lightboxImage.alt = img.alt || 'Poster preview';
        const captionTitle = link.closest('.poster-card')?.querySelector('h3')?.textContent || 'Poster Preview';
        lightboxCaption.textContent = captionTitle;
        currentIndex = index;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lightboxClose) {
            lightboxClose.focus();
        }
    };

    posterLinks.forEach((link, index) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openLightboxAt(index);
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const showPrev = () => {
        const prevIndex = (currentIndex - 1 + posterLinks.length) % posterLinks.length;
        openLightboxAt(prevIndex);
    };

    const showNext = () => {
        const nextIndex = (currentIndex + 1) % posterLinks.length;
        openLightboxAt(nextIndex);
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (event) => {
            event.stopPropagation();
            showPrev();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (event) => {
            event.stopPropagation();
            showNext();
        });
    }

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('active')) return;
        if (event.key === 'Escape') {
            closeLightbox();
        }
        if (event.key === 'ArrowLeft') {
            showPrev();
        }
        if (event.key === 'ArrowRight') {
            showNext();
        }
        if (event.key === 'Tab') {
            const focusables = [lightboxClose, lightboxPrev, lightboxNext].filter(Boolean);
            if (!focusables.length) return;
            const currentIndex = focusables.indexOf(document.activeElement);
            const nextIndex = event.shiftKey
                ? (currentIndex - 1 + focusables.length) % focusables.length
                : (currentIndex + 1) % focusables.length;
            event.preventDefault();
            focusables[nextIndex].focus();
        }
    });
}

// Skill cards hover effect - tilt
const supportsHover = window.matchMedia('(hover: hover)').matches;

if (supportsHover && !prefersReducedMotion) {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}
