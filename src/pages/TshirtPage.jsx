"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import "../styles/tshirt.css"

const TshirtPage = () => {
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    // Initialize WOW animations
    if (window.WOW) {
      new window.WOW({
        boxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: false,
        live: true,
      }).init()
    }
  }, [])

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)

    const posterItems = document.querySelectorAll(".poster-item")
    posterItems.forEach((item) => {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
    })
  }

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <CustomCursor />
      <Header />

      {/* Hero Section */}
      <section className="vm-hero-section">
        <div className="vm-hero-content">
          <h1>Creative Portfolio</h1>
          <p>Explore our collection of premium designs, videos, and creative content</p>
        </div>
      </section>

      {/* Poster Gallery Section */}
      <section className="poster-gallery">
        {/* Filter controls */}
        <div className="controls">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            All Posters
          </button>
          <button
            className={`filter-btn ${activeFilter === "video editing" ? "active" : ""}`}
            onClick={() => handleFilterClick("video editing")}
          >
            Video Editing
          </button>
          <button
            className={`filter-btn ${activeFilter === "graphics designing" ? "active" : ""}`}
            onClick={() => handleFilterClick("graphics designing")}
          >
            Graphics designing
          </button>
          <button
            className={`filter-btn ${activeFilter === "poster designing" ? "active" : ""}`}
            onClick={() => handleFilterClick("poster designing")}
          >
            Poster designing
          </button>
        </div>

        <div className="poster-grid">
          {/* Design Portfolio Items */}
          <div className="poster-item" data-category="graphics designing">
            <img src="/project/vedio editing/design5.jpg" alt="Premium Design 5" />
            <h3>Premium Graphics</h3>
            <div className="product-item">
              <p className="item-info">Brand Identity</p>
            </div>
          </div>

          <div className="poster-item" data-category="video editing">
            <img src="/project/vedio editing/design.jpg" alt="Video Content Design" />
            <h3>Video Content</h3>
            <div className="product-item">
              <p className="item-info">Social Media Video</p>
            </div>
          </div>

          <div className="poster-item" data-category="graphics designing">
            <img src="/project/vedio editing/tshirt.jpg" alt="T-shirt Design" />
            <h3>T-Shirt Design</h3>
            <div className="product-item">
              <p className="item-info">Custom Apparel</p>
            </div>
          </div>

          <div className="poster-item" data-category="poster designing">
            <img src="/project/company/profile.jpg" alt="Professional Profile" />
            <h3>Profile Design</h3>
            <div className="product-item">
              <p className="item-info">Professional Portfolio</p>
            </div>
          </div>

          <div className="poster-item" data-category="video editing">
            <img src="/project/vedio editing/design.jpg" alt="Marketing Video" />
            <h3>Marketing Content</h3>
            <div className="product-item">
              <p className="item-info">Promotional Video</p>
            </div>
          </div>

          <div className="poster-item" data-category="graphics designing">
            <img src="/project/company/Asset 2.png" alt="Company Asset" />
            <h3>Logo Design</h3>
            <div className="product-item">
              <p className="item-info">Company Branding</p>
            </div>
          </div>

          <div className="poster-item" data-category="poster designing">
            <img src="/project/vedio editing/design5.jpg" alt="Event Poster" />
            <h3>Event Promotion</h3>
            <div className="product-item">
              <p className="item-info">Event Marketing</p>
            </div>
          </div>

          <div className="poster-item" data-category="video editing">
            <img src="/project/vedio editing/tshirt.jpg" alt="Product Video" />
            <h3>Product Showcase</h3>
            <div className="product-item">
              <p className="item-info">Product Demo Video</p>
            </div>
          </div>

          <div className="poster-item" data-category="graphics designing">
            <img src="/project/company/marchbid.png" alt="Brand Design" />
            <h3>Brand Design</h3>
            <div className="product-item">
              <p className="item-info">Corporate Identity</p>
            </div>
          </div>

          <div className="poster-item" data-category="poster designing">
            <img src="/project/vedio editing/design.jpg" alt="Advertisement" />
            <h3>Advertisement</h3>
            <div className="product-item">
              <p className="item-info">Print & Digital Ad</p>
            </div>
          </div>

          <div className="poster-item" data-category="graphics designing">
            <img src="/project/vedio editing/design5.jpg" alt="Creative Design" />
            <h3>Creative Artwork</h3>
            <div className="product-item">
              <p className="item-info">Artistic Design</p>
            </div>
          </div>

          <div className="poster-item" data-category="video editing">
            <img src="/project/company/profile.jpg" alt="Personal Brand Video" />
            <h3>Personal Branding</h3>
            <div className="product-item">
              <p className="item-info">Brand Story Video</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default TshirtPage
