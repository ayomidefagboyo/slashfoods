import { supabase } from '../lib/supabase';
import type { Deal, Order, Partner } from '../lib/supabase';

// Authentication
export const signInPartner = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get partner data
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('*')
      .eq('email', email)
      .single();

    if (partnerError) throw partnerError;

    return { user: data.user, partner };
  } catch (error) {
    console.error('Partner sign in error:', error);
    throw error;
  }
};

export const signUpPartner = async (partnerData: {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  business_type: string;
  description?: string;
}) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: partnerData.email,
      password: partnerData.password,
    });

    if (authError) throw authError;

    // Create partner record
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .insert([{
        email: partnerData.email,
        name: partnerData.name,
        phone: partnerData.phone,
        address: partnerData.address,
        business_type: partnerData.business_type,
        description: partnerData.description,
      }])
      .select()
      .single();

    if (partnerError) throw partnerError;

    return { user: authData.user, partner };
  } catch (error) {
    console.error('Partner sign up error:', error);
    throw error;
  }
};

export const signOutPartner = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentPartner = async (): Promise<Partner | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) throw error;
    return partner;
  } catch (error) {
    console.error('Get current partner error:', error);
    return null;
  }
};

// Partner Dashboard Data
export const getPartnerDashboardData = async (partnerId: string) => {
  try {
    // Get partner deals
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (dealsError) throw dealsError;

    // Get recent orders for this partner
    const { data: orderItems, error: ordersError } = await supabase
      .from('order_items')
      .select(`
        *,
        order:orders (
          id,
          order_id,
          customer_name,
          customer_email,
          customer_phone,
          pickup_code,
          payment_status,
          order_status,
          total_amount,
          created_at
        )
      `)
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (ordersError) throw ordersError;

    // Process orders to remove duplicates and get unique orders
    const uniqueOrders = new Map();
    orderItems?.forEach(item => {
      const order = item.order;
      if (order && !uniqueOrders.has(order.id)) {
        uniqueOrders.set(order.id, {
          ...order,
          items: []
        });
      }
      if (order) {
        uniqueOrders.get(order.id).items.push({
          deal_title: item.deal_title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        });
      }
    });

    const orders = Array.from(uniqueOrders.values());

    // Calculate analytics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.payment_status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const activeDeals = deals?.filter(d => d.is_active && d.available_quantity > 0) || [];

    // Today's orders
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order =>
      new Date(order.created_at).toDateString() === today
    );

    return {
      deals: deals || [],
      orders,
      analytics: {
        totalOrders,
        totalRevenue,
        activeDeals: activeDeals.length,
        todayOrders: todayOrders.length,
        averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0
      }
    };
  } catch (error) {
    console.error('Error fetching partner dashboard data:', error);
    throw error;
  }
};

// Deal Management
export const createDeal = async (dealData: {
  partner_id: string;
  title: string;
  description: string;
  category: string;
  original_price: number;
  discounted_price: number;
  available_quantity: number;
  pickup_start_time: string;
  pickup_end_time: string;
  pickup_date?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert([{
        ...dealData,
        pickup_date: dealData.pickup_date || new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
};

export const updateDeal = async (dealId: string, updates: Partial<Deal>) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', dealId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};

export const deleteDeal = async (dealId: string) => {
  try {
    const { error } = await supabase
      .from('deals')
      .update({ is_active: false })
      .eq('id', dealId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};

// Order Management
export const updateOrderStatus = async (orderId: string, status: 'confirmed' | 'ready' | 'picked_up' | 'expired') => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrderByPickupCode = async (pickupCode: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('pickup_code', pickupCode)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order by pickup code:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToPartnerOrders = (partnerId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('partner-orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'order_items',
        filter: `partner_id=eq.${partnerId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToPartnerDeals = (partnerId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('partner-deals')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'deals',
        filter: `partner_id=eq.${partnerId}`
      },
      callback
    )
    .subscribe();
};