import React, { useState, useEffect } from 'react'
import { authService, graphicsService, storageService } from '../lib/supabase'
import '../styles/admin.css'

const GraphicAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [graphics, setGraphics] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    image_path: '',
    category: 'branding',
    is_active: true,
    order_index: 0
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadGraphics()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const session = await authService.getSession()
      setIsAuthenticated(!!session)
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGraphics = async () => {
    try {
      const data = await graphicsService.getAllGraphics()
      setGraphics(data)
    } catch (error) {
      console.error('Failed to load graphics:', error)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const clearFileSelection = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      let imageUrl = formData.image_url
      let imagePath = formData.image_path

      if (selectedFile && !editingItem) {
        const uploadResult = await storageService.uploadImage(selectedFile, formData.title || 'graphic', 'graphicdesignpage')
        imageUrl = uploadResult.publicUrl
        imagePath = uploadResult.path
      } else if (selectedFile && editingItem) {
        if (editingItem.image_path) {
          await storageService.deleteImage(editingItem.image_path, 'graphicdesignpage')
        }
        const uploadResult = await storageService.uploadImage(selectedFile, formData.title || 'graphic', 'graphicdesignpage')
        imageUrl = uploadResult.publicUrl
        imagePath = uploadResult.path
      }

      if (editingItem) {
        await graphicsService.updateGraphic(editingItem.id, {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          category: formData.category,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        })
      } else {
        if (!selectedFile) {
          alert('Please select an image file')
          setUploading(false)
          return
        }
        await graphicsService.createGraphic({
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          category: formData.category,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        })
      }
      resetForm()
      loadGraphics()
    } catch (error) {
      alert('Failed to save: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title || '',
      description: item.description || '',
      image_url: item.image_url || '',
      image_path: item.image_path || '',
      category: item.category || 'branding',
      is_active: item.is_active,
      order_index: item.order_index
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      await graphicsService.deleteGraphic(id)
      loadGraphics()
    } catch (error) {
      alert('Failed to delete: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      image_path: '',
      category: 'branding',
      is_active: true,
      order_index: 0
    })
    setEditingItem(null)
    setShowAddForm(false)
    clearFileSelection()
  }

  if (loading) return <div className="admin-loading">Loading...</div>
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Admin Login</h2>
          {/* ...login form same as AdminPage... */}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Graphics Portfolio Admin</h1>
        <button onClick={() => authService.signOut()} className="logout-btn">Logout</button>
      </header>
      <main className="admin-content">
        <div className="content-header">
          <h2>Manage Graphics Portfolio</h2>
          <button onClick={() => setShowAddForm(true)} className="add-btn">Add New Graphic</button>
        </div>
        {showAddForm && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingItem ? 'Edit' : 'Add'} Graphic</h3>
                <button onClick={resetForm} className="close-btn">×</button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" />
                </div>
                <div className="form-group">
                  <label>Upload Image</label>
                  <input type="file" accept="image/*" onChange={handleFileSelect} />
                  {filePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={filePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #444' }} />
                      <button type="button" onClick={clearFileSelection}>Remove</button>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="branding">Branding</option>
                    <option value="web">Web Design</option>
                    <option value="print">Print Design</option>
                    <option value="illustration">Illustration</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Order Index</label>
                    <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: e.target.value})} min="0" />
                  </div>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                      Active
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="cancel-btn" disabled={uploading}>Cancel</button>
                  <button type="submit" className="save-btn" disabled={uploading}>{uploading ? 'Uploading...' : (editingItem ? 'Update' : 'Create')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {graphics.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description?.substring(0, 50)}...</td>
                  <td>{item.category}</td>
                  <td>{item.order_index}</td>
                  <td>
                    <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default GraphicAdminPage