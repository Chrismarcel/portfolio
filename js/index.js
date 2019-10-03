'use strict';

const selectAllElements = document.querySelectorAll.bind(document);
const selectElement = document.querySelector.bind(document);
const getElementNodes = (nodes) => Array.from(selectAllElements(nodes));

// Handle section latching using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const {
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
            if (prevSection.nodeName.toLowerCase() === 'section') {
                prevSection.style.top = '100vh';
            }
        }
    });
}, observerOptions);

getElementNodes('section').forEach(targetSection => {
    observer.observe(targetSection);
});
// End Section Latching implementation

// Remove smooth scroll when Contact button/link is clicked
getElementNodes('a[href="#contact"]').forEach(node => {
    node.addEventListener('click', () => {
        document.documentElement.style.scrollBehavior = 'auto';
    });
})
