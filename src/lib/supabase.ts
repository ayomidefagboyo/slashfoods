import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  business_type: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  partner_id: string;
  title: string;
  description?: string;
  category: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  available_quantity: number;
  pickup_start_time: string;
  pickup_end_time: string;
  pickup_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined partner data
  partner?: Partner;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  pickup_code: string;
  payment_method: string;
  payment_reference?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  order_status: 'confirmed' | 'ready' | 'picked_up' | 'expired';
  pickup_date: string;
  created_at: string;
  updated_at: string;
  // Order items
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  deal_id: string;
  partner_id: string;
  deal_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// Extended Deal type for frontend (with location data)
export interface DealWithLocation extends Deal {
  vendor: string; // partner name
  location: string; // partner address
  rating: number; // computed or default
  reviews: number; // computed or default
  pickupTime: string; // formatted time
  distance: number; // computed based on user location
  available: number; // available_quantity
  coordinates: { lat: number; lng: number };
  address: string; // partner address
}