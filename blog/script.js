/**
 * KoolSoft Blog Module Script
 * Handles loading shared components (header/footer)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load shared header and footer components
    loadSharedComponent('header-container', '../shared/header.html');
    loadSharedComponent('footer-container', '../shared/footer.html');
});

/**
 * Fetches HTML from a file path and injects it into the target container
 * @param {string} containerId - The ID of the HTML element
 * @param {string} filePath - Relative path to the component HTML file
 */
async function loadSharedComponent(containerId, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
                if (containerId === 'header-container') {
                    container.querySelector('[data-page="blog"]')?.classList.add('active');

                    const dropdown = container.querySelector('.dropdown');
                    const toggle = container.querySelector('.dropdown-toggle');
                    if (dropdown && toggle) {
                        toggle.addEventListener('click', () => {
                            const isOpen = dropdown.classList.toggle('open');
                            toggle.setAttribute('aria-expanded', String(isOpen));
                        });

                        document.addEventListener('click', event => {
                            if (!dropdown.contains(event.target)) {
                                dropdown.classList.remove('open');
                                toggle.setAttribute('aria-expanded', 'false');
                            }
                        });

                        document.addEventListener('keydown', event => {
                            if (event.key === 'Escape' && dropdown.classList.contains('open')) {
                                dropdown.classList.remove('open');
                                toggle.setAttribute('aria-expanded', 'false');
                                toggle.focus();
                            }
                        });
                    }
                }
            }
        } else {
            console.warn(`Failed to load shared component from ${filePath}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error fetching shared component from ${filePath}:`, error);
    }
}
