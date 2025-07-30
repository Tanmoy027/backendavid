"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import "../styles/client.css"
import { graphicsService } from "../lib/graphicsService"

const GraphicDesignPage = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [graphics, setGraphics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGraphics = async () => {
      try {
        const data = await graphicsService.getAllGraphics()
        setGraphics(data)
      } catch (error) {
        console.error("Error fetching graphics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGraphics()

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

  const filteredGraphics = activeFilter === "all"
    ? graphics
    : graphics.filter(item => item.category === activeFilter)

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
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
          {loading ? (
            <p>Loading graphics...</p>
          ) : filteredGraphics.length > 0 ? (
            filteredGraphics.map((item) => (
              <div key={item.id} className="design-item" data-category={item.category}>
                <img src={item.image_url} alt={item.title} className="graphic-image" />
                <h3>{item.title}</h3>
                <div className="client-info">
                  <p className="client-description">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No graphics found in this category.</p>
          )}
        </div>
      </section>



      <Footer />
    </>
  )
}

export default GraphicDesignPage