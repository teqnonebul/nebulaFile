/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

function loadHTML(filename) {
    const html = fs.readFileSync(path.resolve(__dirname, '..', filename), 'utf-8');
    // Extract lang attribute from <html> tag
    const langMatch = html.match(/<html[^>]*\slang="([^"]*)"/);
    if (langMatch) {
        document.documentElement.setAttribute('lang', langMatch[1]);
    }
    document.documentElement.innerHTML = html.replace(/<\/?html[^>]*>/gi, '').replace(/<!DOCTYPE html>/i, '');
    return document;
}

describe('index.html (Japanese page)', () => {
    beforeAll(() => {
        loadHTML('index.html');
    });

    test('has correct lang attribute', () => {
        const html = document.querySelector('html');
        expect(html.getAttribute('lang')).toBe('ja');
    });

    test('has a title element with "nebulaFile"', () => {
        const title = document.querySelector('title');
        expect(title).not.toBeNull();
        expect(title.textContent).toContain('nebulaFile');
    });

    test('has a meta description', () => {
        const meta = document.querySelector('meta[name="description"]');
        expect(meta).not.toBeNull();
        expect(meta.getAttribute('content').length).toBeGreaterThan(0);
    });

    test('has a viewport meta tag', () => {
        const meta = document.querySelector('meta[name="viewport"]');
        expect(meta).not.toBeNull();
        expect(meta.getAttribute('content')).toContain('width=device-width');
    });

    test('has a navbar with id "navbar"', () => {
        const navbar = document.getElementById('navbar');
        expect(navbar).not.toBeNull();
        expect(navbar.tagName.toLowerCase()).toBe('nav');
    });

    test('navbar contains brand logo', () => {
        const logo = document.querySelector('#navbar .brand .logo-icon');
        expect(logo).not.toBeNull();
        expect(logo.getAttribute('alt')).toBe('nebulaFile');
    });

    test('navbar contains navigation links', () => {
        const links = document.querySelectorAll('#navbar .nav-links a');
        expect(links.length).toBeGreaterThanOrEqual(3);
    });

    test('has a language switch link to English version', () => {
        const langSwitch = document.querySelector('.lang-switch');
        expect(langSwitch).not.toBeNull();
        expect(langSwitch.getAttribute('href')).toBe('index_en.html');
    });

    test('has a hero section with CTA buttons', () => {
        const hero = document.querySelector('.hero');
        expect(hero).not.toBeNull();
        const ctaButtons = hero.querySelectorAll('.hero-cta .btn');
        expect(ctaButtons.length).toBeGreaterThanOrEqual(2);
    });

    test('has a features section', () => {
        const features = document.getElementById('features');
        expect(features).not.toBeNull();
    });

    test('features section contains feature cards', () => {
        const cards = document.querySelectorAll('#features .feature-card');
        expect(cards.length).toBe(5);
    });

    test('each feature card has a heading and description', () => {
        const cards = document.querySelectorAll('#features .feature-card');
        cards.forEach(card => {
            expect(card.querySelector('h3')).not.toBeNull();
            expect(card.querySelector('p')).not.toBeNull();
        });
    });

    test('has a video section', () => {
        const video = document.getElementById('video');
        expect(video).not.toBeNull();
    });

    test('video section contains slideshow images', () => {
        const images = document.querySelectorAll('#video .slideshow-img');
        expect(images.length).toBe(3);
    });

    test('has a download/pricing section', () => {
        const download = document.getElementById('download');
        expect(download).not.toBeNull();
    });

    test('download section has purchase and trial buttons', () => {
        const buttons = document.querySelectorAll('#download .btn');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    test('trial download link points to GitHub releases', () => {
        const trialBtn = document.querySelector('#download .btn-secondary');
        expect(trialBtn).not.toBeNull();
        expect(trialBtn.getAttribute('href')).toContain('github.com/teqnonebul/nebulaFile/releases');
    });

    test('has a footer with copyright notice', () => {
        const footer = document.querySelector('footer');
        expect(footer).not.toBeNull();
        expect(footer.textContent).toContain('© 2025 nebulaFile Project');
    });

    test('has a demo video section', () => {
        const demo = document.getElementById('demo');
        expect(demo).not.toBeNull();
        const video = demo.querySelector('video');
        expect(video).not.toBeNull();
    });

    test('has reveal elements for scroll animation', () => {
        const reveals = document.querySelectorAll('.reveal');
        expect(reveals.length).toBeGreaterThan(0);
    });

    test('loads navbar.js and reveal.js scripts', () => {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const srcs = scripts.map(s => s.getAttribute('src'));
        expect(srcs).toContain('js/navbar.js');
        expect(srcs).toContain('js/reveal.js');
    });

    test('format tags list supported file types', () => {
        const tags = document.querySelectorAll('.format-tag');
        expect(tags.length).toBeGreaterThanOrEqual(7);
        const formats = Array.from(tags).map(t => t.textContent.trim());
        expect(formats).toContain('PSD');
        expect(formats).toContain('AI');
    });

    test('nebula background elements exist', () => {
        const bg = document.querySelector('.nebula-bg');
        expect(bg).not.toBeNull();
        const globes = bg.querySelectorAll('.nebula-globe');
        expect(globes.length).toBe(3);
    });
});

describe('index_en.html (English page)', () => {
    beforeAll(() => {
        loadHTML('index_en.html');
    });

    test('has correct lang attribute', () => {
        const html = document.querySelector('html');
        expect(html.getAttribute('lang')).toBe('en');
    });

    test('has a title element with "nebulaFile"', () => {
        const title = document.querySelector('title');
        expect(title).not.toBeNull();
        expect(title.textContent).toContain('nebulaFile');
    });

    test('has a meta description in English', () => {
        const meta = document.querySelector('meta[name="description"]');
        expect(meta).not.toBeNull();
        expect(meta.getAttribute('content')).toContain('File Manager');
    });

    test('has a language switch link to Japanese version', () => {
        const langSwitch = document.querySelector('.lang-switch');
        expect(langSwitch).not.toBeNull();
        expect(langSwitch.getAttribute('href')).toBe('index.html');
    });

    test('has a navbar with id "navbar"', () => {
        const navbar = document.getElementById('navbar');
        expect(navbar).not.toBeNull();
    });

    test('has a hero section with English CTA text', () => {
        const hero = document.querySelector('.hero');
        expect(hero).not.toBeNull();
        const ctaText = hero.textContent;
        expect(ctaText).toContain('Get Early Access');
    });

    test('features section contains 5 feature cards', () => {
        const cards = document.querySelectorAll('#features .feature-card');
        expect(cards.length).toBe(5);
    });

    test('feature cards contain expected features', () => {
        const headings = Array.from(document.querySelectorAll('#features .feature-card h3'))
            .map(h => h.textContent.trim());
        expect(headings).toContain('Nebula Look');
        expect(headings).toContain('Video Trim');
        expect(headings).toContain('Split View');
        expect(headings).toContain('Personalize');
        expect(headings).toContain('Batch Rename');
    });

    test('pricing section shows USD pricing', () => {
        const download = document.getElementById('download');
        expect(download).not.toBeNull();
        expect(download.textContent).toContain('$15.99');
    });

    test('has an itch.io purchase link', () => {
        const link = document.querySelector('#download .btn-primary');
        expect(link).not.toBeNull();
        expect(link.getAttribute('href')).toContain('itch.io');
    });

    test('trial download link points to GitHub releases', () => {
        const trialBtn = document.querySelector('#download .btn-secondary');
        expect(trialBtn).not.toBeNull();
        expect(trialBtn.getAttribute('href')).toContain('github.com/teqnonebul/nebulaFile/releases');
    });

    test('has a footer with copyright notice', () => {
        const footer = document.querySelector('footer');
        expect(footer).not.toBeNull();
        expect(footer.textContent).toContain('© 2025 nebulaFile Project');
    });

    test('has a demo video section', () => {
        const demo = document.getElementById('demo');
        expect(demo).not.toBeNull();
    });

    test('loads navbar.js and reveal.js scripts', () => {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const srcs = scripts.map(s => s.getAttribute('src'));
        expect(srcs).toContain('js/navbar.js');
        expect(srcs).toContain('js/reveal.js');
    });

    test('has reveal elements for scroll animation', () => {
        const reveals = document.querySelectorAll('.reveal');
        expect(reveals.length).toBeGreaterThan(0);
    });

    test('JP and EN pages have matching structure (same number of sections)', () => {
        const enSections = document.querySelectorAll('section').length;
        const jpHtml = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');
        const parser = new DOMParser();
        // Count section tags in JP HTML
        const jpSectionCount = (jpHtml.match(/<section/g) || []).length;
        expect(enSections).toBe(jpSectionCount);
    });
});
