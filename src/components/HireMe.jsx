import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Minus } from "lucide-react" // Removed X import
const HireMeFloating = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  useEffect(() => {
    // Show the component after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])
  const handleClose = () => {
    setIsVisible(false)
  }
  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }
  if (!isVisible) return null
  return (
    <div className={`hire-me-floating ${isMinimized ? "minimized" : ""}`}>
      <div className="hire-me-content">
        {!isMinimized && (
          <>
            {/* Removed close button */}
            <div className="hire-me-avatar">
              <img src="/assets/images/about/me5.jpg" alt="Merchbid" width={45} height={45} className="avatar-img" />
              <div className="status-indicator"></div>
            </div>
            <div className="hire-me-text">
              <h4>Abid is available for hire</h4>
            </div>
            <div className="hire-me-actions">
              <Link to="/contact" className="hire-btn">
                Hire Abid
              </Link>
              <button className="minimize-btn" onClick={handleMinimize}>
                <Minus size={10} />
              </button>
            </div>
          </>
        )}
        {isMinimized && (
          <div className="minimized-content" onClick={handleMinimize}>
            <div className="mini-avatar">
              <img src="/assets/images/about/me5.jpg" alt="Merchbid" width={36} height={36} className="mini-avatar-img" />
              <div className="status-indicator"></div>
            </div>
            <span className="mini-text">Available for hire</span>
          </div>
        )}
      </div>
      <style jsx>{`
  /* Hire Me Floating Component Styles - Dark Theme */
  .hire-me-floating {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    max-width: 400px;
    animation: slideInBottom 0.5s ease-out;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .hire-me-floating.minimized {
    max-width: 200px;
  }
  .hire-me-content {
    background: #2d2d2d;
    border-radius: 50px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 12px 20px;
    position: relative;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .hire-me-floating:hover .hire-me-content {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }
  
  /* Avatar Section */
  .hire-me-avatar {
    position: relative;
    width: 45px;
    height: 45px;
    flex-shrink: 0;
    border-radius: 50%; /* Added to make container round */
    overflow: hidden; /* Added to clip image to circle */
  }
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  .status-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #10b981;
    border: 2px solid #2d2d2d;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
  /* Text Section */
  .hire-me-text {
    flex: 1;
    margin: 0;
  }
  .hire-me-text h4 {
    font-size: 15px;
    font-weight: 500;
    color: #ffffff;
    margin: 0;
    line-height: 1.2;
  }
  .hire-me-text p {
    display: none; /* Hide subtitle in this design */
  }
  /* Actions Section */
  .hire-me-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .hire-btn {
    background: #ffffff;
    color: #2d2d2d;
    text-decoration: none;
    padding: 8px 20px;
    border-radius: 25px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    text-align: center;
    display: inline-block;
    white-space: nowrap;
  }
  .hire-btn:hover {
    background: #f0f0f0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    color: #2d2d2d;
    text-decoration: none;
  }
  .minimize-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #999;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    transition: all 0.2s ease;
  }
  .minimize-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  /* Minimized State */
  .minimized-content {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 25px;
    transition: all 0.2s ease;
  }
  .minimized-content:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  .mini-avatar {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 50%; /* Added to make container round */
    overflow: hidden; /* Added to clip image to circle */
  }
  .mini-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  .mini-avatar .status-indicator {
    width: 8px;
    height: 8px;
    bottom: 0;
    right: 0;
    border: 1px solid #2d2d2d;
  }
  .mini-text {
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
  }
  /* Animations */
  @keyframes slideInBottom {
    from {
      transform: translateX(-50%) translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  /* Responsive Design */
  @media (max-width: 768px) {
    .hire-me-floating {
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 350px;
    }
    
    .hire-me-content {
      padding: 10px 16px;
    }
    
    .hire-me-text h4 {
      font-size: 14px;
    }
    
    .hire-btn {
      padding: 6px 16px;
      font-size: 12px;
    }
  }
  @media (max-width: 480px) {
    .hire-me-floating {
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 300px;
    }
    
    .hire-me-content {
      padding: 8px 14px;
      gap: 10px;
    }
    
    .hire-me-avatar {
      width: 36px;
      height: 36px;
    }
    
    .status-indicator {
      width: 10px;
      height: 10px;
    }
  }
`}</style>
    </div>
  )
}
export default HireMeFloating