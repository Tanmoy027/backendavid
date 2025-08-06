import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { videosService } from '../lib/videosService'
import { authService, storageService } from '../lib/supabase'
import '../styles/admin.css'

const VideosAdminPage = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    video_path: '',
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
      loadVideos()
    } else if (!loading) {
      navigate('/')
    }
  }, [isAuthenticated, loading])

  const checkAuth = async () => {
    try {
      const session = await authService.getSession()
      setIsAuthenticated(!!session)
    } catch (error) {
      console.error('Auth check failed:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const loadVideos = async () => {
    try {
      const data = await videosService.getAllVideos()
      setVideos(data)
    } catch (error) {
      console.error('Failed to load videos:', error)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file')
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB')
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let videoUrl = formData.video_url
      let videoPath = formData.video_path

      if (selectedFile) {
        if (editingItem && editingItem.video_path) {
          await storageService.deleteImage(editingItem.video_path, 'videopage')
        }
        
        const uploadResult = await storageService.uploadImage(selectedFile, formData.title || 'video', 'videopage')
        videoUrl = uploadResult.publicUrl
        videoPath = uploadResult.path
      }

      if (editingItem) {
        await videosService.updateVideo(editingItem.id, {
          title: formData.title,
          description: formData.description,
          video_url: videoUrl,
          video_path: videoPath,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        })
      } else {
        if (!selectedFile) {
          alert('Please select a video file')
          setUploading(false)
          return
        }
        
        const videoData = {
          title: formData.title,
          description: formData.description,
          video_url: videoUrl,
          video_path: videoPath,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        }
        await videosService.createVideo(videoData)
      }
      
      resetForm()
      loadVideos()
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
      video_path: item.video_path || '',
      is_active: item.is_active,
      order_index: item.order_index
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      const videoToDelete = videos.find(item => item.id === id)
      
      if (videoToDelete && videoToDelete.video_path) {
        await storageService.deleteImage(videoToDelete.video_path, 'videopage')
      }
      
      await videosService.deleteVideo(id)
      loadVideos()
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      video_path: '',
      is_active: true,
      order_index: 0
    })
    setEditingItem(null)
    setSelectedFile(null)
    setFilePreview(null)
    setShowAddForm(false)
  }

  if (loading) return <div className="admin-loading">Loading...</div>
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Admin Login</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="header-left">
          <button 
            onClick={() => window.location.href = '/admin-panel-access-2024'} 
            className="back-btn"
            style={{
              background: '#333',
              color: '#fff',
              border: '1px solid #555',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ← Back to Dashboard
          </button>
          <h1>Video Portfolio Admin</h1>
        </div>
        <button 
          onClick={async () => {
            await authService.signOut();
            navigate('/');
          }} 
          className="logout-btn"
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Logout
        </button>
      </header>
      <main className="admin-content">
        <div className="content-header">
          <h2>Manage Video Portfolio</h2>
          <button 
            onClick={() => {
              setEditingItem(null);
              setFormData({
                title: '',
                description: '',
                video_url: '',
                video_path: '',
                is_active: true,
                order_index: 0
              });
              setSelectedFile(null);
              setFilePreview(null);
              setShowAddForm(true);
            }} 
            className="add-btn"
          >
            Add New Video
          </button>
        </div>
        {showAddForm && (
          <div className="modal" onClick={(e) => e.target.className === 'modal' && resetForm()}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingItem ? 'Edit' : 'Add'} Video</h3>
                <button onClick={() => { resetForm(); setShowAddForm(false); }} className="close-btn">×</button>
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
                  <label>Upload Video</label>
                  <input type="file" accept="video/*" onChange={handleFileSelect} />
                  {filePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <video src={filePreview} controls style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px', border: '1px solid #444' }} />
                      <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); }}>Remove</button>
                    </div>
                  )}
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
                  <button type="button" onClick={() => { resetForm(); setShowAddForm(false); }} className="cancel-btn" disabled={uploading}>Cancel</button>
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
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description?.substring(0, 50)}...</td>
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

export default VideosAdminPage