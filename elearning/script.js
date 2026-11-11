document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15 });
    revealElements.forEach(element => observer.observe(element));

    const tabItems = [...document.querySelectorAll('.tab-item')];
    const tabContents = [...document.querySelectorAll('.tab-content')];
    const tabList = document.querySelector('.lms-sidebar-left');

    if (tabList) {
        tabList.setAttribute('role', 'tablist');
        tabList.setAttribute('aria-label', 'LMS feature modules');
    }

    tabItems.forEach((item, index) => {
        const tabId = item.dataset.tab;
        item.id = `elearning-${tabId}-tab`;
        item.setAttribute('role', 'tab');
        item.setAttribute('aria-controls', tabId);
        item.setAttribute('aria-selected', String(item.classList.contains('active')));
        item.tabIndex = item.classList.contains('active') ? 0 : -1;
        item.addEventListener('click', () => switchToTab(tabId));
        item.addEventListener('keydown', event => {
            let nextIndex;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % tabItems.length;
            else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + tabItems.length) % tabItems.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = tabItems.length - 1;
            else return;

            event.preventDefault();
            const nextTab = tabItems[nextIndex];
            switchToTab(nextTab.dataset.tab);
            nextTab.focus();
        });
    });

    function switchToTab(targetId) {
        const selectedTab = tabItems.find(item => item.dataset.tab === targetId);
        const selectedContent = tabContents.find(content => content.id === targetId);
        if (!selectedTab || !selectedContent) return;

        tabItems.forEach(item => {
            const selected = item === selectedTab;
            item.classList.toggle('active', selected);
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
        });
        tabContents.forEach(content => {
            const selected = content === selectedContent;
            content.classList.toggle('active', selected);
            content.setAttribute('aria-labelledby', selectedTab.id);
            content.setAttribute('role', 'tabpanel');
            content.hidden = !selected;
        });
    }

    const initialTab = tabItems.find(item => item.classList.contains('active')) || tabItems[0];
    if (initialTab) switchToTab(initialTab.dataset.tab);

    document.querySelectorAll('.btn-next-tab, .btn-prev-tab').forEach(button => {
        button.addEventListener('click', () => switchToTab(button.dataset.target));
    });

    const modal = document.getElementById('featureModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtag = document.getElementById('modalSubtag');
    const modalPreview = document.getElementById('modalScreenPreview');
    const modalThumbnails = document.getElementById('modalThumbnailsStrip');
    const closeButton = document.getElementById('modalCloseBtn');
    const previousButton = document.getElementById('modalNavLeft');
    const nextButton = document.getElementById('modalNavRight');
    let activeCards = [];
    let activeCardIndex = 0;
    let opener = null;

    const renderFeature = index => {
        if (!activeCards.length) return;
        activeCardIndex = (index + activeCards.length) % activeCards.length;
        const card = activeCards[activeCardIndex];
        const tabContent = card.closest('.tab-content');
        const cardTitle = card.querySelector('h4')?.textContent?.trim() || 'LMS feature';
        const cardNumber = card.querySelector('.card-num')?.textContent?.trim() || '';
        const moduleTitle = tabContent?.querySelector('.sub-link')?.textContent?.trim() || 'LMS feature';

        modalTitle.textContent = cardTitle;
        modalSubtag.textContent = `${moduleTitle}${cardNumber ? ` · Feature ${cardNumber}` : ''}`;
        modalPreview.replaceChildren(card.querySelector('.card-thumb').cloneNode(true));
        modalThumbnails.replaceChildren(...activeCards.map((featureCard, thumbnailIndex) => {
            const thumbnail = document.createElement('button');
            thumbnail.type = 'button';
            thumbnail.className = `modal-thumb-item${thumbnailIndex === activeCardIndex ? ' active' : ''}`;
            thumbnail.setAttribute('aria-label', `View ${featureCard.querySelector('h4')?.textContent?.trim() || 'feature'}`);
            thumbnail.textContent = featureCard.querySelector('.card-num')?.textContent?.trim() || String(thumbnailIndex + 1);
            thumbnail.addEventListener('click', () => renderFeature(thumbnailIndex));
            return thumbnail;
        }));
    };

    const closeModal = () => {
        if (!modal?.classList.contains('active')) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        opener?.focus();
    };

    const openModal = card => {
        if (!modal || !modalTitle || !modalPreview || !modalThumbnails) return;
        activeCards = [...card.closest('.tab-content').querySelectorAll('.clickable-feature')];
        opener = card;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderFeature(activeCards.indexOf(card));
        closeButton?.focus();
    };

    document.querySelectorAll('.clickable-feature').forEach(card => {
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(card);
            }
        });
    });

    closeButton?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
    previousButton?.addEventListener('click', () => renderFeature(activeCardIndex - 1));
    nextButton?.addEventListener('click', () => renderFeature(activeCardIndex + 1));
    document.addEventListener('keydown', event => {
        if (!modal?.classList.contains('active')) return;
        if (event.key === 'Escape') closeModal();
        if (event.key === 'ArrowLeft') renderFeature(activeCardIndex - 1);
        if (event.key === 'ArrowRight') renderFeature(activeCardIndex + 1);
    });

    const boxes = [...document.querySelectorAll('.d-box')];
    const diverseSection = document.querySelector('.diverse-section');
    let dropdownMeasureFrame = 0;
    const updateDropdownClearance = () => {
        if (!diverseSection) return;
        cancelAnimationFrame(dropdownMeasureFrame);
        dropdownMeasureFrame = requestAnimationFrame(() => {
            const openBox = boxes.find(box =>
                box.matches(':hover, :focus-within, .active-box') &&
                getComputedStyle(box.querySelector('.hover-dropdown')).display !== 'none'
            );
            if (!openBox) {
                diverseSection.style.removeProperty('--dropdown-clearance');
                return;
            }

            const sectionBottom = diverseSection.getBoundingClientRect().bottom;
            const panelBottom = openBox.querySelector('.hover-dropdown').getBoundingClientRect().bottom;
            const clearance = Math.max(0, Math.ceil(panelBottom - sectionBottom + 24));
            diverseSection.style.setProperty('--dropdown-clearance', `${clearance}px`);
        });
    };

    const closeBoxes = except => {
        boxes.forEach(box => {
            if (box === except) return;
            box.classList.remove('active-box');
            box.setAttribute('aria-expanded', 'false');
        });
    };

    boxes.forEach(box => {
        box.setAttribute('role', 'button');
        box.tabIndex = 0;
        box.setAttribute('aria-expanded', 'false');

        box.addEventListener('click', event => {
            if (event.target.closest('a, button')) return;
            const isOpen = box.classList.contains('active-box');
            closeBoxes(box);
            box.classList.toggle('active-box', !isOpen);
            box.setAttribute('aria-expanded', String(!isOpen));
            updateDropdownClearance();
        });

        box.addEventListener('keydown', event => {
            if (event.target !== box || (event.key !== 'Enter' && event.key !== ' ')) return;
            event.preventDefault();
            box.click();
        });

        box.addEventListener('mouseenter', updateDropdownClearance);
        box.addEventListener('focusin', updateDropdownClearance);
        box.addEventListener('mouseleave', () => {
            if (box.matches(':focus-within')) return;
            box.classList.remove('active-box');
            box.setAttribute('aria-expanded', 'false');
            updateDropdownClearance();
        });
        box.addEventListener('focusout', event => {
            if (box.contains(event.relatedTarget)) return;
            updateDropdownClearance();
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.d-box')) {
            closeBoxes();
            updateDropdownClearance();
        }
    });
    window.addEventListener('resize', updateDropdownClearance);
});
