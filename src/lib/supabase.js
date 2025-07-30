import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Anon Key exists:', !!supabaseAnonKey)
console.log('Service Role Key exists:', !!supabaseServiceRoleKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

if (!supabaseServiceRoleKey) {
  console.warn('Service role key is missing!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role for uploads
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey)

// Database service functions
export const videoService = {
  // Get all active videos ordered by order_index
  async getActiveVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get all videos for admin
  async getAllVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Create new video
  async createVideo(video) {
    const { data, error } = await supabase
      .from('videos')
      .insert([video])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update video
  async updateVideo(id, updates) {
    const { data, error } = await supabase
      .from('videos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete video
  async deleteVideo(id) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const recentWorksService = {
  // Get all active recent works ordered by order_index
  async getActiveWorks() {
    const { data, error } = await supabase
      .from('recent_works')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get active works by category
  async getWorksByCategory(category) {
    const { data, error } = await supabase
      .from('recent_works')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get all works for admin
  async getAllWorks() {
    const { data, error } = await supabase
      .from('recent_works')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Create new work
  async createWork(work) {
    console.log('Attempting to create work:', work)
    console.log('Using authenticated user with proper RLS policies')
    
    const { data, error } = await supabase
      .from('recent_works')
      .insert([work])
      .select()
    
    console.log('Database response - data:', data, 'error:', error)
    
    if (error) {
      console.error('Database error details:', error)
      throw error
    }
    return data[0]
  },

  // Update work
  async updateWork(id, updates) {
    const { data, error } = await supabase
      .from('recent_works')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete work
  async deleteWork(id) {
    const { error } = await supabase
      .from('recent_works')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Storage service for image uploads
export const storageService = {
  // Upload image to bucket
  async uploadImage(file, fileName, bucket = 'homerecentwork') {
    try {
      console.log(`Starting image upload to ${bucket}...`)
      console.log('File:', file.name, 'Size:', file.size)
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const uniqueFileName = `${fileName.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.${fileExt}`
      
      console.log('Uploading to bucket with filename:', uniqueFileName)
      
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      console.log('Storage upload response:', { data, error })

      if (error) {
        console.error('Storage upload error:', error)
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(uniqueFileName)

      console.log('Generated public URL:', publicUrl)

      return {
        path: data.path,
        publicUrl: publicUrl
      }
    } catch (error) {
      console.error('Upload image error:', error)
      throw error
    }
  },

  // Delete image from bucket
  async deleteImage(filePath, bucket = 'homerecentwork') {
    try {
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      throw error
    }
  },

  // Get public URL for a file
  getPublicUrl(filePath, bucket = 'homerecentwork') {
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return publicUrl
  }
}

// Auth service
export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}