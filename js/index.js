'use strict';

const selectAllElements = document.querySelectorAll.bind(document);
const selectElement = document.querySelector.bind(document);
const getElementNodes = (nodes) => Array.from(selectAllElements(nodes));

// Remove smooth scroll when Contact button/link is clicked
getElementNodes('a[href="#contact"]').forEach(node => {
    node.addEventListener('click', () => {
        document.documentElement.style.scrollBehavior = 'auto';
    });
});

// Handle hamburger menu toggle
selectElement('.hamburger').addEventListener('click', function() {
    const menuIsOpen = this.dataset.menu === 'open';
    if (menuIsOpen) {
        this.dataset.menu = 'close';
        document.body.style.overflow = 'auto';
    } else {
        this.dataset.menu = 'open';
        document.body.style.overflow = 'hidden';
    }
});

selectElement('.nav__menu').addEventListener('click', function() {
    this.previousElementSibling.dataset.menu = 'close';
    document.body.style.overflow = 'scroll';
});


// Update copyright year
const copyrightYear = document.createTextNode(new Date().getFullYear());
selectElement('.credits').appendChild(copyrightYear);

// Handle section latching feature using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05,
    delay: 100
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
            const offsetTop = viewportHeight - sectionHeight - (0.05 * viewportHeight);
            
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
// End Section latching implementation
