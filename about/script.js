// Main JavaScript for KoolSoft Landing Page

document.addEventListener('DOMContentLoaded', () => {
    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

AOS.init({
            once: false,
            mirror: true
        });

document.addEventListener('DOMContentLoaded', () => {
    const achievementsSection = document.querySelector('.achievements-section');
    const stats = [...document.querySelectorAll('.stat-number')];

    if (!achievementsSection || stats.length === 0) return;

    const counters = stats.map(stat => {
        const targetText = stat.textContent.trim();
        const target = Number.parseInt(targetText, 10);
        const suffix = targetText.replace(/^\d+/, '');

        if (!Number.isFinite(target)) {
            throw new Error(`Invalid achievement counter value: ${targetText}`);
        }

        stat.textContent = `0${suffix}`;
        return { element: stat, target, suffix };
    });

    let hasStarted = false;

    const animateCounters = () => {
        if (hasStarted) return;
        hasStarted = true;

        const duration = 1400;
        let startedAt;

        function update(now) {
            if (startedAt === undefined) startedAt = now;
            const progress = Math.min((now - startedAt) / duration, 1);
            const easedProgress = 1 - (1 - progress) ** 3;

            counters.forEach(({ element, target, suffix }) => {
                element.textContent = `${Math.floor(target * easedProgress)}${suffix}`;
            });

            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    };

    const checkVisibility = () => {
        const bounds = achievementsSection.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.85 && bounds.bottom > 0) {
            window.removeEventListener('scroll', checkVisibility);
            animateCounters();
        }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();
});
