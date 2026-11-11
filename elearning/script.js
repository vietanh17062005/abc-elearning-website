document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));

    // LMS Tabs
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    function switchToTab(targetId) {
        tabItems.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === targetId));
        tabContents.forEach(c => c.classList.toggle('active', c.id === targetId));
    }

    tabItems.forEach(item => {
        item.addEventListener('click', () => switchToTab(item.getAttribute('data-tab')));
    });

    // Diverse Features Hover & Click Handler (Bulletproof JS)
    const dBoxes = document.querySelectorAll('.d-box');
    dBoxes.forEach(box => {
        const dropdown = box.querySelector('.hover-dropdown');
        if (!dropdown) return;

        // Ensure absolute positioning and high z-index
        dropdown.style.display = 'none';

        box.addEventListener('mouseenter', () => {
            dBoxes.forEach(b => {
                const drop = b.querySelector('.hover-dropdown');
                if (drop) drop.style.display = 'none';
            });
            dropdown.style.display = 'block';
        });

        box.addEventListener('mouseleave', () => {
            dropdown.style.display = 'none';
        });

        box.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = dropdown.style.display === 'block';
            dBoxes.forEach(b => {
                const drop = b.querySelector('.hover-dropdown');
                if (drop) drop.style.display = 'none';
            });
            dropdown.style.display = isVisible ? 'none' : 'block';
        });
    });

    document.addEventListener('click', () => {
        dBoxes.forEach(b => {
            const drop = b.querySelector('.hover-dropdown');
            if (drop) drop.style.display = 'none';
        });
    });
});
