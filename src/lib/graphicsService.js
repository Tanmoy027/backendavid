import { supabase } from './supabaseClient'

export const graphicsService = {
  getAllGraphics: async () => {
    const { data, error } = await supabase
      .from('graphics')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data
  },
  createGraphic: async (graphic) => {
    const { data, error } = await supabase
      .from('graphics')
      .insert([graphic])
      .select()
    if (error) throw error
    return data[0]
  },
  updateGraphic: async (id, graphic) => {
    const { data, error } = await supabase
      .from('graphics')
      .update(graphic)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },
  deleteGraphic: async (id) => {
    const { error } = await supabase
      .from('graphics')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}