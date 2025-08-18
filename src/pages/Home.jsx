import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Preloader from '../components/Preloader'
import ScrollToTop from '../components/ScrollToTop'
import CustomCursor from '../components/CustomCursor'
import HireMe from '../components/HireMe'
import { useVideos, useRecentWorks } from '../hooks/useSupabaseData'
import '../styles/hireme.css'

const Home = () => {
  const videoRef = useRef(null)
  const carouselRef = useRef(null)
  const indexRef = useRef(0)
  
  // Fetch data from Supabase
  const { videos, loading: videosLoading } = useVideos()
  const { recentWorks, getWorksByCategory, loading: worksLoading } = useRecentWorks()

  useEffect(() => {
    // Initialize WOW animations
    if (window.WOW) {
      new window.WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: false,
        live: true
      }).init()
    }

    // Video autoplay on scroll
    const video = videoRef.current
    if (video) {
      let userInteracted = false

      const handleClick = () => {
        userInteracted = true
      }

      document.body.addEventListener("click", handleClick)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().then(() => {
                if (userInteracted) {
                  video.muted = false
                }
              }).catch((e) => {
                console.log("Play failed:", e)
              })
            } else {
              video.pause()
            }
          })
        },
        { threshold: 0.5 }
      )

      observer.observe(video)

      return () => {
        document.body.removeEventListener("click", handleClick)
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    // Modern Blog carousel functionality
    const carousel = carouselRef.current
    if (!carousel) return

    const cards = carousel.querySelectorAll('.modern-blog-card')
    const visibleCards = 2
    const totalCards = cards.length
    const cardWidth = cards[0]?.offsetWidth + 20 || 420

    const updateCarousel = () => {
      const maxIndex = totalCards - visibleCards
      if (indexRef.current > maxIndex) indexRef.current = 0
      if (indexRef.current < 0) indexRef.current = maxIndex
      carousel.style.transform = `translateX(-${indexRef.current * cardWidth}px)`
    }

    const handleRightClick = () => {
      indexRef.current++
      updateCarousel()
    }

    const handleLeftClick = () => {
      indexRef.current--
      updateCarousel()
    }

    const rightBtn = document.querySelector('.blog-next')
    const leftBtn = document.querySelector('.blog-prev')

    if (rightBtn) rightBtn.addEventListener('click', handleRightClick)
    if (leftBtn) leftBtn.addEventListener('click', handleLeftClick)

    // Auto slide
    const autoSlide = setInterval(() => {
      indexRef.current++
      updateCarousel()
    }, 4000)

    return () => {
      if (rightBtn) rightBtn.removeEventListener('click', handleRightClick)
      if (leftBtn) leftBtn.removeEventListener('click', handleLeftClick)
      clearInterval(autoSlide)
    }
  }, [])

  useEffect(() => {
    // Copy logos slide for infinite animation
    const logosSlide = document.querySelector('.logos-slide')
    if (logosSlide && logosSlide.parentNode) {
      const copy = logosSlide.cloneNode(true)
      logosSlide.parentNode.appendChild(copy)
    }
  }, [])

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <CustomCursor />
      <Header />

      <section id="home" className="main-hero-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="hero-content wow fadeInUp text-center delay-0-2s">
                <h2>visual marketer</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 pt-30">
              <div className="hero-content wow fadeInUp delay-0-2s">
                <div className="clienti-reviews">
                  <ul className="clienti-profile">
                    <li><img className="img-fluid" src="/assets/images/avatar/01.jpg" alt="client" /></li>
                    <li><img className="img-fluid" src="/assets/images/avatar/02.jpg" alt="client" /></li>
                    <li><img className="img-fluid" src="/assets/images/avatar/03.jpg" alt="client" /></li>
                  </ul>
                  <div className="reviews">100+ reviews<span>(4.96 of 5)</span>
                    <p>Five-star reviews from my esteemed clients.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <img src="/assets/images/about/me.jpg" alt="" />
              </div>
            </div>
            <div className="col-lg-3 pt-30">
              <div className="hero-content wow fadeInUp delay-0-4s">
                <p>Hi, I'm Abid, a passionate UX Designer dedicated to creating user-friendly digital experiences.</p>
                <a className="theme-btn" href="index.html">Get In touch</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="company-design-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>Company I Worked With</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Work with section */}
      <section id="work-with" className="work-with">
        <div className="logos">
          <div className="logos-slide">
            <img src="/company/afsin.png" alt="" className="afsin" />
            <img src="/company/kitab.png" alt="" className="kitab" />
            <img src="/company/LogoW.png" alt="" className="LogoW" />
            <img src="/company/marchbid.png" alt="" className="marchbid" />
            <img src="/company/Asset 1.png" alt="" className="Asset_1" />
            <img src="/company/Asset 2.png" alt="" className="Asset_2" />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section" id="video-section">
        <div className="video-wrapper">
          {videosLoading ? (
            <div className="video-loading">Loading video...</div>
          ) : videos.length > 0 ? (
            <video
              ref={videoRef}
              id="autoplay-video"
              muted
              playsInline
              controls
              preload="auto"
              poster={videos[0].thumbnail_url || "your-thumbnail.jpg"}
            >
              <source src={videos[0].video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="video-placeholder">No video available</div>
          )}
        </div>
      </section>

      <section className="recentworks">
        <h2>my recent works</h2>
        {worksLoading ? (
          <div className="works-loading">Loading works...</div>
        ) : (
          <div className="work-container">
            {/* Poster Designs */}
            <div className="works t-shirt">
              <Link to="/tshirt">
                <h2>poster design</h2>
              </Link>
              {getWorksByCategory('poster').slice(0, 3).map((work) => (
                <div key={work.id} className="tshirt-item">
                  <img src={work.image_url} alt={work.title} />
                  <h2>{work.title}</h2>
                  <div className="product-item">
                    <p className="item-info">{work.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Editing */}
            <div className="works video-editing">
              <Link to="/tshirt">
                <h2>video-editing</h2>
              </Link>
              {getWorksByCategory('video').slice(0, 3).map((work) => (
                <div key={work.id} className="video-item">
                  <video src={work.image_url} autoPlay muted loop playsInline></video>
                  <h2>{work.title}</h2>
                  <div className="product-item">
                    <p className="item-info">{work.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* T-Shirt Designing */}
            <div className="works designing">
              <Link to="/tshirt">
                <h2>tshirt designing</h2>
              </Link>
              {getWorksByCategory('tshirt').slice(0, 3).map((work) => (
                <div key={work.id} className="logo-item">
                  <img src={work.image_url} alt={work.title} />
                  <h2>{work.title}</h2>
                  <div className="product-item">
                    <p className="item-info">{work.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="testimonials-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="section-title section-black-title wow fadeInUp delay-0-2s">
                <h2>Testimonials</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="testimonial-item wow fadeInUp delay-0-2s">
                <div className="author">
                  <img src="/assets/images/testimonials/author1.jpg" alt="Author" />
                </div>
                <div className="text">Financial planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.</div>
                <div className="testi-des">
                  <h5>Zonathon Doe</h5><span>CEO & Founder X</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="testimonial-item wow fadeInUp delay-0-4s">
                <div className="author">
                  <img src="/assets/images/testimonials/author2.jpg" alt="Author" />
                </div>
                <div className="text">Asian planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.</div>
                <div className="testi-des">
                  <h5>Martin Smith</h5><span>CEO & Founder Google</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="testimonial-item wow fadeInUp delay-0-6s">
                <div className="author">
                  <img src="/assets/images/testimonials/author3.jpg" alt="Author" />
                </div>
                <div className="text">Hello planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.</div>
                <div className="testi-des">
                  <h5>Methail Dev</h5><span>Managing Director - Paydesk</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="testimonial-item wow fadeInUp delay-0-8s">
                <div className="author">
                  <img src="/assets/images/testimonials/author4.jpg" alt="Author" />
                </div>
                <div className="text">Financial planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.</div>
                <div className="testi-des">
                  <h5>Eliana tweet</h5><span>CEO & Founder Tesla</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="testimonial-item wow fadeInUp delay-0-9s">
                <div className="author">
                  <img src="/assets/images/testimonials/author5.jpg" alt="Author" />
                </div>
                <div className="text">Yelp planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.</div>
                <div className="testi-des">
                  <h5>Henry Clark</h5><span>Founder Oxyzen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* New Modern Blog Section */}
      <section className="modern-blog-section">
        <div className="blog-container">
          <div className="blog-navigation">
            <div className="blog-nav-dots">
              <div className="blog-dot active"></div>
              <div className="blog-dot"></div>
              <div className="blog-dot"></div>
              <div className="blog-dot"></div>
            </div>
            <div className="blog-nav-arrows">
              <div className="blog-arrow blog-prev">←</div>
              <div className="blog-arrow blog-next">→</div>
            </div>
          </div>
          
          <div className="blog-cards-container">
            <div className="blog-cards-wrapper" ref={carouselRef}>
              <div className="modern-blog-card">
                <div className="blog-card-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1464822759844-d150baec4ba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)'}}>
                  <div className="blog-card-overlay">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Author" className="blog-card-avatar" />
                    <div className="blog-card-author">
                      <h4>SANY GIRI</h4>
                    </div>
                  </div>
                </div>
                <div className="blog-card-content">
                  <p>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DIAM NONUMMY NIBH EUISMOD TINCIDUNT UT LAOREET DOLORE MAGNA ALIQUAM ERAT VOLUTPAT. UT WISI ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCI TATION ULLAMCORPER SUSCIPIT LOBORTIS NISL UT ALIQUIP EX EA COMMODO CONSEQUAT.</p>
                </div>
              </div>
              
              <div className="modern-blog-card">
                <div className="blog-card-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)'}}>
                  <div className="blog-card-overlay">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Author" className="blog-card-avatar" />
                    <div className="blog-card-author">
                      <h4>PETUK COUPLE</h4>
                    </div>
                  </div>
                </div>
                <div className="blog-card-content">
                  <p>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DIAM NONUMMY NIBH EUISMOD TINCIDUNT UT LAOREET DOLORE MAGNA ALIQUAM ERAT VOLUTPAT. UT WISI ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCI TATION ULLAMCORPER SUSCIPIT LOBORTIS NISL UT ALIQUIP EX EA COMMODO CONSEQUAT.</p>
                </div>
              </div>
              
              <div className="modern-blog-card">
                <div className="blog-card-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)'}}>
                  <div className="blog-card-overlay">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Author" className="blog-card-avatar" />
                    <div className="blog-card-author">
                      <h4>MALDIV COUPLE</h4>
                    </div>
                  </div>
                </div>
                <div className="blog-card-content">
                  <p>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DIAM NONUMMY NIBH EUISMOD TINCIDUNT UT LAOREET DOLORE MAGNA ALIQUAM ERAT VOLUTPAT. UT WISI ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCI TATION ULLAMCORPER SUSCIPIT LOBORTIS NISL UT ALIQUIP EX EA COMMODO CONSEQUAT.</p>
                </div>
              </div>
              
              <div className="modern-blog-card">
                <div className="blog-card-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)'}}>
                  <div className="blog-card-overlay">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Author" className="blog-card-avatar" />
                    <div className="blog-card-author">
                      <h4>JOHN DOE</h4>
                    </div>
                  </div>
                </div>
                <div className="blog-card-content">
                  <p>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DIAM NONUMMY NIBH EUISMOD TINCIDUNT UT LAOREET DOLORE MAGNA ALIQUAM ERAT VOLUTPAT. UT WISI ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCI TATION ULLAMCORPER SUSCIPIT LOBORTIS NISL UT ALIQUIP EX EA COMMODO CONSEQUAT.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <HireMe />
    </>
  )
}

export default Home