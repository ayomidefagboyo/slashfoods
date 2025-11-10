import { supabase, type Deal, type Order, type OrderItem, type Customer, type Partner, type DealWithLocation } from '../lib/supabase';

/**
 * Fetch all active deals with partner information
 */
export const fetchDeals = async (): Promise<DealWithLocation[]> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        partner:partners (*)
      `)
      .eq('is_active', true)
      .eq('pickup_date', new Date().toISOString().split('T')[0]) // Today's deals
      .gt('available_quantity', 0) // Only deals with stock
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform database format to frontend format
    const transformedDeals: DealWithLocation[] = data.map((deal) => ({
      id: parseInt(deal.id.split('-')[0], 16), // Convert UUID to number for compatibility
      title: deal.title,
      vendor: deal.partner?.name || 'Unknown Vendor',
      location: deal.partner?.address || 'Unknown Location',
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      reviews: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
      originalPrice: deal.original_price,
      discountedPrice: deal.discounted_price,
      discount: deal.discount_percentage,
      pickupTime: `${deal.pickup_start_time.slice(0, 5)} - ${deal.pickup_end_time.slice(0, 5)}`,
      distance: 0, // Will be calculated based on user location
      available: deal.available_quantity,
      category: deal.category,
      coordinates: {
        lat: deal.partner?.latitude || 6.5244,
        lng: deal.partner?.longitude || 3.3792
      },
      address: deal.partner?.address || 'Lagos, Nigeria',
      description: deal.description || 'Delicious food deal',
      // Include original database fields
      partner_id: deal.partner_id,
      pickup_date: deal.pickup_date,
      pickup_start_time: deal.pickup_start_time,
      pickup_end_time: deal.pickup_end_time,
      is_active: deal.is_active,
      created_at: deal.created_at,
      updated_at: deal.updated_at,
      partner: deal.partner
    }));

    return transformedDeals;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw new Error('Failed to fetch deals');
  }
};

/**
 * Create a new customer or get existing one
 */
export const createOrGetCustomer = async (customerData: {
  name: string;
  email: string;
  phone: string;
}): Promise<Customer> => {
  try {
    // First, try to find existing customer
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerData.email)
      .single();

    if (existingCustomer) {
      // Update customer info if it exists
      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update({
          name: customerData.name,
          phone: customerData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select()
        .single();

      if (error) throw error;
      return updatedCustomer;
    } else {
      // Create new customer
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      return newCustomer;
    }
  } catch (error) {
    console.error('Error creating/getting customer:', error);
    throw new Error('Failed to create or get customer');
  }
};

/**
 * Create a new order with order items
 */
export const createOrder = async (orderData: {
  order_id: string;
  customer: { name: string; email: string; phone: string };
  deals: DealWithLocation[];
  total_amount: number;
  pickup_code: string;
  payment_method: string;
  payment_reference?: string;
}): Promise<Order> => {
  try {
    // First create or get customer
    const customer = await createOrGetCustomer(orderData.customer);

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderData.order_id,
        customer_id: customer.id,
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        total_amount: orderData.total_amount,
        pickup_code: orderData.pickup_code,
        payment_method: orderData.payment_method,
        payment_reference: orderData.payment_reference,
        payment_status: 'completed',
        order_status: 'confirmed'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.deals.map(deal => ({
      order_id: order.id,
      deal_id: deal.id.toString(),
      partner_id: deal.partner_id,
      deal_title: deal.title,
      quantity: 1,
      unit_price: deal.discountedPrice,
      total_price: deal.discountedPrice
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update deal quantities
    for (const deal of orderData.deals) {
      await supabase
        .from('deals')
        .update({
          available_quantity: deal.available - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', deal.id.toString());
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

/**
 * Get order by pickup code
 */
export const getOrderByPickupCode = async (pickupCode: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('pickup_code', pickupCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching order by pickup code:', error);
    return null;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: 'confirmed' | 'ready' | 'picked_up' | 'expired'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        order_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

/**
 * Get partner's deals and orders (for partner dashboard)
 */
export const getPartnerData = async (partnerEmail: string) => {
  try {
    // Get partner info
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('*')
      .eq('email', partnerEmail)
      .single();

    if (partnerError) throw partnerError;

    // Get partner's deals
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('partner_id', partner.id)
      .order('created_at', { ascending: false });

    if (dealsError) throw dealsError;

    // Get recent orders
    const { data: orders, error: ordersError } = await supabase
      .from('order_items')
      .select(`
        *,
        order:orders (*)
      `)
      .eq('partner_id', partner.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (ordersError) throw ordersError;

    return {
      partner,
      deals,
      orders
    };
  } catch (error) {
    console.error('Error fetching partner data:', error);
    throw new Error('Failed to fetch partner data');
  }
};