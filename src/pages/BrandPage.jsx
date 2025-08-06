"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import { brandsService } from "../lib/brandsService"
import "../styles/tshirt.css"

const BrandPage = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredBrands, setFilteredBrands] = useState([])

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
    
    // Load brands data
    loadBrands()
  }, [])

  useEffect(() => {
    // Filter brands when activeFilter or brands change
    if (activeFilter === "all") {
      setFilteredBrands(brands)
    } else {
      setFilteredBrands(brands.filter(brand => brand.category === activeFilter))
    }
  }, [activeFilter, brands])

  const loadBrands = async () => {
    try {
      const data = await brandsService.getAllBrands()
      console.log('Raw brands data:', data)
      // Show all brands for debugging, not just active ones
      setBrands(data)
      setFilteredBrands(data)
    } catch (error) {
      console.error('Failed to load brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
  }

  // Get unique categories from brands
  const getCategories = () => {
    const categories = [...new Set(brands.map(brand => brand.category))]
    return categories
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
          <h1>Brand Portfolio</h1>
          <p>Explore our collection of premium brand designs and custom branding solutions</p>
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
            All Brands
          </button>
          {getCategories().map(category => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? "active" : ""}`}
              onClick={() => handleFilterClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="poster-grid">
          {loading ? (
            <div className="loading-message">
              <p>Loading brand designs...</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="no-items-message">
              <p>No brand designs found.</p>
            </div>
          ) : (
            filteredBrands.map(brand => (
              <div key={brand.id} className="poster-item" data-category={brand.category}>
                <img 
                  src={brand.image_url || '/project/vedio editing/brand.jpg'} 
                  alt={brand.title}
                  onError={(e) => {
                    e.target.src = '/project/vedio editing/brand.jpg'
                  }}
                />
                <h3>{brand.title}</h3>
                <div className="product-item">
                  <p className="item-info">{brand.description || brand.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default BrandPage