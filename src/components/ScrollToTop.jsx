import React, { useEffect, useState } from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const progressPath = document.querySelector('.progress-wrap path')
    if (!progressPath) return

    const pathLength = progressPath.getTotalLength()
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none'
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength
    progressPath.style.strokeDashoffset = pathLength
    progressPath.getBoundingClientRect()
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear'

    const updateProgress = () => {
      const scroll = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = pathLength - (scroll * pathLength / height)
      progressPath.style.strokeDashoffset = progress
    }

    const handleScroll = () => {
      updateProgress()
      if (window.scrollY > 150) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    updateProgress()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div 
      className={`progress-wrap cursor-pointer ${isVisible ? 'active-progress' : ''}`}
      onClick={scrollToTop}
    >
      <i className="ri-arrow-up-s-line"></i>
      <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>
      </svg>
    </div>
  )
}

export default ScrollToTop