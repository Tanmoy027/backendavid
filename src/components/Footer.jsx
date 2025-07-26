import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <a href="https://www.facebook.com/abid.chowdhury.7549" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
        <a href="https://wa.me/yourwhatsappphonenumber" target="_blank" rel="noopener noreferrer" className="social-link">WhatsApp</a>
      </div>

      <div className="footer-right">
        <Link to="/contact" className="contact-link">Let's Talk</Link>
      </div>
    </footer>
  )
}

export default Footer