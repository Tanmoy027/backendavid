import { supabase } from './supabase.js'

export const brandsService = {
  getAllBrands: async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data
  },
  createBrand: async (brand) => {
    const { data, error } = await supabase
      .from('brands')
      .insert([brand])
      .select()
    if (error) throw error
    return data[0]
  },
  updateBrand: async (id, brand) => {
    const { data, error } = await supabase
      .from('brands')
      .update(brand)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },
  deleteBrand: async (id) => {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}