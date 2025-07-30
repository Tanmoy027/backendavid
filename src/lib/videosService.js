import { supabase } from './supabase.js'

export const videosService = {
  getAllVideos: async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data
  },
  // Other methods can be added later if needed
}