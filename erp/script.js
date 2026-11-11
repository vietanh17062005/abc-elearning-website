document.addEventListener('DOMContentLoaded', function () {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, {
                threshold: 0.15
            });

            animatedElements.forEach(el => observer.observe(el));

            const modules = document.querySelectorAll('.module-item');
            modules.forEach(module => {
                const toggleModule = () => {
                    const isExpanded = module.getAttribute('aria-expanded') === 'true';
                    modules.forEach(item => {
                        item.classList.remove('active');
                        item.setAttribute('aria-expanded', 'false');
                    });
                    if (!isExpanded) {
                        module.classList.add('active');
                        module.setAttribute('aria-expanded', 'true');
                    }
                };

                module.addEventListener('click', toggleModule);
                module.addEventListener('keydown', event => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        toggleModule();
                    } else if (event.key === ' ') {
                        event.preventDefault();
                    }
                });
                module.addEventListener('keyup', event => {
                    if (event.key === ' ') {
                        toggleModule();
                    }
                });
            });
        });
