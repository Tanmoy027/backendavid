"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import { brandsService } from "../lib/brandsService"
import { brandWorksService } from "../lib/brandWorksService"
import "../styles/tshirt.css"

const BrandPage = () => {
  const { brandTitle } = useParams();
  const navigate = useNavigate();
  const decodedTitle = brandTitle ? decodeURIComponent(brandTitle) : null;
  const [brands, setBrands] = useState([]);
  const [works, setWorks] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);

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
    
    loadData();
  }, [decodedTitle]);

  const loadData = async () => {
    try {
      const allBrands = await brandsService.getAllBrands();
      setBrands(allBrands);

      if (decodedTitle) {
        const brand = allBrands.find(b => b.title === decodedTitle);
        if (brand) {
          setSelectedBrand(brand);
          const brandWorks = await brandWorksService.getWorksByBrandId(brand.id);
          setWorks(brandWorks);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brand) => {
    navigate(`/brands/${encodeURIComponent(brand.title)}`);
  };

  const handleBackToBrands = () => {
    navigate('/brands');
  };

  const itemsToDisplay = decodedTitle ? works : brands;

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <CustomCursor />
      <Header />

      {/* Hero Section */}
      <section 
        className="vm-hero-section"
        style={{
          backgroundImage: selectedBrand?.image_url ? `url(${selectedBrand.image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="vm-hero-content">
          {decodedTitle && (
            <button 
              onClick={handleBackToBrands}
              className="back-to-brands-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              ← Back to All Brands
            </button>
          )}
          <h1>{decodedTitle ? `${decodedTitle} Portfolio` : 'Brand Portfolio'}</h1>
          <p>{decodedTitle ? `Explore ${decodedTitle} brand works and designs` : 'Explore our collection of premium brand designs and custom branding solutions'}</p>
        </div>
      </section>

      {/* Poster Gallery Section */}
      <section className="poster-gallery">
        <div className="poster-grid">
          {loading ? (
            <div className="loading-message">
              <p>Loading...</p>
            </div>
          ) : itemsToDisplay.length === 0 ? (
            <div className="no-items-message">
              <p>No items found.</p>
            </div>
          ) : (
            itemsToDisplay.map(item => (
              <div 
                key={item.id} 
                className={`poster-item ${!decodedTitle ? 'brand-card-clickable' : ''}`}
                onClick={() => !decodedTitle && handleBrandClick(item)}
                style={{
                  cursor: !decodedTitle ? 'pointer' : 'default',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!decodedTitle) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!decodedTitle) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {item.video_url ? (
                  <video controls src={item.video_url} style={{width: '100%', height: 'auto'}} />
                ) : (
                  <img 
                    src={item.image_url || '/project/vedio editing/brand.jpg'} 
                    alt={item.title}
                    onError={(e) => { e.target.src = '/project/vedio editing/brand.jpg' }}
                  />
                )}
                <h3>{item.title}</h3>
                <div className="product-item">
                  <p className="item-info">{item.description}</p>
                  {!decodedTitle && (
                    <div className="brand-category" style={{
                      marginTop: '10px',
                      padding: '5px 10px',
                      background: 'rgba(0,0,0,0.1)',
                      borderRadius: '15px',
                      fontSize: '12px',
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {item.category || 'Brand'}
                    </div>
                  )}
                  {!decodedTitle && (
                    <div className="click-hint" style={{
                      marginTop: '10px',
                      fontSize: '14px',
                      color: '#007bff',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      Click to view works →
                    </div>
                  )}
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