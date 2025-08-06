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
  createVideo: async (video) => {
  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select()
  if (error) throw error
  return data[0]
},
updateVideo: async (id, video) => {
  const { data, error } = await supabase
    .from('videos')
    .update(video)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
},
deleteVideo: async (id) => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
  if (error) throw error
}
}