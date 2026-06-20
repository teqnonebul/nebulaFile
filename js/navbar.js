/**
 * Navbar scroll effect module.
 * Adds/removes 'scrolled' class on the navbar based on scroll position.
 */

function initNavbarScroll(navbarElement) {
    if (!navbarElement) return null;

    const SCROLL_THRESHOLD = 50;

    function handleScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbarElement.classList.add('scrolled');
        } else {
            navbarElement.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    return handleScroll;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initNavbarScroll };
}
