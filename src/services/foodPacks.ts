import { supabase } from '../config/supabase';
import { FoodPack, Order } from '../types';

export const foodPacksService = {
  /**
   * Get all available food packs
   */
  getAvailablePacks: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('food_packs')
        .select(`
          *,
          restaurant:restaurants(*)
        `)
        .eq('status', 'available')
        .gte('available_date', today)
        .gt('available_quantity', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as FoodPack[], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get a single food pack by ID
   */
  getFoodPackById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('food_packs')
        .select(`
          *,
          restaurant:restaurants(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as FoodPack, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Create an order for a food pack
   */
  createOrder: async (userId: string, foodPackId: string, quantity: number, totalPrice: number) => {
    try {
      // Generate a 6-digit pickup code
      const pickupCode = Math.floor(100000 + Math.random() * 900000).toString();

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            food_pack_id: foodPackId,
            quantity,
            total_price: totalPrice,
            pickup_code: pickupCode,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update food pack quantity
      await supabase.rpc('decrement_food_pack_quantity', {
        pack_id: foodPackId,
        qty: quantity,
      });

      return { data: data as Order, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get user's orders
   */
  getUserOrders: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          food_pack:food_packs(
            *,
            restaurant:restaurants(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as Order[], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
