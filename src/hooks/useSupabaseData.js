import { useState, useEffect } from 'react'
import { videoService, recentWorksService } from '../lib/supabase'

// Hook for videos data
export const useVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const data = await videoService.getActiveVideos()
        setVideos(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching videos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return { videos, loading, error, refetch: () => fetchVideos() }
}

// Hook for recent works data
export const useRecentWorks = () => {
  const [recentWorks, setRecentWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecentWorks = async () => {
      try {
        setLoading(true)
        const data = await recentWorksService.getActiveWorks()
        setRecentWorks(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching recent works:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentWorks()
  }, [])

  const getWorksByCategory = (category) => {
    return recentWorks.filter(work => work.category === category)
  }

  return { 
    recentWorks, 
    loading, 
    error, 
    getWorksByCategory,
    refetch: () => fetchRecentWorks() 
  }
}

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, isAuthenticated: !!user }
}