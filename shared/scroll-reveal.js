(() => {
    const revealTargets = document.querySelectorAll([
        'body > section',
        'main section',
        'main > div',
        'main article',
        'main .contact-info-card',
        'main .contact-form-card',
        'main .info-card',
        'main .stat-item',
        'main .faq-static-item',
        'main .vision-item',
        'main .card-box',
        'main .team-text-box',
        'main .team-media-box',
        'main .module-item',
        'main .tab-item',
        'main .mockup-card',
        'main .d-box',
        'main .product-card-box',
        'main .benefits-card-floating',
        'main .benefits-box-main',
        'main .solution-box',
        'main .sec-right-card',
        '.reveal-on-scroll'
    ].join(','));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        revealTargets.forEach(element => element.classList.add('is-in-view'));
        return;
    }

    revealTargets.forEach(element => element.classList.add('scroll-motion'));
    document.documentElement.classList.add('scroll-motion-enabled');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('is-in-view', entry.isIntersecting);
        });
    }, { threshold: 0.05 });

    revealTargets.forEach(element => observer.observe(element));
})();
