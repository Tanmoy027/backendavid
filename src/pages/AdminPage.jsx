import React, { useState, useEffect } from 'react'
import { authService, videoService, recentWorksService, storageService } from '../lib/supabase'
import { Link } from 'react-router-dom'
import '../styles/admin.css'

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('videos')
  
  // Auth state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Data state
  const [videos, setVideos] = useState([])
  const [recentWorks, setRecentWorks] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    image_url: '',
    category: 'poster',
    is_active: true,
    order_index: 0
  })

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, activeTab])

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

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    
    console.log('Attempting login with:', email)
    
    try {
      const result = await authService.signIn(email, password)
      console.log('Login successful:', result)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login failed:', error)
      setAuthError(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const loadData = async () => {
    try {
      if (activeTab === 'videos') {
        const videosData = await videoService.getAllVideos()
        setVideos(videosData)
      } else if (activeTab === 'works') {
        const worksData = await recentWorksService.getAllWorks()
        setRecentWorks(worksData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target.result)
      }
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
    
    console.log('Form submission started')
    console.log('Active tab:', activeTab)
    console.log('Form data:', formData)
    console.log('Selected file:', selectedFile)
    
    try {
      if (activeTab === 'videos') {
        if (editingItem) {
          await videoService.updateVideo(editingItem.id, {
            title: formData.title,
            description: formData.description,
            video_url: formData.video_url,
            thumbnail_url: formData.thumbnail_url,
            is_active: formData.is_active,
            order_index: parseInt(formData.order_index)
          })
        } else {
          await videoService.createVideo({
            title: formData.title,
            description: formData.description,
            video_url: formData.video_url,
            thumbnail_url: formData.thumbnail_url,
            is_active: formData.is_active,
            order_index: parseInt(formData.order_index)
          })
        }
      } else if (activeTab === 'works') {
        let imageUrl = formData.image_url
        let imagePath = formData.image_path

        // Handle image upload for recent works
        if (selectedFile && !editingItem) {
          // Upload new image
          console.log('Uploading new image...')
          const uploadResult = await storageService.uploadImage(selectedFile, formData.title || 'work')
          console.log('Upload result:', uploadResult)
          imageUrl = uploadResult.publicUrl
          imagePath = uploadResult.path
        } else if (selectedFile && editingItem) {
          // Delete old image if exists and upload new one
          if (editingItem.image_path) {
            console.log('Deleting old image:', editingItem.image_path)
            await storageService.deleteImage(editingItem.image_path)
          }
          console.log('Uploading replacement image...')
          const uploadResult = await storageService.uploadImage(selectedFile, formData.title || 'work')
          console.log('Upload result:', uploadResult)
          imageUrl = uploadResult.publicUrl
          imagePath = uploadResult.path
        }

        if (editingItem) {
          await recentWorksService.updateWork(editingItem.id, {
            title: formData.title,
            description: formData.description,
            image_url: imageUrl,
            image_path: imagePath,
            category: formData.category,
            is_active: formData.is_active,
            order_index: parseInt(formData.order_index)
          })
        } else {
          // For new works, require image upload
          if (!selectedFile) {
            alert('Please select an image file')
            setUploading(false)
            return
          }
          
          const workData = {
            title: formData.title,
            description: formData.description,
            image_url: imageUrl,
            image_path: imagePath,
            category: formData.category,
            is_active: formData.is_active,
            order_index: parseInt(formData.order_index)
          }
          console.log('Creating work with data:', workData)
          await recentWorksService.createWork(workData)
        }
      }
      
      resetForm()
      loadData()
    } catch (error) {
      console.error('Failed to save:', error)
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
      video_url: item.video_url || '',
      thumbnail_url: item.thumbnail_url || '',
      image_url: item.image_url || '',
      category: item.category || 'poster',
      is_active: item.is_active,
      order_index: item.order_index
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      if (activeTab === 'videos') {
        await videoService.deleteVideo(id)
      } else if (activeTab === 'works') {
        await recentWorksService.deleteWork(id)
      }
      loadData()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      image_url: '',
      category: 'poster',
      is_active: true,
      order_index: 0
    })
    setEditingItem(null)
    setShowAddForm(false)
    clearFileSelection()
  }

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {authError && <div className="error-message">{authError}</div>}
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Portfolio Admin Panel</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        <Link to="/admin-graphics" className="admin-nav-btn">Graphics Admin</Link>
      </header>

      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
        <button 
          className={`nav-btn ${activeTab === 'works' ? 'active' : ''}`}
          onClick={() => setActiveTab('works')}
        >
          Recent Works
        </button>
      </nav>

      <main className="admin-content">
        <div className="content-header">
          <h2>{activeTab === 'videos' ? 'Manage Videos' : 'Manage Recent Works'}</h2>
          <button 
            onClick={() => setShowAddForm(true)} 
            className="add-btn"
          >
            Add New {activeTab === 'videos' ? 'Video' : 'Work'}
          </button>
        </div>

        {showAddForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999
          }}>
            <div style={{
              backgroundColor: '#252525',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid #444',
              padding: '20px',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}>
              <div className="modal-header">
                <h3>{editingItem ? 'Edit' : 'Add'} {activeTab === 'videos' ? 'Video' : 'Work'}</h3>
                <button onClick={resetForm} className="close-btn">×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </div>

                {activeTab === 'videos' ? (
                  <>
                    <div className="form-group">
                      <label>Video URL</label>
                      <input
                        type="text"
                        value={formData.video_url}
                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Thumbnail URL (optional)</label>
                      <input
                        type="text"
                        value={formData.thumbnail_url}
                        onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #444',
                          borderRadius: '5px',
                          backgroundColor: '#1a1a1a',
                          color: '#ddd'
                        }}
                      />
                      {filePreview && (
                        <div style={{ marginTop: '10px' }}>
                          <img 
                            src={filePreview} 
                            alt="Preview" 
                            style={{ 
                              maxWidth: '200px', 
                              maxHeight: '200px', 
                              objectFit: 'cover',
                              borderRadius: '5px',
                              border: '1px solid #444'
                            }} 
                          />
                          <button 
                            type="button" 
                            onClick={clearFileSelection}
                            style={{
                              marginLeft: '10px',
                              padding: '5px 10px',
                              background: '#444',
                              color: '#ddd',
                              border: '1px solid #555',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="poster">Poster</option>
                        <option value="video">Video</option>
                        <option value="tshirt">T-Shirt</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Order Index</label>
                    <input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({...formData, order_index: e.target.value})}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="cancel-btn" disabled={uploading}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={uploading}>
                    {uploading ? 'Uploading...' : (editingItem ? 'Update' : 'Create')}
                  </button>
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
                {activeTab === 'videos' ? <th>Video URL</th> : <th>Category</th>}
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'videos' ? videos : recentWorks).map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description?.substring(0, 50)}...</td>
                  <td>
                    {activeTab === 'videos' 
                      ? item.video_url?.substring(0, 30) + '...'
                      : item.category
                    }
                  </td>
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

export default AdminPage