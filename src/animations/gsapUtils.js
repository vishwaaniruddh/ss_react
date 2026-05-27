import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Creates a parallax scroll effect on an element
 */
export function createParallax(element, speed = 0.5, options = {}) {
  return gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger || element,
      start: options.start || 'top bottom',
      end: options.end || 'bottom top',
      scrub: options.scrub || 1,
      ...options.scrollTriggerOptions,
    },
  })
}

/**
 * Creates a scroll-triggered fade-in animation
 */
export function createScrollReveal(elements, options = {}) {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: options.y || 60,
      ...(options.fromVars || {}),
    },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 1,
      stagger: options.stagger || 0.15,
      ease: options.ease || 'power3.out',
      scrollTrigger: {
        trigger: options.trigger || elements,
        start: options.start || 'top 85%',
        end: options.end || 'top 20%',
        toggleActions: 'play none none reverse',
        ...options.scrollTriggerOptions,
      },
    }
  )
}

/**
 * Creates a horizontal scroll pin effect (for timeline sections)
 */
export function createHorizontalScroll(container, panels, options = {}) {
  const totalWidth = panels.length * 100
  return gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: options.scrub || 1,
      end: () => `+=${totalWidth}%`,
      ...options.scrollTriggerOptions,
    },
  })
}

/**
 * Creates a split text animation effect
 */
export function createTextReveal(element, options = {}) {
  const text = element.textContent
  const chars = text.split('')
  element.textContent = ''
  element.style.display = 'inline'

  chars.forEach((char) => {
    const span = document.createElement('span')
    span.textContent = char === ' ' ? '\u00A0' : char
    span.style.display = 'inline-block'
    span.style.opacity = '0'
    span.style.transform = 'translateY(40px)'
    element.appendChild(span)
  })

  return gsap.to(element.children, {
    opacity: 1,
    y: 0,
    duration: options.duration || 0.6,
    stagger: options.stagger || 0.02,
    ease: options.ease || 'power3.out',
    scrollTrigger: options.scrollTrigger || {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  })
}

/**
 * Creates a magnetic button effect
 */
export function createMagneticEffect(element, strength = 0.3) {
  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    })
  }

  element.addEventListener('mousemove', handleMouseMove)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Creates a smooth counter animation
 */
export function createCounter(element, endValue, options = {}) {
  return gsap.to(element, {
    textContent: endValue,
    duration: options.duration || 2,
    ease: options.ease || 'power1.inOut',
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })
}

/**
 * Refresh ScrollTrigger instances (call after dynamic content loads)
 */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh()
}

/**
 * Kill all ScrollTrigger instances
 */
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}
