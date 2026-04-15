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

    // MutationObserver re-observes .reveal elements injected by the SPA renderer
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    observeElements();
});
