import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`main-header ${isScrolled ? 'fixed-header' : ''}`}>
        <div className="header-upper">
          <div className="container">
            <div className="header-inner">
              <div className="row align-items-center">
                <div className="col-12">
                  <div
                    className="nav-container"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Left side links */}
                    <div className="nav-left" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                      <ul>
                        <li><Link to="/" className="linkstyle">Home</Link></li>
                        <li>
                          <a href="#" className="linkstyle">
                            Brands <i className="fas fa-caret-down"></i>
                          </a>
                          <div className="dropdown__menu">
                            <ul>
                              <li></li>
                              <li><a href="#">MERCHBID</a></li>
                              <li><a href="#">Rainbow Dockyards</a></li>
                              <li><a href="#">KITAB Hut</a></li>
                              <li><a href="#">ONOORA</a></li>
                              <li><a href="#">Afsin Traders</a></li>
                            </ul>
                          </div>
                        </li>
                        
                        <li>
                          <a href="#" className="linkstyle">
                            services<i className="fas fa-caret-down"></i>
                          </a>
                          <div className="dropdown__menu">
                            <ul>
                              <li></li>
                              <li><a href="#">Videos editing</a></li>
                              <li><a href="#">Graphics design</a></li>
                              <li><Link to="/tshirt">T-shirts design</Link></li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Center logo */}
                    <div className="logo-area" style={{ flex: '0 0 180px', textAlign: 'center' }}>
                      <Link to="/"><img src="/assets/images/logo.png" alt="Logo" style={{ maxHeight: '60px' }} /></Link>
                    </div>

                    {/* Right side links */}
                    <div className="nav-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <ul>
                        <li><a href="#" className="linkstyle">video</a></li>
                        <li>
                          <Link to="/graphic" className="linkstyle">graphics</Link>
                        </li>
                        <li><a href="#" className="linkstyle">T-shirt</a></li>
                      </ul>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="side-menu-icon d-lg-none text-end">
                      <a 
                        href="javascript:void(0)" 
                        className="info-toggle-btn f-right sidebar-toggle-btn"
                        onClick={() => setIsSidebarOpen(true)}
                      >
                        <i className="fal fa-bars"></i>
                      </a>
                    </div>

                    {/* Mobile Main Menu */}
                    <div className="main-menu">
                      <nav id="mobile-menu">
                        <ul>
                          <li><Link to="/" className="linkstyle">Home</Link></li>
                          <li><a href="about.html" className="linkstyle">About</a></li>
                          <li><a href="service.html" className="linkstyle">Services</a></li>
                          <li className="has-dropdown">
                            <a href="projects.html" className="linkstyle">Projects</a>
                          </li>
                          <li><a href="blog.html" className="linkstyle">Blog</a></li>
                          <li><Link to="/contact" className="linkstyle">Contact</Link></li>
                        </ul>
                      </nav>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar__area ${isSidebarOpen ? 'sidebar-opened' : ''}`}>
        <div className="sidebar__wrapper">
          <div className="sidebar__close">
            <button 
              className="sidebar__close-btn" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fal fa-times"></i>
            </button>
          </div>
          <div className="sidebar__content mt-50 mb-20">
            <div className="mobile-menu fix"></div>
          </div>
        </div>
      </div>

      <div 
        className={`body-overlay ${isSidebarOpen ? 'opened' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
    </>
  )
}

export default Header