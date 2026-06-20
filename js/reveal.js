/**
 * Scroll reveal animation module.
 * Adds 'active' class to elements with '.reveal' when they enter the viewport.
 */

function createRevealHandler(elementVisible) {
    elementVisible = elementVisible || 100;

    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        reveals.forEach(function (el) {
            var windowHeight = window.innerHeight;
            var elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }

    return reveal;
}

function initReveal(elementVisible) {
    var reveal = createRevealHandler(elementVisible);
    window.addEventListener('scroll', reveal);
    window.addEventListener('load', reveal);
    return reveal;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createRevealHandler, initReveal };
}
