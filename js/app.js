import AppPresenter from './presenters/AppPresenter.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new AppPresenter();
    app.init();

    // Scroll Reveal Observer
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // observer.unobserve(entry.target); // Optional: if we only want it once
            }
        });
    }, observerOptions);

    // Initial and dynamic observation
    const observeElements = () => {
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    // Re-check for elements after content is injected (since it's a SPA)
    const originalRender = AppPresenter.prototype.init; // This is a bit rough, but let's see
    // Better: let the presenter call this or use a MutationObserver
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    observeElements();
});
