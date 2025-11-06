export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  area: string; // e.g., "Lekki", "VI", "Ikeja"
  phone: string;
  image_url?: string;
  rating?: number;
  created_at: string;
}

export interface FoodPack {
  id: string;
  restaurant_id: string;
  restaurant?: Restaurant;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  available_quantity: number;
  pickup_start_time: string; // e.g., "19:00"
  pickup_end_time: string; // e.g., "21:00"
  available_date: string; // ISO date string
  image_url?: string;
  status: 'available' | 'reserved' | 'sold_out';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  food_pack_id: string;
  food_pack?: FoodPack;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled';
  pickup_code: string; // 6-digit code for verification
  created_at: string;
  picked_up_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  FoodPackDetails: { packId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
};
