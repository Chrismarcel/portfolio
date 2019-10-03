'use strict';

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
};

const allSections = Array.from(document.querySelectorAll('section'));

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        const { 
            target,
            target: { 
                previousElementSibling: prevSection
            } 
        } = entry;

        if (entry.isIntersecting) {
            const { offsetHeight: sectionHeight } = prevSection;
            const { innerHeight: viewportHeight } = window;
            const offsetTop = viewportHeight - sectionHeight;
            
            if (prevSection.nodeName.toLowerCase() === 'section') {
                prevSection.classList.add('latched');
                prevSection.style.top = `${offsetTop}px`;
            }
        } else {
            prevSection.classList.remove('latched');
            prevSection.style.top = '100vh';
        }
    });
}, observerOptions);

allSections.forEach(targetSection => {
    observer.observe(targetSection);
});
