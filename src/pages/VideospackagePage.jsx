"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import "../styles/videos.css"

const VideosPage = () => {
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

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <CustomCursor />
      <Header />

      {/* Hero Section */}
      <section className="vm-hero-section">
        <div className="vm-hero-content">
          <h1>Video Editing Services</h1>
          <p>Explore our professional video editing packages</p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages-section">
        <h2>Our Packages</h2>
        <div className="packages-grid">
          <div className="package">
            <h3>Basic Package</h3>
            <p>Price: $99</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
            </ul>
          </div>
          <div className="package">
            <h3>Standard Package</h3>
            <p>Price: $199</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </div>
          <div className="package">
            <h3>Premium Package</h3>
            <p>Price: $299</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
              <li>Feature 4</li>
            </ul>
          </div>
          <div className="package">
            <h3>Enterprise Package</h3>
            <p>Price: $499</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
              <li>Feature 4</li>
              <li>Feature 5</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default VideosPage