import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TshirtPage from './pages/TshirtPage'

import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import GraphicDesignPage from './pages/GraphicPage'
//import GraphicAdminPage from './pages/GraphicAdminPage'
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
        
      </Routes>
    </div>
  )
}

export default App


//<Route path="/admin-graphics" element={<GraphicAdminPage />} />