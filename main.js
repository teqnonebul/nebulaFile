/**
 * Shared utilities for nebulaFile landing pages.
 * Extracted from duplicated inline scripts in index.html / index_en.html.
 */

// ---------- Navbar glass effect on scroll ----------
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ---------- Scroll-reveal animation ----------
function initRevealAnimation() {
    const VISIBLE_THRESHOLD = 100;

    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - VISIBLE_THRESHOLD) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    window.addEventListener('load', reveal);
}

// ---------- Slideshow rotation ----------
function initSlideshow(interval = 4000) {
    const containers = document.querySelectorAll('.slideshow-container');
    containers.forEach(container => {
        const images = container.querySelectorAll('.slideshow-img');
        if (images.length <= 1) return;

        let current = 0;
        images.forEach((img, i) => {
            img.style.opacity = i === 0 ? '1' : '0';
            img.style.transition = 'opacity 0.8s ease';
            img.style.position = i === 0 ? 'relative' : 'absolute';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
        });
        container.style.position = 'relative';

        setInterval(() => {
            images[current].style.opacity = '0';
            images[current].style.position = 'absolute';
            current = (current + 1) % images.length;
            images[current].style.opacity = '1';
            images[current].style.position = 'relative';
        }, interval);
    });
}

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initRevealAnimation();
    initSlideshow();
});
