"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Preloader from "../components/Preloader"
import ScrollToTop from "../components/ScrollToTop"
import CustomCursor from "../components/CustomCursor"
import "../styles/client.css"
import { videosService } from "../lib/videosService"
import "../styles/videos.css"

const VideoPage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videosService.getAllVideos()
        setVideos(data)
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()

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
      <section className="client-hero-section">
        <div className="client-hero-content">
          <h1>Video Portfolio</h1>
          <p>Showcasing creative video content for diverse brands</p>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="client-gallery">
        <div className="client-grid">
          {loading ? (
            <p>Loading videos...</p>
          ) : videos.length > 0 ? (
            videos.map((item) => (
              <div key={item.id} className="video-card">
                <div className="card-thumbnail">
                  <video controls width="100%" height="auto">
                    <source src={item.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p className="client-description">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No videos found.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default VideoPage