'use strict'

const selectAllElements = document.querySelectorAll.bind(document)
const selectElement = document.querySelector.bind(document)
const getNodesList = nodes => Array.from(selectAllElements(nodes))

const SECTIONS = {
  HERO: 'hero',
  PROFILE: 'profile',
  PROJECTS: 'projects',
  CONTACT: 'contact'
}

const getSectionHeight = section => {
  return selectElement(`#${section}`).offsetHeight
}

// Handle hamburger menu toggle
selectElement('.hamburger').addEventListener('click', function() {
  const menuIsOpen = this.dataset.menu === 'open'
  if (menuIsOpen) {
    this.dataset.menu = 'close'
    document.body.style.overflow = 'auto'
  } else {
    this.dataset.menu = 'open'
    document.body.style.overflow = 'hidden'
  }
})

selectElement('.nav__menu').addEventListener('click', function() {
  this.previousElementSibling.dataset.menu = 'close'
  document.body.style.overflow = 'scroll'
})

// Update copyright year
const copyrightYear = document.createTextNode(new Date().getFullYear())
selectElement('.credits').appendChild(copyrightYear)

// Handle section latching feature using Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.005,
  delay: 100
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const {
      target: { previousElementSibling: prevSection }
    } = entry

    if (entry.isIntersecting) {
      console.log(entry)
      if (prevSection.nodeName.toLowerCase() === 'section') {
        prevSection.classList.add('latched')
      }
    } else {
      prevSection.classList.remove('latched')
    }
  })
}, observerOptions)

getNodesList('section').forEach(targetSection => {
  observer.observe(targetSection)
})
// End Section latching implementation

// Handle navigation bar transition on scroll
window.onscroll = () => {
  if (window.scrollY >= 0.7 * window.innerHeight) {
    selectElement('.nav').classList.add('sticky-nav')
  } else {
    selectElement('.nav').classList.remove('sticky-nav')
  }
}

// Work Experience & Skillst Tab implementation
const tabState = {
  selectedTab: 'tab-1'
}

const resetItemAtrribute = ({ targetNode, nodeList, attribute, value }) => {
  nodeList.forEach(item => {
    if (item != targetNode) {
      item.setAttribute(attribute, value)
    }
  })
}

const onTabItemClick = (e, nodeList, tabsWrapper) => {
  tabState.selectedTab = e.target.dataset.tab
  e.target.setAttribute('aria-selected', true)
  resetItemAtrribute({
    targetNode: e.target,
    nodeList,
    value: false,
    attribute: 'aria-selected'
  })

  e.target.setAttribute('data-active', true)
  resetItemAtrribute({
    targetNode: e.target,
    nodeList,
    value: false,
    attribute: 'data-active'
  })

  e.target.parentNode.setAttribute('data-active', true)
  resetItemAtrribute({
    targetNode: e.target.parentNode,
    nodeList: getNodesList('.tab__item'),
    value: false,
    attribute: 'data-active'
  })

  const selectedTab = tabState.selectedTab
  const activeTabNode = selectElement(`[data-tabs='${tabsWrapper}'] .tab__content#${selectedTab}`)
  activeTabNode.setAttribute('data-active', true)

  resetItemAtrribute({
    nodeList: getNodesList(`[data-tabs='${tabsWrapper}'] .tab__content`),
    targetNode: activeTabNode,
    value: false,
    attribute: 'data-active'
  })
}

getNodesList('.tabs__experience .tab__btn').forEach((tabItem, _, nodeList) =>
  tabItem.addEventListener('click', e => onTabItemClick(e, nodeList, 'experiences-tabs'))
)

getNodesList('.tabs__tools .tab__btn').forEach((tabItem, _, nodeList) =>
  tabItem.addEventListener('click', e => onTabItemClick(e, nodeList, 'tools-tabs'))
)

window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden'
  new Promise(resolve => {
    setTimeout(() => {
      selectElement('#preloader').classList.add('done')
      document.body.style.overflow = 'scroll'
      resolve()
    }, 1600)
  }).then(() => {
    // remove preloader node 1s after preloader is done
    setTimeout(() => selectElement('#preloader').remove(), 1000)
  })

  const sectionOffsetTop = {
    [SECTIONS.HERO]: 0,
    [SECTIONS.PROFILE]: getSectionHeight(SECTIONS.HERO),
    [SECTIONS.PROJECTS]: getSectionHeight(SECTIONS.HERO) + getSectionHeight(SECTIONS.PROFILE),
    [SECTIONS.CONTACT]: getSectionHeight(SECTIONS.HERO) + getSectionHeight(SECTIONS.PROFILE) + getSectionHeight(SECTIONS.PROJECTS)
  }

  // Scroll to section on nav link click
  getNodesList('a.nav__link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const targetSection = e.target.dataset.section
      const offsetTop = sectionOffsetTop[targetSection]

      window.scrollTo(0, offsetTop)
    })
  })
})
