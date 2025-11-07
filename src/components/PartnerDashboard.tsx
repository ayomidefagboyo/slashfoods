import { useState } from 'react';
import { Package, TrendingUp, Users, DollarSign, Plus, Clock, Edit, Trash2, Leaf, ChevronLeft, BarChart3, Calendar } from 'lucide-react';

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
    reserved: 2
  },
  {
    id: 2,
    title: 'Lunch Special Box',
    originalPrice: 1800,
    discountedPrice: 600,
    quantity: 10,
    pickupTime: '12:00 PM - 2:00 PM',
    status: 'active',
    reserved: 7
  },
  {
    id: 3,
    title: 'Breakfast Combo',
    originalPrice: 1500,
    discountedPrice: 450,
    quantity: 0,
    pickupTime: '8:00 AM - 10:00 AM',
    status: 'sold_out',
    reserved: 8
  }
];

export default function PartnerDashboard({ onNavigate }: PartnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'analytics'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen">
      <nav className="border-b border-emerald-500/20 backdrop-blur-md bg-slate-900/90 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-300" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Partner Dashboard</h1>
                  <p className="text-xs text-emerald-400">Kilimanjaro Restaurant</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Listing</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="flex space-x-2 mb-8 bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'listings'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                label="Today's Revenue"
                value="₦45,300"
                change="+12%"
                positive={true}
              />
              <StatCard
                icon={<Package className="w-6 h-6" />}
                label="Items Sold"
                value="32"
                change="+8%"
                positive={true}
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                label="Customers"
                value="28"
                change="+15%"
                positive={true}
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Waste Reduced"
                value="18 kg"
                change="+5%"
                positive={true}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-white font-bold text-xl mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  <OrderItem
                    orderId="#SL-2451"
                    customer="Chidi O."
                    item="Surprise Dinner Bag"
                    amount="₦750"
                    status="completed"
                    time="2 mins ago"
                  />
                  <OrderItem
                    orderId="#SL-2450"
                    customer="Amaka N."
                    item="Lunch Special Box"
                    amount="₦600"
                    status="ready"
                    time="15 mins ago"
                  />
                  <OrderItem
                    orderId="#SL-2449"
                    customer="Tunde A."
                    item="Surprise Dinner Bag"
                    amount="₦750"
                    status="pending"
                    time="28 mins ago"
                  />
                  <OrderItem
                    orderId="#SL-2448"
                    customer="Ngozi E."
                    item="Breakfast Combo"
                    amount="₦450"
                    status="completed"
                    time="1 hour ago"
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-white font-bold text-xl mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <ActionButton
                    icon={<Plus className="w-5 h-5" />}
                    label="Create New Listing"
                    description="Add a new surprise bag for customers"
                    onClick={() => setShowAddModal(true)}
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

            <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/30 rounded-2xl p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Your Environmental Impact</h3>
                  <p className="text-gray-400 mb-6">See how you're making a difference</p>
                  <div className="grid md:grid-cols-3 gap-6">
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Active Listings
                <span className="ml-3 text-lg text-emerald-400">({mockListings.length})</span>
              </h2>
            </div>

            <div className="space-y-4">
              {mockListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6">
                <h4 className="text-gray-400 text-sm mb-2">Total Revenue (30d)</h4>
                <p className="text-3xl font-bold text-white mb-1">₦892,400</p>
                <p className="text-emerald-400 text-sm">+18% from last month</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6">
                <h4 className="text-gray-400 text-sm mb-2">Average Order Value</h4>
                <p className="text-3xl font-bold text-white mb-1">₦685</p>
                <p className="text-emerald-400 text-sm">+5% from last month</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6">
                <h4 className="text-gray-400 text-sm mb-2">Customer Satisfaction</h4>
                <p className="text-3xl font-bold text-white mb-1">4.8/5.0</p>
                <p className="text-emerald-400 text-sm">156 reviews</p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6">
              <h3 className="text-white font-bold text-xl mb-6">Performance Insights</h3>
              <div className="space-y-4">
                <InsightItem
                  label="Peak Hours"
                  value="7 PM - 9 PM"
                  description="Your busiest pickup time"
                />
                <InsightItem
                  label="Most Popular"
                  value="Surprise Dinner Bag"
                  description="Best-selling item this month"
                />
                <InsightItem
                  label="Repeat Customers"
                  value="64%"
                  description="Higher than average"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddListingModal onClose={() => setShowAddModal(false)} />
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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
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
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    ready: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-white font-semibold">{orderId}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400 text-sm">{customer}</span>
        </div>
        <p className="text-gray-400 text-sm">{item}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-white font-bold">{amount}</span>
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusColors[status as keyof typeof statusColors]}`}>
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
      className="w-full flex items-center space-x-4 p-4 bg-slate-900/50 border border-emerald-500/20 rounded-xl hover:border-emerald-500/60 hover:bg-slate-900 transition-all text-left group"
    >
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-gray-400 text-sm">{description}</p>
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
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-emerald-400 text-sm">{sublabel}</p>
    </div>
  );
}

function ListingCard({ listing }: { listing: typeof mockListings[0] }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-white font-bold text-xl">{listing.title}</h3>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              listing.status === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {listing.status === 'active' ? 'Active' : 'Sold Out'}
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Original Price</p>
              <p className="text-white font-semibold">₦{listing.originalPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Sale Price</p>
              <p className="text-emerald-400 font-semibold">₦{listing.discountedPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Available</p>
              <p className="text-white font-semibold">{listing.quantity} bags</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Reserved</p>
              <p className="text-white font-semibold">{listing.reserved} bags</p>
            </div>
          </div>

          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-1 text-emerald-400" />
            <span>Pickup: {listing.pickupTime}</span>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <button className="p-3 bg-slate-900/50 border border-emerald-500/30 rounded-xl hover:bg-slate-900 transition-all">
            <Edit className="w-5 h-5 text-emerald-400" />
          </button>
          <button className="p-3 bg-slate-900/50 border border-red-500/30 rounded-xl hover:bg-slate-900 transition-all">
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
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
    <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-emerald-500/20 rounded-xl">
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-white font-bold text-lg">{value}</p>
      </div>
      <p className="text-emerald-400 text-sm">{description}</p>
    </div>
  );
}

function AddListingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-emerald-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Listing</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-gray-300 text-sm font-semibold mb-2 block">Listing Title</label>
            <input
              type="text"
              placeholder="e.g., Surprise Dinner Bag"
              className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Original Price (₦)</label>
              <input
                type="number"
                placeholder="2500"
                className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Sale Price (₦)</label>
              <input
                type="number"
                placeholder="750"
                className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Quantity</label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Category</label>
              <select className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors">
                <option>Restaurant</option>
                <option>Bakery</option>
                <option>Supermarket</option>
                <option>Local Cuisine</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Pickup Start Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Pickup End Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm font-semibold mb-2 block">Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="Brief description of what customers can expect..."
              className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/30">
              Create Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
