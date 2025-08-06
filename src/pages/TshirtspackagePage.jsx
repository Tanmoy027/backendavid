"use client"

import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import "../styles/tshirt.css"

const TshirtsPackagePage = () => {
  useEffect(() => {
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
          <h1>T-Shirt Services</h1>
          <p>Explore our professional t-shirt design packages</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="tshirt-services-section">
        <div className="container">
          <h2 className="section-title">Our T-Shirt Design Services</h2>
          
          <div className="service-item">
            <div className="service-image">
              <img src="/tshirtser.jpg" alt="Basic T-Shirt Design" />
            </div>
            <div className="service-details">
              <h3>Basic T-Shirt Design</h3>
              <div className="price">$99</div>
              <div className="description">
                <p>Perfect for simple, clean designs. Includes:</p>
                <ul>
                  <li>1 Custom Design Concept</li>
                  <li>2 Revisions</li>
                  <li>High-Resolution Files</li>
                  <li>Print-Ready Format</li>
                </ul>
              </div>
              <button className="order-btn">Order Now</button>
            </div>
          </div>

          <div className="service-item">
            <div className="service-image">
              <img src="/tshirtser1.jpg" alt="Standard T-Shirt Design" />
            </div>
            <div className="service-details">
              <h3>Standard T-Shirt Design</h3>
              <div className="price">$199</div>
              <div className="description">
                <p>Enhanced design package with more options. Includes:</p>
                <ul>
                  <li>3 Custom Design Concepts</li>
                  <li>5 Revisions</li>
                  <li>Multiple Format Files</li>
                  <li>Color Variations</li>
                  <li>Typography Options</li>
                </ul>
              </div>
              <button className="order-btn">Order Now</button>
            </div>
          </div>

          <div className="service-item">
            <div className="service-image">
              <img src="/tshirtser2.jpg" alt="Premium T-Shirt Design" />
            </div>
            <div className="service-details">
              <h3>Premium T-Shirt Design</h3>
              <div className="price">$299</div>
              <div className="description">
                <p>Professional design package for brands. Includes:</p>
                <ul>
                  <li>5 Custom Design Concepts</li>
                  <li>Unlimited Revisions</li>
                  <li>Brand Guidelines</li>
                  <li>Multiple Mockups</li>
                  <li>Commercial License</li>
                  <li>Vector Files</li>
                </ul>
              </div>
              <button className="order-btn">Order Now</button>
            </div>
          </div>

          <div className="service-item">
            <div className="service-image">
              <img src="/tshirtser3.jpg" alt="Enterprise T-Shirt Design" />
            </div>
            <div className="service-details">
              <h3>Enterprise T-Shirt Design</h3>
              <div className="price">$499</div>
              <div className="description">
                <p>Complete branding solution for businesses. Includes:</p>
                <ul>
                  <li>10 Custom Design Concepts</li>
                  <li>Unlimited Revisions</li>
                  <li>Full Brand Package</li>
                  <li>3D Mockups</li>
                  <li>Print Consultation</li>
                  <li>Rush Delivery</li>
                  <li>Dedicated Designer</li>
                </ul>
              </div>
              <button className="order-btn">Order Now</button>
            </div>
          </div>

          <div className="service-item">
            <div className="service-image">
              <img src="/tshirtser4.jpg" alt="Custom T-Shirt Design" />
            </div>
            <div className="service-details">
              <h3>Custom Design Package</h3>
              <div className="price">Contact Us</div>
              <div className="description">
                <p>Tailored solution for unique requirements. Includes:</p>
                <ul>
                  <li>Personalized Consultation</li>
                  <li>Custom Quote</li>
                  <li>Flexible Timeline</li>
                  <li>Specialized Techniques</li>
                  <li>Bulk Order Discounts</li>
                  <li>Ongoing Support</li>
                </ul>
              </div>
              <button className="order-btn">Get Quote</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default TshirtsPackagePage