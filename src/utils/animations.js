import { gsap } from 'gsap'

// Preloader animation
export const preloaderAnimation = () => {
  const svg = document.getElementById("preloaderSvg")
  if (!svg) return

  const tl = gsap.timeline()
  const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z"
  const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z"

  tl.to(".preloader-heading .load-text , .preloader-heading .cont", {
    delay: 1.5,
    y: -100,
    opacity: 0,
  })
  tl.to(svg, {
    duration: 0.5,
    attr: {
      d: curve
    },
    ease: "power2.easeIn",
  }).to(svg, {
    duration: 0.5,
    attr: {
      d: flat
    },
    ease: "power2.easeOut",
  })
  tl.to(".preloader", {
    y: -1500,
  })
  tl.to(".preloader", {
    zIndex: -1,
    display: "none",
  })
}

// Custom cursor animation
export const initCustomCursor = () => {
  const cursorBall = document.getElementById('ball')
  if (!cursorBall) return

  const handleMouseMove = (e) => {
    gsap.to(cursorBall, {
      duration: 0.3,
      x: e.clientX,
      y: e.clientY,
      opacity: 1,
      ease: 'power2.out'
    })
  }

  const hoverElements = document.querySelectorAll('a')
  
  const handleMouseEnter = () => {
    cursorBall.classList.add('hovered')
    gsap.to(cursorBall, {
      duration: 0.3,
      scale: 2,
      opacity: 0,
      ease: 0.1
    })
  }

  const handleMouseLeave = () => {
    cursorBall.classList.remove('hovered')
    gsap.to(cursorBall, {
      duration: 0.3,
      scale: 1,
      opacity: 1,
      ease: 'power2.out'
    })
  }

  document.addEventListener('mousemove', handleMouseMove)
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
  })

  return () => {
    document.removeEventListener('mousemove', handleMouseMove)
    hoverElements.forEach(element => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    })
  }
}

// Counter animation
export const initCounterAnimation = () => {
  const counterElements = document.querySelectorAll('.counter-text-wrap')
  
  counterElements.forEach(element => {
    const countText = element.querySelector('.count-text')
    if (!countText) return

    const finalValue = parseInt(countText.getAttribute('data-stop'))
    const speed = parseInt(countText.getAttribute('data-speed')) || 2000

    gsap.to({ value: 0 }, {
      value: finalValue,
      duration: speed / 1000,
      ease: "power2.out",
      onUpdate: function() {
        countText.textContent = Math.floor(this.targets()[0].value)
      },
      onComplete: function() {
        countText.textContent = finalValue
      }
    })
  })
}