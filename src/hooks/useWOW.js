import { useEffect } from 'react'

const useWOW = () => {
  useEffect(() => {
    // Dynamically import WOW.js
    const loadWOW = async () => {
      try {
        const WOW = (await import('wow.js')).default
        const wow = new WOW({
          boxClass: 'wow',
          animateClass: 'animated',
          offset: 0,
          mobile: false,
          live: true
        })
        wow.init()
      } catch (error) {
        console.log('WOW.js not loaded:', error)
      }
    }

    loadWOW()
  }, [])
}

export default useWOW