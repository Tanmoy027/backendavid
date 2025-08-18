import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TshirtPage from './pages/TshirtPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import GraphicDesignPage from './pages/GraphicPage'
import GraphicAdminPage from './pages/GraphicAdminPage'
import TshirtAdminPage from './pages/TshirtAdminPage'
import VideosPage from './pages/VideospackagePage' 
import TshirtsPackagePage from './pages/TshirtspackagePage'
import VideoPage from './pages/Videopage'
import GraphicsPackagePage from './pages/GraphispackagePage'
import VideosAdminPage from './pages/VideosAdminPage'

import BrandPage from './pages/BrandPage'
import BrandsAdminPage from './pages/BrandsAdminPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tshirt" element={<TshirtPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin-panel-access-2024" element={<AdminPage />} />
        <Route path="/graphic" element={<GraphicDesignPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/admin-graphics" element={<GraphicAdminPage />} />
        <Route path="/admin-tshirts" element={<TshirtAdminPage />} />
        <Route path="/admin-videos" element={<VideosAdminPage />} />
        <Route path="/videos" element={<VideosPage />} /> 
        <Route path="/tshirts-package" element={<TshirtsPackagePage />} />
        <Route path="/graphics-package" element={<GraphicsPackagePage />} />
        <Route path="/brand/:brandTitle?" element={<BrandPage />} />
        <Route path="/admin-brands" element={<BrandsAdminPage />} />
      </Routes>
    </div>
  )
}

export default App


//<Route path="/admin-graphics" element={<GraphicAdminPage />} />