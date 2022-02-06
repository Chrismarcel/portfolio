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

const deviceWidth = window.innerWidth
const isMobileDevice = deviceWidth <= 768

//  Define vertical paddings for each section
// To improve this, we might need to calculate the padding via getBoundingClientRect
const SECTIONS_PADDING_Y = {
  DESKTOP: 80,
  MOBILE: 25
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
  threshold: 0
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const {
      target: { previousElementSibling: prevSection }
    } = entry

    if (entry.isIntersecting) {
      if (prevSection.id === SECTIONS.PROFILE) {
        const sectionPaddingY = isMobileDevice ? SECTIONS_PADDING_Y.MOBILE : SECTIONS_PADDING_Y.DESKTOP
        // We need to add the bottom padding of the previous section and the top padding of the intersecting section
        // The offset is required to prevent jumpy effect when latching occurs
        const offsetTop = prevSection.offsetHeight - window.innerHeight + sectionPaddingY * 2
        prevSection.style.top = `-${offsetTop}px`
      }

      if (prevSection.dataset.latched) {
        prevSection.dataset.latched = true
      }
    } else {
      prevSection.dataset.latched = false
      if (prevSection.id === SECTIONS.PROFILE) {
        prevSection.style.top = `0px`
      }
    }
  })
}, observerOptions)

getNodesList('[data-latched]').forEach(targetSection => {
  observer.observe(targetSection)
})
// End Section latching implementation

// Handle navigation bar transition on scroll
const handleNavbarOnScroll = () => {
  const offset = isMobileDevice ? 0.08 : 0.7
  if (window.scrollY >= offset * window.innerHeight) {
    selectElement('.nav').classList.add('sticky-nav')
  } else {
    selectElement('.nav').classList.remove('sticky-nav')
  }
}

window.onscroll = () => {
  handleNavbarOnScroll()
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

const applyTabTransform = ({ index, tabWrapper, parentNode }) => {
  let transform = `translateY(${index * 50}px)`
  const tabIndicator = selectElement(`${tabWrapper} .tab__indicator`)

  if (isMobileDevice) {
    const tabWidth = parentNode.offsetWidth
    tabIndicator.style.width = `${tabWidth}px`
    transform = `translateX(${index * tabWidth}px)`
  }

  tabIndicator.style.transform = `${transform}`
}

const onTabItemClick = ({ element, index, nodeList, tabsWrapper }) => {
  tabState.selectedTab = element.target.dataset.tab
  element.target.setAttribute('aria-selected', true)
  resetItemAtrribute({
    targetNode: element.target,
    nodeList,
    value: false,
    attribute: 'aria-selected'
  })

  element.target.setAttribute('data-active', true)
  resetItemAtrribute({
    targetNode: element.target,
    nodeList,
    value: false,
    attribute: 'data-active'
  })

  const parentNode = element.target.parentNode
  parentNode.setAttribute('data-active', true)
  resetItemAtrribute({
    targetNode: parentNode,
    nodeList: getNodesList('.tab__item'),
    value: false,
    attribute: 'data-active'
  })

  const tabWrapper = `[data-tabs='${tabsWrapper}']`
  const selectedTab = tabState.selectedTab
  const activeTabNode = selectElement(`${tabWrapper} .tab__content#${selectedTab}`)
  activeTabNode.setAttribute('data-active', true)

  resetItemAtrribute({
    nodeList: getNodesList(`${tabWrapper} .tab__content`),
    targetNode: activeTabNode,
    value: false,
    attribute: 'data-active'
  })

  applyTabTransform({ index, tabWrapper, parentNode })
}

getNodesList('.tabs__experience .tab__btn').forEach((tabItem, index, nodeList) =>
  tabItem.addEventListener('click', e => onTabItemClick({ element: e, index, nodeList, tabsWrapper: 'experiences-tabs' }))
)

getNodesList('.tabs__tools .tab__btn').forEach((tabItem, index, nodeList) => {
  tabItem.addEventListener('click', e => {
    if (isMobileDevice) {
      window.scrollTo(0, 1800)
    }
    onTabItemClick({ element: e, index, nodeList, tabsWrapper: 'tools-tabs' })
  })
})

const applyMobileAnimations = () => {
  // Replace profile picture animation
  const profileImageElement = selectElement('.profile__image')
  profileImageElement.classList.add('aos-animate')
  profileImageElement.dataset.aosDelay = 2600

  const heroCTABtn = selectElement('.hero-cta')
  heroCTABtn.classList.add('aos-animate')

  selectElement('.profile__bio').dataset.aosDelay = 1100
  selectElement('.profile__links').dataset.aosDelay = 200
  selectElement('.profile__links').dataset.aosOffset = 10
  selectElement('.download-resume').dataset.aosDelay = 400
  selectElement('.tabs__experience').dataset.aosDelay = 1100
  selectElement('#tools-experience-header').dataset.aosDelay = 500
  selectElement('#tools-experience-header').dataset.aosOffset = 10
  selectElement('.tabs__tools').dataset.aosDelay = 300

  getNodesList('.project__img-card').forEach(node => (node.dataset.aosDelay = 800))
}

window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden'
  if (isMobileDevice) {
    applyMobileAnimations()
  }
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
