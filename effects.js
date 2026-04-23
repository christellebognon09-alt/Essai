document.addEventListener("DOMContentLoaded", () => {
    // Reveal animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(elem => {
        observer.observe(elem);
    });

    // Header scroll effect for home page
    const homeHeader = document.querySelector('.home-header');
    if (homeHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                homeHeader.classList.add('scrolled');
            } else {
                homeHeader.classList.remove('scrolled');
            }
        });
    }
});
