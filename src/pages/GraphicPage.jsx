"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import "../styles/client.css"

const GraphicDesignPage = () => {
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

    const designItems = document.querySelectorAll(".design-item")
    designItems.forEach((item) => {
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
      <section className="client-hero-section">
        <div className="client-hero-content">
          <h1>Graphic Design Portfolio</h1>
          <p>Showcasing creative visual solutions for diverse brands</p>
        </div>
      </section>

      {/* Graphic Design Gallery Section */}
      <section className="client-gallery">
        {/* Filter controls */}
        <div className="controls">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            All Projects
          </button>
          <button
            className={`filter-btn ${activeFilter === "branding" ? "active" : ""}`}
            onClick={() => handleFilterClick("branding")}
          >
            Branding
          </button>
          <button
            className={`filter-btn ${activeFilter === "web" ? "active" : ""}`}
            onClick={() => handleFilterClick("web")}
          >
            Web Design
          </button>
          <button
            className={`filter-btn ${activeFilter === "print" ? "active" : ""}`}
            onClick={() => handleFilterClick("print")}
          >
            Print Design
          </button>
          <button
            className={`filter-btn ${activeFilter === "illustration" ? "active" : ""}`}
            onClick={() => handleFilterClick("illustration")}
          >
            Illustration
          </button>
        </div>

        <div className="client-grid">
          {/* Graphic Design Portfolio Items */}
          <div className="design-item" data-category="branding">
            <div className="client-placeholder">
              <div className="placeholder-icon">🎨</div>
            </div>
            <h3>Brand Identity for NovaTech</h3>
            <div className="client-info">
              <p className="client-description">Logo & Brand Guidelines</p>
            </div>
          </div>

          <div className="design-item" data-category="web">
            <div className="client-placeholder">
              <div className="placeholder-icon">💻</div>
            </div>
            <h3>Website Design for GreenLeaf</h3>
            <div className="client-info">
              <p className="client-description">Responsive Web UI/UX</p>
            </div>
          </div>

          <div className="design-item" data-category="print">
            <div className="client-placeholder">
              <div className="placeholder-icon">📰</div>
            </div>
            <h3>Brochure for Urban Realty</h3>
            <div className="client-info">
              <p className="client-description">Corporate Brochure Design</p>
            </div>
          </div>

          <div className="design-item" data-category="illustration">
            <div className="client-placeholder">
              <div className="placeholder-icon">🖌️</div>
            </div>
            <h3>Custom Illustrations for EduKids</h3>
            <div className="client-info">
              <p className="client-description">Children’s Book Artwork</p>
            </div>
          </div>

          <div className="design-item" data-category="branding">
            <div className="client-placeholder">
              <div className="placeholder-icon">🌟</div>
            </div>
            <h3>Rebranding for Stellar Media</h3>
            <div className="client-info">
              <p className="client-description">Logo & Stationery Design</p>
            </div>
          </div>

          <div className="design-item" data-category="web">
            <div className="client-placeholder">
              <div className="placeholder-icon">📱</div>
            </div>
            <h3>App UI for FitTrack</h3>
            <div className="client-info">
              <p className="client-description">Mobile App Interface Design</p>
            </div>
          </div>

          <div className="design-item" data-category="print">
            <div className="client-placeholder">
              <div className="placeholder-icon">📖</div>
            </div>
            <h3>Magazine Layout for Trendy</h3>
            <div className="client-info">
              <p className="client-description">Fashion Magazine Design</p>
            </div>
          </div>

          <div className="design-item" data-category="illustration">
            <div className="client-placeholder">
              <div className="placeholder-icon">🎉</div>
            </div>
            <h3>Event Poster for ArtFest</h3>
            <div className="client-info">
              <p className="client-description">Poster & Flyer Illustration</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default GraphicDesignPage