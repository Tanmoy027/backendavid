import React, { useState } from 'react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [formMessage, setFormMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const endpoint = "https://formspree.io/f/myzwoljw" // Replace with your Formspree endpoint

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(e.target),
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setFormData({ name: '', email: '', message: '' })
        setFormMessage("✅ Message sent successfully!")
        setIsSuccess(true)
      } else {
        const data = await response.json()
        throw new Error(data.message || "An error occurred")
      }
    } catch (error) {
      setFormMessage("❌ Failed to send. Please try again.")
      setIsSuccess(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white text-gray-800 min-h-screen">
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl p-10 md:p-14 relative overflow-hidden">
          
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-30"></div>

          <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">Let's Talk</h2>

          {/* Success/Error Message */}
          {formMessage && (
            <div className={`mb-6 text-center text-sm font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {formMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1">Your Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1">Your Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1">Your Message</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              Send Message
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Or email me directly at 
            <a href="mailto:your@email.com" className="text-blue-600 underline ml-1">your@email.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default ContactPage