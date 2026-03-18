// utils/animations.js

export function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    
    // Use IntersectionObserver for performant scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after reveal so it only happens once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(element => {
        observer.observe(element);
    });
}
