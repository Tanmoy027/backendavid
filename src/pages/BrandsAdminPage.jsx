import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { brandsService } from '../lib/brandsService'
import { authService, storageService } from '../lib/supabase'
import '../styles/admin.css'

const BrandsAdminPage = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    image_path: '',
    category: 'custom',
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
      loadBrands()
    } else if (!loading) {
      navigate('/') // Redirect to home if not authenticated
    }
  }, [isAuthenticated, loading])

  const checkAuth = async () => {
    try {
      const session = await authService.getSession()
      setIsAuthenticated(!!session)
    } catch (error) {
      console.error('Auth check failed:', error)
      navigate('/') // Redirect to home on auth failure
    } finally {
      setLoading(false)
    }
  }

  const loadBrands = async () => {
    try {
      const data = await brandsService.getAllBrands()
      setBrands(data)
    } catch (error) {
      console.error('Failed to load brands:', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    console.log('Form submission started')
    console.log('Form data:', formData)
    console.log('Selected file:', selectedFile)
    
    try {
      let imageUrl = formData.image_url
      let imagePath = formData.image_path

      // Handle image upload
      if (selectedFile) {
        // If editing and there's an existing image, delete it first
        if (editingItem && editingItem.image_path) {
          console.log('Deleting old image:', editingItem.image_path)
          await storageService.deleteImage(editingItem.image_path, 'brandspage')
        }
        
        // Upload the new image
        console.log('Uploading image...')
        const uploadResult = await storageService.uploadImage(selectedFile, formData.title || 'brand', 'brandspage')
        console.log('Upload result:', uploadResult)
        imageUrl = uploadResult.publicUrl
        imagePath = uploadResult.path
      }

      if (editingItem) {
        console.log('Updating brand with data:', {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          category: formData.category,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        })
        await brandsService.updateBrand(editingItem.id, {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          category: formData.category,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        })
      } else {
        // For new brands, require image upload
        if (!selectedFile) {
          alert('Please select an image file')
          setUploading(false)
          return
        }
        
        const brandData = {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          category: formData.category,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        }
        console.log('Creating brand with data:', brandData)
        await brandsService.createBrand(brandData)
      }
      
      resetForm()
      loadBrands()
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
      image_url: item.image_url || '',
      image_path: item.image_path || '',
      category: item.category || 'custom',
      is_active: item.is_active,
      order_index: item.order_index
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      // Find the brand to get its image path
      const brandToDelete = brands.find(item => item.id === id)
      
      // Delete the image from storage if it exists
      if (brandToDelete && brandToDelete.image_path) {
        console.log('Deleting image from storage:', brandToDelete.image_path)
        await storageService.deleteImage(brandToDelete.image_path, 'brandspage')
      }
      
      // Delete the brand record from the database
      await brandsService.deleteBrand(id)
      loadBrands()
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      image_path: '',
      category: 'custom',
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
          {/* ...login form same as AdminPage... */}
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
          <h1>Brands Portfolio Admin</h1>
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
          <h2>Manage Brands Portfolio</h2>
          <button 
            onClick={() => {
              setEditingItem(null);
              setFormData({
                title: '',
                description: '',
                image_url: '',
                image_path: '',
                category: 'custom',
                is_active: true,
                order_index: 0
              });
              setSelectedFile(null);
              setFilePreview(null);
              setShowAddForm(true);
            }} 
            className="add-btn"
          >
            Add New Brand
          </button>
        </div>
        {showAddForm && (
          <div className="modal" onClick={(e) => e.target.className === 'modal' && resetForm()}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingItem ? 'Edit' : 'Add'} Brand</h3>
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
                  <label>Upload Image</label>
                  <input type="file" accept="image/*" onChange={handleFileSelect} />
                  {filePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={filePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #444' }} />
                      <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); }}>Remove</button>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="custom">Custom Design</option>
                    <option value="vintage">Vintage</option>
                    <option value="modern">Modern</option>
                    <option value="sports">Sports</option>
                    <option value="casual">Casual</option>
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
                <th>Category</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(item => (
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

export default BrandsAdminPage