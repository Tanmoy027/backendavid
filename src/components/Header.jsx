import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { brandsService } from '../lib/brandsService'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [brandsCategories, setBrandsCategories] = useState([])

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

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await brandsService.getAllBrands();
        const activeBrands = brands.filter(brand => brand.is_active);
        setBrandsCategories(activeBrands.map(brand => brand.title));
      } catch (error) {
        console.error('Failed to load brands:', error);
      }
    };
    loadBrands();
  }, []);

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
                          <span className="linkstyle">
                            Brands <i className="fas fa-caret-down"></i>
                          </span>
                          <div className="dropdown__menu">
                            <ul>
                              {brandsCategories.length > 0 ? (
                                brandsCategories.map(title => (
                                  <li key={title}><Link to={`/brand/${encodeURIComponent(title)}`}>{title}</Link></li>
                                ))
                              ) : (
                                <li><Link to="/brand">All Brands</Link></li>
                              )}
                            </ul>
                          </div>
                        </li>
                        
                        <li>
                          <span className="linkstyle">
                            services<i className="fas fa-caret-down"></i>
                          </span>
                          <div className="dropdown__menu">
                            <ul>
                              <li><Link to="/videos">Videos Packages</Link></li>
                              <li><Link to="/graphics-package">Graphics Packages</Link></li>
                              <li><Link to="/tshirts-package">T-shirt Packages</Link></li>
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
                        <li><Link to="/video" className="linkstyle">video</Link></li>
                        <li>
                          <Link to="/graphic" className="linkstyle">graphics</Link>
                        </li>
                        <li><Link to="/tshirt" className="linkstyle">T-shirts</Link></li>
                      </ul>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="side-menu-icon d-lg-none text-end">
                      <button 
                        className="info-toggle-btn f-right sidebar-toggle-btn"
                        onClick={() => setIsSidebarOpen(true)}
                      >
                        <i className="fal fa-bars"></i>
                      </button>
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