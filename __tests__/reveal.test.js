/**
 * @jest-environment jsdom
 */

const { createRevealHandler, initReveal } = require('../js/reveal');

describe('createRevealHandler', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('returns a function', () => {
        const handler = createRevealHandler();
        expect(typeof handler).toBe('function');
    });

    test('adds "active" class to visible .reveal elements', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        // Simulate element near top of viewport
        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 100 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler(100);
        reveal();

        expect(el.classList.contains('active')).toBe(true);
    });

    test('does not add "active" class to elements below viewport', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        // Element is at the bottom, beyond visible threshold
        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 800 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler(100);
        reveal();

        expect(el.classList.contains('active')).toBe(false);
    });

    test('handles boundary: elementTop exactly at windowHeight - elementVisible', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        // top = 668, windowHeight = 768, elementVisible = 100 => 668 < 668 is false
        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 668 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler(100);
        reveal();

        expect(el.classList.contains('active')).toBe(false);
    });

    test('activates element one pixel above the threshold', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        // top = 667, windowHeight = 768, elementVisible = 100 => 667 < 668 is true
        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 667 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler(100);
        reveal();

        expect(el.classList.contains('active')).toBe(true);
    });

    test('processes multiple .reveal elements independently', () => {
        const visible = document.createElement('div');
        visible.classList.add('reveal');
        document.body.appendChild(visible);

        const hidden = document.createElement('div');
        hidden.classList.add('reveal');
        document.body.appendChild(hidden);

        jest.spyOn(visible, 'getBoundingClientRect').mockReturnValue({ top: 200 });
        jest.spyOn(hidden, 'getBoundingClientRect').mockReturnValue({ top: 900 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler(100);
        reveal();

        expect(visible.classList.contains('active')).toBe(true);
        expect(hidden.classList.contains('active')).toBe(false);
    });

    test('does nothing when no .reveal elements exist', () => {
        const reveal = createRevealHandler(100);
        expect(() => reveal()).not.toThrow();
    });

    test('uses default elementVisible of 100 when not provided', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        // top = 667, windowHeight = 768, default elementVisible = 100 => 667 < 668 is true
        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 667 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler();
        reveal();

        expect(el.classList.contains('active')).toBe(true);
    });

    test('accepts custom elementVisible threshold', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        // top = 600, windowHeight = 768, elementVisible = 200 => 600 < 568 is false
        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 600 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler(200);
        reveal();

        expect(el.classList.contains('active')).toBe(false);
    });

    test('does not remove "active" class once added (one-way activation)', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const reveal = createRevealHandler(100);

        // First: element visible
        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 100 });
        reveal();
        expect(el.classList.contains('active')).toBe(true);

        // Second: element scrolls out of view
        el.getBoundingClientRect.mockReturnValue({ top: 900 });
        reveal();
        expect(el.classList.contains('active')).toBe(true);
    });

    test('ignores elements without .reveal class', () => {
        const el = document.createElement('div');
        el.classList.add('some-other-class');
        document.body.appendChild(el);

        const reveal = createRevealHandler(100);
        reveal();

        expect(el.classList.contains('active')).toBe(false);
    });
});

describe('initReveal', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('registers both scroll and load event listeners', () => {
        const spy = jest.spyOn(window, 'addEventListener');
        initReveal();

        const scrollCalls = spy.mock.calls.filter(c => c[0] === 'scroll');
        const loadCalls = spy.mock.calls.filter(c => c[0] === 'load');

        expect(scrollCalls.length).toBe(1);
        expect(loadCalls.length).toBe(1);
    });

    test('returns the reveal handler function', () => {
        const handler = initReveal();
        expect(typeof handler).toBe('function');
    });

    test('passes elementVisible to the created handler', () => {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);

        jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top: 500 });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        // With default (100): 500 < 668 => true
        const handler = initReveal(100);
        handler();
        expect(el.classList.contains('active')).toBe(true);

        document.body.innerHTML = '';
    });
});
