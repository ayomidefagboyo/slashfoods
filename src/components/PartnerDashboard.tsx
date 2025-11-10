import { useState, useEffect } from 'react';
import { Package, TrendingUp, Users, DollarSign, Plus, Clock, Edit, Trash2, ChevronLeft, BarChart3, Calendar, X, Upload, Image, RotateCcw, Copy, Bell } from 'lucide-react';
import Logo from './Logo';
import { usePartnerAuth } from '../contexts/PartnerAuthContext';
import PartnerAuth from './PartnerAuth';
import { getPartnerDashboardData, createDeal, updateDeal, deleteDeal, getOrderByPickupCode, updateOrderStatus, subscribeToPartnerOrders } from '../services/supabaseService';

interface PartnerDashboardProps {
  onNavigate: (view: 'home' | 'customer' | 'partner') => void;
}

const mockListings = [
  {
    id: 1,
    title: 'Surprise Dinner Bag',
    originalPrice: 2500,
    discountedPrice: 750,
    quantity: 5,
    pickupTime: '7:00 PM - 9:00 PM',
    status: 'active',
    reserved: 2,
    image: '/api/placeholder/300/200',
    category: 'Restaurant',
    description: 'A delightful mix of our best dinner items'
  },
  {
    id: 2,
    title: 'Lunch Special Box',
    originalPrice: 1800,
    discountedPrice: 600,
    quantity: 10,
    pickupTime: '12:00 PM - 2:00 PM',
    status: 'active',
    reserved: 7,
    image: '/api/placeholder/300/200',
    category: 'Restaurant',
    description: 'Perfect lunch combinations at great prices'
  },
  {
    id: 3,
    title: 'Breakfast Combo',
    originalPrice: 1500,
    discountedPrice: 450,
    quantity: 0,
    pickupTime: '8:00 AM - 10:00 AM',
    status: 'sold_out',
    reserved: 8,
    image: '/api/placeholder/300/200',
    category: 'Restaurant',
    description: 'Start your day with our hearty breakfast options'
  }
];

const mockPreviousListings = [
  {
    id: 4,
    title: 'Weekend Brunch Box',
    originalPrice: 3200,
    discountedPrice: 960,
    category: 'Restaurant',
    description: 'Premium brunch items for weekend treat',
    image: '/api/placeholder/300/200',
    lastActive: '2 days ago',
    totalSold: 15
  },
  {
    id: 5,
    title: 'Pastry Selection',
    originalPrice: 2000,
    discountedPrice: 600,
    category: 'Bakery',
    description: 'Fresh pastries and baked goods',
    image: '/api/placeholder/300/200',
    lastActive: '1 week ago',
    totalSold: 23
  },
  {
    id: 6,
    title: 'Suya Night Special',
    originalPrice: 2800,
    discountedPrice: 840,
    category: 'Local Cuisine',
    description: 'Authentic suya with sides',
    image: '/api/placeholder/300/200',
    lastActive: '3 days ago',
    totalSold: 31
  }
];

export default function PartnerDashboard({ onNavigate }: PartnerDashboardProps) {
  const { partner, loading, signOut } = usePartnerAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'analytics' | 'relist' | 'pickup'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRelistModal, setShowRelistModal] = useState(false);
  const [selectedPreviousListing, setSelectedPreviousListing] = useState<typeof mockPreviousListings[0] | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [pickupCode, setPickupCode] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState<any>(null);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load dashboard data when partner is available
  useEffect(() => {
    if (partner?.id) {
      loadDashboardData();
    }
  }, [partner?.id]);

  // Set up real-time subscriptions for order updates
  useEffect(() => {
    if (!partner?.id) return;

    const subscription = subscribeToPartnerOrders(partner.id, (payload) => {
      console.log('Real-time order update:', payload);

      // Add notification
      const newNotification = {
        id: Date.now(),
        type: payload.eventType === 'INSERT' ? 'new_order' : 'order_update',
        message: payload.eventType === 'INSERT'
          ? `New order received! Order #${payload.new?.order_id || 'Unknown'}`
          : `Order updated: #${payload.new?.order_id || 'Unknown'}`,
        timestamp: new Date(),
        data: payload.new
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 most recent

      // Refresh dashboard data
      loadDashboardData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [partner?.id]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && !(event.target as Element).closest('[data-notification-dropdown]')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const loadDashboardData = async () => {
    if (!partner?.id) return;

    setDashboardLoading(true);
    try {
      const data = await getPartnerDashboardData(partner.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Pickup code verification functions
  const verifyPickupCode = async () => {
    if (!pickupCode.trim() || pickupCode.length !== 4) {
      setPickupError('Please enter a 4-digit pickup code');
      return;
    }

    setPickupLoading(true);
    setPickupError(null);
    try {
      const order = await getOrderByPickupCode(pickupCode);
      setVerifiedOrder(order);
    } catch (error) {
      console.error('Failed to verify pickup code:', error);
      setPickupError('Invalid pickup code or order not found');
      setVerifiedOrder(null);
    } finally {
      setPickupLoading(false);
    }
  };

  const markOrderAsPickedUp = async () => {
    if (!verifiedOrder?.id) return;

    try {
      await updateOrderStatus(verifiedOrder.id, 'picked_up');
      setVerifiedOrder({ ...verifiedOrder, order_status: 'picked_up' });
      // Clear the form
      setPickupCode('');
      setVerifiedOrder(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  // Show authentication form if not logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!partner) {
    return <PartnerAuth onBack={() => onNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <Logo className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Partner Dashboard</h1>
                  <p className="text-xs text-orange-500 font-medium">{partner?.name || 'Partner'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications Bell */}
              <div className="relative" data-notification-dropdown>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-gray-100 transition-all relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {notifications.length}
                    </div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-all">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${
                                notification.type === 'new_order' ? 'bg-green-100' : 'bg-blue-100'
                              }`}>
                                <Package className={`w-4 h-4 ${
                                  notification.type === 'new_order' ? 'text-green-600' : 'text-blue-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={() => setNotifications([])}
                          className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg shadow-orange-500/25 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Listing</span>
              </button>
              <button
                onClick={signOut}
                className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 px-6 lg:px-8 max-w-6xl mx-auto pb-24">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-12 bg-gray-50 rounded-2xl p-2 border border-gray-100">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-orange-600 shadow-sm border border-gray-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'listings'
                ? 'bg-white text-orange-600 shadow-sm border border-gray-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('relist')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'relist'
                ? 'bg-white text-orange-600 shadow-sm border border-gray-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quick Re-list
          </button>
          <button
            onClick={() => setActiveTab('pickup')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'pickup'
                ? 'bg-white text-orange-600 shadow-sm border border-gray-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pickup Code
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-orange-600 shadow-sm border border-gray-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            {dashboardLoading ? (
              <div className="grid md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-4 gap-6">
                <StatCard
                  icon={<DollarSign className="w-6 h-6" />}
                  label="Total Revenue"
                  value={`₦${dashboardData?.analytics?.totalRevenue?.toLocaleString() || '0'}`}
                  change=""
                  positive={true}
                />
                <StatCard
                  icon={<Package className="w-6 h-6" />}
                  label="Total Orders"
                  value={`${dashboardData?.analytics?.totalOrders || '0'}`}
                  change=""
                  positive={true}
                />
                <StatCard
                  icon={<Users className="w-6 h-6" />}
                  label="Active Deals"
                  value={`${dashboardData?.analytics?.activeDeals || '0'}`}
                  change=""
                  positive={true}
                />
                <StatCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  label="Today's Orders"
                  value={`${dashboardData?.analytics?.todayOrders || '0'}`}
                  change=""
                  positive={true}
                />
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8">
                <h3 className="text-gray-900 font-bold text-2xl mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  {dashboardLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-2xl p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))
                  ) : dashboardData?.orders?.length > 0 ? (
                    dashboardData.orders.slice(0, 4).map((order: any) => (
                      <OrderItem
                        key={order.id}
                        orderId={order.order_id}
                        customer={order.customer_name}
                        item={order.items?.[0]?.deal_title || 'Order Item'}
                        amount={`₦${order.total_amount?.toLocaleString() || '0'}`}
                        status={order.order_status}
                        time={new Date(order.created_at).toLocaleString()}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No recent orders</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8">
                <h3 className="text-gray-900 font-bold text-2xl mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <ActionButton
                    icon={<Plus className="w-5 h-5" />}
                    label="Create New Listing"
                    description="Add a new surprise bag for customers"
                    onClick={() => setShowAddModal(true)}
                  />
                  <ActionButton
                    icon={<RotateCcw className="w-5 h-5" />}
                    label="Quick Re-list"
                    description="Reactivate your previous successful listings"
                    onClick={() => setActiveTab('relist')}
                  />
                  <ActionButton
                    icon={<Calendar className="w-5 h-5" />}
                    label="Schedule Listings"
                    description="Plan your listings in advance"
                  />
                  <ActionButton
                    icon={<BarChart3 className="w-5 h-5" />}
                    label="View Full Analytics"
                    description="Deep dive into your performance"
                    onClick={() => setActiveTab('analytics')}
                  />
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-3xl p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Environmental Impact</h3>
                  <p className="text-gray-600 mb-8 text-lg">See how you're making a difference</p>
                  <div className="grid md:grid-cols-3 gap-8">
                    <ImpactStat label="Food Saved" value="234 kg" sublabel="This Month" />
                    <ImpactStat label="CO2 Prevented" value="156 kg" sublabel="Carbon Emissions" />
                    <ImpactStat label="Meals Rescued" value="428" sublabel="Total Orders" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                Active Listings
              </h2>
              <span className="text-lg text-orange-500 font-semibold">
                ({dashboardData?.deals?.filter((d: any) => d.is_active && d.available_quantity > 0)?.length || 0})
              </span>
            </div>

            <div className="space-y-6">
              {dashboardLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-3xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="grid md:grid-cols-4 gap-6 mb-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j}>
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : dashboardData?.deals?.filter((d: any) => d.is_active && d.available_quantity > 0)?.length > 0 ? (
                dashboardData.deals
                  .filter((d: any) => d.is_active && d.available_quantity > 0)
                  .map((deal: any) => (
                    <ListingCard
                      key={deal.id}
                      listing={{
                        id: deal.id,
                        title: deal.title,
                        originalPrice: deal.original_price,
                        discountedPrice: deal.discounted_price,
                        quantity: deal.available_quantity,
                        pickupTime: `${deal.pickup_start_time} - ${deal.pickup_end_time}`,
                        status: deal.available_quantity > 0 ? 'active' : 'sold_out',
                        reserved: 0, // This would need to be calculated from orders
                        image: '/api/placeholder/300/200',
                        category: deal.category,
                        description: deal.description
                      }}
                      onEdit={async (updatedDeal) => {
                        // Handle deal updates
                        await updateDeal(deal.id, updatedDeal);
                        loadDashboardData();
                      }}
                      onDelete={async () => {
                        // Handle deal deletion
                        await deleteDeal(deal.id);
                        loadDashboardData();
                      }}
                    />
                  ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">No active listings</h3>
                  <p className="mb-4">Create your first listing to start selling</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
                  >
                    Create Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'relist' && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Quick Re-list
                </h2>
                <p className="text-gray-600">Reactivate your previous successful listings with updated quantities and times</p>
              </div>
              <span className="text-lg text-orange-500 font-semibold">({mockPreviousListings.length} available)</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPreviousListings.map((listing) => (
                <PreviousListingCard
                  key={listing.id}
                  listing={listing}
                  onReList={(listing) => {
                    setSelectedPreviousListing(listing);
                    setShowRelistModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pickup' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Pickup Verification</h2>
              <p className="text-gray-600 mb-8">Verify customer pickup codes and mark orders as collected</p>

              {/* Pickup Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Customer Pickup Code
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={pickupCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setPickupCode(value);
                      if (pickupError) setPickupError(null);
                      if (verifiedOrder) setVerifiedOrder(null);
                    }}
                    placeholder="Enter 4-digit code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-xl font-mono tracking-widest"
                    maxLength={4}
                  />
                  <button
                    onClick={verifyPickupCode}
                    disabled={pickupLoading || pickupCode.length !== 4}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:bg-gray-300 transition-all flex items-center space-x-2"
                  >
                    {pickupLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {pickupError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm">{pickupError}</p>
                </div>
              )}

              {/* Verified Order Details */}
              {verifiedOrder && (
                <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800">Order Verified ✓</h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      verifiedOrder.order_status === 'picked_up'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {verifiedOrder.order_status === 'picked_up' ? 'Already Picked Up' : 'Ready for Pickup'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Order ID</p>
                        <p className="text-gray-900 font-semibold">{verifiedOrder.order_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Customer</p>
                        <p className="text-gray-900 font-semibold">{verifiedOrder.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p className="text-gray-900 font-semibold">{verifiedOrder.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Amount</p>
                        <p className="text-gray-900 font-semibold">₦{verifiedOrder.total_amount?.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    {verifiedOrder.order_items && verifiedOrder.order_items.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Items</p>
                        <div className="space-y-2">
                          {verifiedOrder.order_items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{item.deal_title}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">₦{(item.unit_price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mark as Picked Up Button */}
                    {verifiedOrder.order_status !== 'picked_up' && (
                      <div className="pt-4">
                        <button
                          onClick={markOrderAsPickedUp}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                        >
                          Mark as Picked Up
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
                <h4 className="font-semibold text-orange-800 mb-2">How to use:</h4>
                <ol className="text-sm text-orange-700 space-y-1">
                  <li>1. Ask the customer for their 4-digit pickup code</li>
                  <li>2. Enter the code and click "Verify" to check the order</li>
                  <li>3. Confirm the customer details match</li>
                  <li>4. Hand over the food and mark as "Picked Up"</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {dashboardLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-3xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6">
                    <h4 className="text-gray-600 font-semibold text-sm mb-2">Total Revenue</h4>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      ₦{dashboardData?.analytics?.totalRevenue?.toLocaleString() || '0'}
                    </p>
                    <p className="text-orange-500 text-sm font-medium">All time</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-3xl p-6">
                    <h4 className="text-gray-600 font-semibold text-sm mb-2">Average Order Value</h4>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      ₦{Math.round(dashboardData?.analytics?.averageOrderValue || 0).toLocaleString()}
                    </p>
                    <p className="text-orange-500 text-sm font-medium">Per completed order</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-3xl p-6">
                    <h4 className="text-gray-600 font-semibold text-sm mb-2">Conversion Rate</h4>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {dashboardData?.orders?.length > 0
                        ? Math.round((dashboardData.orders.filter((o: any) => o.payment_status === 'completed').length / dashboardData.orders.length) * 100)
                        : 0}%
                    </p>
                    <p className="text-orange-500 text-sm font-medium">Orders completed</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Performance Insights */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-8">
                    <h3 className="text-gray-900 font-bold text-2xl mb-6">Performance Insights</h3>
                    <div className="space-y-4">
                      <InsightItem
                        label="Total Orders"
                        value={dashboardData?.analytics?.totalOrders?.toString() || '0'}
                        description="All time orders received"
                      />
                      <InsightItem
                        label="Active Deals"
                        value={dashboardData?.analytics?.activeDeals?.toString() || '0'}
                        description="Currently available for sale"
                      />
                      <InsightItem
                        label="Today's Orders"
                        value={dashboardData?.analytics?.todayOrders?.toString() || '0'}
                        description="Orders received today"
                      />
                    </div>
                  </div>

                  {/* Order Status Breakdown */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-8">
                    <h3 className="text-gray-900 font-bold text-2xl mb-6">Order Status</h3>
                    <div className="space-y-4">
                      {dashboardData?.orders && dashboardData.orders.length > 0 ? (
                        <>
                          <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                            <div>
                              <p className="font-semibold text-green-800">Completed</p>
                              <p className="text-sm text-green-600">Successfully delivered</p>
                            </div>
                            <p className="text-2xl font-bold text-green-800">
                              {dashboardData.orders.filter((o: any) => o.payment_status === 'completed').length}
                            </p>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                            <div>
                              <p className="font-semibold text-blue-800">Pending</p>
                              <p className="text-sm text-blue-600">Awaiting pickup</p>
                            </div>
                            <p className="text-2xl font-bold text-blue-800">
                              {dashboardData.orders.filter((o: any) => o.order_status === 'pending' || o.order_status === 'confirmed' || o.order_status === 'ready').length}
                            </p>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-semibold text-gray-800">Picked Up</p>
                              <p className="text-sm text-gray-600">Customer collected</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                              {dashboardData.orders.filter((o: any) => o.order_status === 'picked_up').length}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No order data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Environmental Impact</h3>
                  <p className="text-gray-600 mb-8 text-lg">Your contribution to reducing food waste</p>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-green-600 font-semibold text-sm mb-1">Orders Fulfilled</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {dashboardData?.orders?.filter((o: any) => o.payment_status === 'completed').length || 0}
                      </p>
                      <p className="text-green-600 text-sm font-medium">Meals saved from waste</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-semibold text-sm mb-1">Revenue Generated</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        ₦{dashboardData?.analytics?.totalRevenue?.toLocaleString() || '0'}
                      </p>
                      <p className="text-green-600 text-sm font-medium">From food that would be wasted</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-semibold text-sm mb-1">Active Listings</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {dashboardData?.analytics?.activeDeals || 0}
                      </p>
                      <p className="text-green-600 text-sm font-medium">Currently saving food</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddListingModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => loadDashboardData()}
        />
      )}

      {showRelistModal && selectedPreviousListing && (
        <RelistModal
          listing={selectedPreviousListing}
          onClose={() => {
            setShowRelistModal(false);
            setSelectedPreviousListing(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, change, positive }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-900/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-500">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-600 font-semibold text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function OrderItem({ orderId, customer, item, amount, status, time }: {
  orderId: string;
  customer: string;
  item: string;
  amount: string;
  status: string;
  time: string;
}) {
  const statusColors = {
    completed: 'bg-green-50 text-green-600 border-green-200',
    ready: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    pending: 'bg-blue-50 text-blue-600 border-blue-200'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-gray-900 font-semibold">{orderId}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 text-sm font-medium">{customer}</span>
        </div>
        <p className="text-gray-600 text-sm">{item}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-900 font-bold">{amount}</span>
        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[status as keyof typeof statusColors]}`}>
          {status}
        </span>
        <span className="text-gray-500 text-xs min-w-[80px] text-right">{time}</span>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, description, onClick }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-orange-50 hover:border-orange-100 transition-all text-left group border border-transparent"
    >
      <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-500 group-hover:bg-orange-100 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-gray-900 font-semibold mb-1">{label}</p>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </button>
  );
}

function ImpactStat({ label, value, sublabel }: {
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div>
      <p className="text-gray-600 font-semibold text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-orange-600 text-sm font-medium">{sublabel}</p>
    </div>
  );
}

function ListingCard({ listing, onEdit, onDelete }: {
  listing: typeof mockListings[0];
  onEdit?: (listing: any) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-gray-900/10 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-gray-900 font-bold text-xl">{listing.title}</h3>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              listing.status === 'active'
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {listing.status === 'active' ? 'Active' : 'Sold Out'}
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-4">
            <div>
              <p className="text-gray-600 font-semibold text-sm mb-1">Original Price</p>
              <p className="text-gray-900 font-bold">₦{listing.originalPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold text-sm mb-1">Sale Price</p>
              <p className="text-orange-500 font-bold">₦{listing.discountedPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold text-sm mb-1">Available</p>
              <p className="text-gray-900 font-bold">{listing.quantity} bags</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold text-sm mb-1">Reserved</p>
              <p className="text-gray-900 font-bold">{listing.reserved} bags</p>
            </div>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-2 text-orange-500" />
            <span className="font-medium">Pickup: {listing.pickupTime}</span>
          </div>
        </div>

        <div className="flex space-x-3 ml-6">
          {onEdit && (
            <button
              onClick={() => onEdit(listing)}
              className="p-3 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 transition-all"
            >
              <Edit className="w-5 h-5 text-orange-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete()}
              className="p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InsightItem({ label, value, description }: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
      <div>
        <p className="text-gray-600 font-semibold text-sm mb-1">{label}</p>
        <p className="text-gray-900 font-bold text-lg">{value}</p>
      </div>
      <p className="text-orange-500 text-sm font-medium">{description}</p>
    </div>
  );
}

function AddListingModal({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { partner } = usePartnerAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'restaurant',
    originalPrice: '',
    salePrice: '',
    quantity: '',
    pickupStartTime: '',
    pickupEndTime: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner?.id) return;

    setSubmitting(true);
    try {
      await createDeal({
        partner_id: partner.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        original_price: parseFloat(formData.originalPrice),
        discounted_price: parseFloat(formData.salePrice),
        available_quantity: parseInt(formData.quantity),
        pickup_start_time: formData.pickupStartTime,
        pickup_end_time: formData.pickupEndTime,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create deal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Listing</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="text-gray-700 font-semibold text-sm mb-3 block">Listing Image</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                dragActive
                  ? 'border-orange-400 bg-orange-50'
                  : selectedImage
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Drop your image here, or click to browse</p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-sm mb-3 block">Listing Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Surprise Dinner Bag"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Original Price (₦)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="2500"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Sale Price (₦)</label>
              <input
                type="number"
                placeholder="750"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Quantity</label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Category</label>
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all">
                <option>Restaurant</option>
                <option>Bakery</option>
                <option>Supermarket</option>
                <option>Local Cuisine</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Pickup Start Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Pickup End Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-sm mb-3 block">Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="Brief description of what customers can expect..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all resize-none"
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25">
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviousListingCard({ listing, onReList }: {
  listing: typeof mockPreviousListings[0];
  onReList: (listing: typeof mockPreviousListings[0]) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-gray-900/10 transition-all">
      <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          <Image className="w-12 h-12 text-orange-400" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-gray-900 font-bold text-lg mb-1">{listing.title}</h3>
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
            {listing.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Original Price</p>
            <p className="text-gray-900 font-bold">₦{listing.originalPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Your Price</p>
            <p className="text-orange-500 font-bold">₦{listing.discountedPrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Last Active</p>
            <p className="text-gray-600">{listing.lastActive}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Total Sold</p>
            <p className="text-gray-900 font-semibold">{listing.totalSold} bags</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm">{listing.description}</p>

        <button
          onClick={() => onReList(listing)}
          className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2"
        >
          <Copy className="w-4 h-4" />
          <span>Re-list Item</span>
        </button>
      </div>
    </div>
  );
}

function RelistModal({ listing, onClose }: {
  listing: typeof mockPreviousListings[0];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Re-list: {listing.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Image Preview */}
        <div className="mb-6">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Image className="w-16 h-16 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Original Price (₦)</label>
              <input
                type="number"
                defaultValue={listing.originalPrice}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Sale Price (₦)</label>
              <input
                type="number"
                defaultValue={listing.discountedPrice}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Quantity</label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Category</label>
              <select
                defaultValue={listing.category}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              >
                <option>Restaurant</option>
                <option>Bakery</option>
                <option>Supermarket</option>
                <option>Local Cuisine</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Pickup Start Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold text-sm mb-3 block">Pickup End Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-sm mb-3 block">Description</label>
            <textarea
              rows={3}
              defaultValue={listing.description}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all resize-none"
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25">
              Reactivate Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}