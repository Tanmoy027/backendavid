import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { brandsService } from '../lib/brandsService'
import { brandWorksService } from '../lib/brandWorksService'
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
    video_url: '',
    video_path: '',
    category: 'custom',
    is_active: true,
    order_index: 0
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [fileType, setFileType] = useState(null) // 'image' or 'video'
  const [uploading, setUploading] = useState(false)

  const [showWorksModal, setShowWorksModal] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [works, setWorks] = useState([])
  const [editingWork, setEditingWork] = useState(null)
  const [showWorkForm, setShowWorkForm] = useState(false)
  const [workFormData, setWorkFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    image_path: '',
    video_url: '',
    video_path: '',
    order_index: 0,
    is_active: true
  })
  const [workSelectedFile, setWorkSelectedFile] = useState(null)
  const [workFilePreview, setWorkFilePreview] = useState(null)
  const [workFileType, setWorkFileType] = useState(null)

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
      let isValid = false;
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB');
          return;
        }
        isValid = true;
        setFileType('image');
      } else if (file.type.startsWith('video/')) {
        if (file.size > 50 * 1024 * 1024) {
          alert('Video size must be less than 50MB');
          return;
        }
        isValid = true;
        setFileType('video');
      } else {
        alert('Please select an image or video file');
        return;
      }
      if (isValid) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    console.log('Form submission started')
    console.log('Form data:', formData)
    console.log('Selected file:', selectedFile)
    console.log('File type:', fileType)
    
    try {
      let imageUrl = formData.image_url
      let imagePath = formData.image_path
      let videoUrl = formData.video_url
      let videoPath = formData.video_path

      // Handle file upload
      if (selectedFile) {
        // If editing and there's an existing file, delete it first
        if (editingItem) {
          if (fileType === 'image' && editingItem.image_path) {
            console.log('Deleting old image:', editingItem.image_path)
            await storageService.deleteImage(editingItem.image_path, 'brandspage')
          } else if (fileType === 'video' && editingItem.video_path) {
            console.log('Deleting old video:', editingItem.video_path)
            await storageService.deleteImage(editingItem.video_path, 'brandspage')
          }
        }
        
        // Upload the new file
        console.log('Uploading file...')
        const uploadResult = await storageService.uploadImage(selectedFile, formData.title || 'brand', 'brandspage')
        console.log('Upload result:', uploadResult)
        
        if (fileType === 'image') {
          imageUrl = uploadResult.publicUrl
          imagePath = uploadResult.path
        } else if (fileType === 'video') {
          videoUrl = uploadResult.publicUrl
          videoPath = uploadResult.path
        }
      }

      if (editingItem) {
        console.log('Updating brand with data:', {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          video_url: videoUrl,
          video_path: videoPath,
          category: formData.category,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        })
        await brandsService.updateBrand(editingItem.id, {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          video_url: videoUrl,
          video_path: videoPath,
          category: formData.category,
          is_active: formData.is_active,
          order_index: parseInt(formData.order_index)
        })
      } else {
        // For new brands, require file upload
        if (!selectedFile) {
          alert('Please select an image or video file')
          setUploading(false)
          return
        }
        
        const brandData = {
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
          image_path: imagePath,
          video_url: videoUrl,
          video_path: videoPath,
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
      video_url: item.video_url || '',
      video_path: item.video_path || '',
      category: item.category || 'custom',
      is_active: item.is_active,
      order_index: item.order_index
    })
    setShowAddForm(true)
    setFileType(item.video_url ? 'video' : 'image')
    setFilePreview(item.video_url || item.image_url || null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      // Find the brand to get its image path
      const brandToDelete = brands.find(item => item.id === id)
      
      // Delete the files from storage if they exist
      if (brandToDelete) {
        if (brandToDelete.image_path) {
          console.log('Deleting image from storage:', brandToDelete.image_path)
          await storageService.deleteImage(brandToDelete.image_path, 'brandspage')
        }
        if (brandToDelete.video_path) {
          console.log('Deleting video from storage:', brandToDelete.video_path)
          await storageService.deleteImage(brandToDelete.video_path, 'brandspage')
        }
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
      video_url: '',
      video_path: '',
      category: 'custom',
      is_active: true,
      order_index: 0
    })
    setEditingItem(null)
    setSelectedFile(null)
    setFilePreview(null)
    setFileType(null)
    setShowAddForm(false)
  }

  const loadWorks = async (brandId) => {
    try {
      const data = await brandWorksService.getWorksByBrandId(brandId)
      setWorks(data)
    } catch (error) {
      console.error('Failed to load works:', error)
    }
  }

  const handleManageWorks = (brand) => {
    setSelectedBrand(brand)
    loadWorks(brand.id)
    setShowWorksModal(true)
  }

  const handleWorkFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      let isValid = false
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB')
          return
        }
        isValid = true
        setWorkFileType('image')
      } else if (file.type.startsWith('video/')) {
        if (file.size > 50 * 1024 * 1024) {
          alert('Video size must be less than 50MB')
          return
        }
        isValid = true
        setWorkFileType('video')
      } else {
        alert('Please select an image or video file')
        return
      }
      if (isValid) {
        setWorkSelectedFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setWorkFilePreview(e.target.result)
        reader.readAsDataURL(file)
      }
    }
  }

  const handleWorkSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      let imageUrl = workFormData.image_url
      let imagePath = workFormData.image_path
      let videoUrl = workFormData.video_url
      let videoPath = workFormData.video_path

      if (workSelectedFile) {
        if (editingWork) {
          if (workFileType === 'image' && editingWork.image_path) {
            await storageService.deleteImage(editingWork.image_path, 'brandsworks')
          } else if (workFileType === 'video' && editingWork.video_path) {
            await storageService.deleteImage(editingWork.video_path, 'brandsworks')
          }
        }
        const uploadResult = await storageService.uploadImage(workSelectedFile, workFormData.title || 'work', 'brandsworks')
        if (workFileType === 'image') {
          imageUrl = uploadResult.publicUrl
          imagePath = uploadResult.path
        } else if (workFileType === 'video') {
          videoUrl = uploadResult.publicUrl
          videoPath = uploadResult.path
        }
      }

      const workData = {
        brand_id: selectedBrand.id,
        title: workFormData.title,
        description: workFormData.description,
        image_url: imageUrl,
        image_path: imagePath,
        video_url: videoUrl,
        video_path: videoPath,
        order_index: parseInt(workFormData.order_index),
        is_active: workFormData.is_active
      }

      if (editingWork) {
        await brandWorksService.updateWork(editingWork.id, workData)
      } else {
        await brandWorksService.createWork(workData)
      }

      resetWorkForm()
      loadWorks(selectedBrand.id)
    } catch (error) {
      console.error('Failed to save work:', error)
      alert('Failed to save work: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleEditWork = (work) => {
    setEditingWork(work)
    setWorkFormData({
      title: work.title || '',
      description: work.description || '',
      image_url: work.image_url || '',
      image_path: work.image_path || '',
      video_url: work.video_url || '',
      video_path: work.video_path || '',
      order_index: work.order_index,
      is_active: work.is_active
    })
    setWorkFileType(work.video_url ? 'video' : 'image')
    setWorkFilePreview(work.video_url || work.image_url || null)
    setShowWorkForm(true)
  }

  const handleDeleteWork = async (id) => {
    if (!window.confirm('Are you sure you want to delete this work?')) return
    try {
      const workToDelete = works.find(w => w.id === id)
      if (workToDelete) {
        if (workToDelete.image_path) {
          await storageService.deleteImage(workToDelete.image_path, 'brandsworks')
        }
        if (workToDelete.video_path) {
          await storageService.deleteImage(workToDelete.video_path, 'brandsworks')
        }
      }
      await brandWorksService.deleteWork(id)
      loadWorks(selectedBrand.id)
    } catch (error) {
      console.error('Failed to delete work:', error)
      alert('Failed to delete work: ' + error.message)
    }
  }

  const resetWorkForm = () => {
    setWorkFormData({
      title: '',
      description: '',
      image_url: '',
      image_path: '',
      video_url: '',
      video_path: '',
      order_index: 0,
      is_active: true
    })
    setEditingWork(null)
    setWorkSelectedFile(null)
    setWorkFilePreview(null)
    setWorkFileType(null)
    setShowWorkForm(false)
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
                video_url: '',
                video_path: '',
                category: 'custom',
                is_active: true,
                order_index: 0
              });
              setSelectedFile(null);
              setFilePreview(null);
              setFileType(null);
              setShowAddForm(true);
            }} 
            className="add-btn"
          >
            Add New Brand
          </button>
        </div>
        {showAddForm && (
          <div className="modal" onClick={(e) => { if (e.target.className === 'modal') resetForm(); }}>
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
                  <label>Upload File (Image or Video)</label>
                  <input type="file" accept="image/*,video/*" onChange={handleFileSelect} />
                  {filePreview && fileType === 'image' && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={filePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #444' }} />
                      <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); setFileType(null); }}>Remove</button>
                    </div>
                  )}
                  {filePreview && fileType === 'video' && (
                    <div style={{ marginTop: '10px' }}>
                      <video src={filePreview} controls style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px', border: '1px solid #444' }} />
                      <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); setFileType(null); }}>Remove</button>
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
                <th>Type</th>
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
                  <td>{item.video_url ? 'Video' : 'Image'}</td>
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
                    <button onClick={() => handleManageWorks(item)} className="manage-btn">Manage Works</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showWorksModal && (
          <div className="modal" onClick={(e) => { if (e.target.className === 'modal') setShowWorksModal(false); }}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>Manage Works for {selectedBrand.title}</h3>
                <button onClick={() => setShowWorksModal(false)} className="close-btn">×</button>
              </div>
              <button onClick={() => { resetWorkForm(); setShowWorkForm(true); }} className="add-btn">Add New Work</button>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {works.map(work => (
                      <tr key={work.id}>
                        <td>{work.title}</td>
                        <td>{work.description?.substring(0, 50)}...</td>
                        <td>{work.video_url ? 'Video' : 'Image'}</td>
                        <td>{work.order_index}</td>
                        <td>{work.is_active ? 'Active' : 'Inactive'}</td>
                        <td>
                          <button onClick={() => handleEditWork(work)} className="edit-btn">Edit</button>
                          <button onClick={() => handleDeleteWork(work.id)} className="delete-btn">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showWorkForm && (
                <div className="modal" onClick={(e) => { if (e.target.className === 'modal') resetWorkForm(); }}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>{editingWork ? 'Edit' : 'Add'} Work</h3>
                      <button onClick={resetWorkForm} className="close-btn">×</button>
                    </div>
                    <form onSubmit={handleWorkSubmit} className="admin-form">
                      <div className="form-group">
                        <label>Title</label>
                        <input type="text" value={workFormData.title} onChange={e => setWorkFormData({...workFormData, title: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea value={workFormData.description} onChange={e => setWorkFormData({...workFormData, description: e.target.value})} rows="3" />
                      </div>
                      <div className="form-group">
                        <label>Upload File (Image or Video)</label>
                        <input type="file" accept="image/*,video/*" onChange={handleWorkFileSelect} />
                        {workFilePreview && workFileType === 'image' && (
                          <div style={{ marginTop: '10px' }}>
                            <img src={workFilePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #444' }} />
                            <button type="button" onClick={() => { setWorkSelectedFile(null); setWorkFilePreview(null); setWorkFileType(null); }}>Remove</button>
                          </div>
                        )}
                        {workFilePreview && workFileType === 'video' && (
                          <div style={{ marginTop: '10px' }}>
                            <video src={workFilePreview} controls style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px', border: '1px solid #444' }} />
                            <button type="button" onClick={() => { setWorkSelectedFile(null); setWorkFilePreview(null); setWorkFileType(null); }}>Remove</button>
                          </div>
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Order Index</label>
                          <input type="number" value={workFormData.order_index} onChange={e => setWorkFormData({...workFormData, order_index: e.target.value})} min="0" />
                        </div>
                        <div className="form-group">
                          <label>
                            <input type="checkbox" checked={workFormData.is_active} onChange={e => setWorkFormData({...workFormData, is_active: e.target.checked})} />
                            Active
                          </label>
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="button" onClick={resetWorkForm} className="cancel-btn" disabled={uploading}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={uploading}>{uploading ? 'Uploading...' : (editingWork ? 'Update' : 'Create')}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default BrandsAdminPage