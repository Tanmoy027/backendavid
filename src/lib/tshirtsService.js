import { supabase } from './supabase.js'

export const tshirtsService = {
  getAllTshirts: async () => {
    const { data, error } = await supabase
      .from('tshirts')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data
  },
  // Other methods can be added later if needed
}