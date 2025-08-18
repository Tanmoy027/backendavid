import { supabase } from './supabase.js'

export const brandWorksService = {
  getWorksByBrandId: async (brandId) => {
    const { data, error } = await supabase
      .from('brand_works')
      .select('*')
      .eq('brand_id', brandId)
      .order('order_index', { ascending: true })
    if (error) throw error
    return data
  },
  createWork: async (work) => {
    const { data, error } = await supabase
      .from('brand_works')
      .insert([work])
      .select()
    if (error) throw error
    return data[0]
  },
  updateWork: async (id, work) => {
    const { data, error } = await supabase
      .from('brand_works')
      .update(work)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },
  deleteWork: async (id) => {
    const { error } = await supabase
      .from('brand_works')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}