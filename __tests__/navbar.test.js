/**
 * @jest-environment jsdom
 */

const { initNavbarScroll } = require('../js/navbar');

describe('initNavbarScroll', () => {
    let navbar;

    beforeEach(() => {
        navbar = document.createElement('nav');
        navbar.id = 'navbar';
        document.body.appendChild(navbar);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    test('returns null when called with null element', () => {
        const result = initNavbarScroll(null);
        expect(result).toBeNull();
    });

    test('returns null when called with undefined element', () => {
        const result = initNavbarScroll(undefined);
        expect(result).toBeNull();
    });

    test('returns a handler function', () => {
        const handler = initNavbarScroll(navbar);
        expect(typeof handler).toBe('function');
    });

    test('adds "scrolled" class when scrollY > 50', () => {
        const handler = initNavbarScroll(navbar);
        Object.defineProperty(window, 'scrollY', { value: 51, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(true);
    });

    test('removes "scrolled" class when scrollY <= 50', () => {
        navbar.classList.add('scrolled');
        const handler = initNavbarScroll(navbar);
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(false);
    });

    test('removes "scrolled" class when scrollY is 0', () => {
        navbar.classList.add('scrolled');
        const handler = initNavbarScroll(navbar);
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(false);
    });

    test('adds "scrolled" at exactly scrollY = 51 (threshold boundary)', () => {
        const handler = initNavbarScroll(navbar);
        Object.defineProperty(window, 'scrollY', { value: 51, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(true);
    });

    test('does not add "scrolled" at exactly scrollY = 50 (threshold boundary)', () => {
        const handler = initNavbarScroll(navbar);
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(false);
    });

    test('registers scroll event listener on window', () => {
        const spy = jest.spyOn(window, 'addEventListener');
        initNavbarScroll(navbar);
        expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    test('does not register scroll listener when element is null', () => {
        const spy = jest.spyOn(window, 'addEventListener');
        initNavbarScroll(null);
        expect(spy).not.toHaveBeenCalled();
    });

    test('toggles class correctly across multiple scroll changes', () => {
        const handler = initNavbarScroll(navbar);

        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(true);

        Object.defineProperty(window, 'scrollY', { value: 20, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(false);

        Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
        handler();
        expect(navbar.classList.contains('scrolled')).toBe(true);
    });

    test('preserves other classes on the navbar element', () => {
        navbar.classList.add('custom-class');
        const handler = initNavbarScroll(navbar);

        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        handler();
        expect(navbar.classList.contains('custom-class')).toBe(true);
        expect(navbar.classList.contains('scrolled')).toBe(true);

        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        handler();
        expect(navbar.classList.contains('custom-class')).toBe(true);
        expect(navbar.classList.contains('scrolled')).toBe(false);
    });
});
