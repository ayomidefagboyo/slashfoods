import { useState } from 'react';
import { Search, MapPin, Filter, Star, Clock, ShoppingBag, X, Leaf, ChevronLeft, Heart } from 'lucide-react';

interface CustomerInterfaceProps {
  onNavigate: (view: 'home' | 'customer' | 'partner') => void;
}

const mockDeals = [
  {
    id: 1,
    title: 'Surprise Dinner Bag',
    vendor: 'Kilimanjaro Restaurant',
    location: 'Victoria Island, Lagos',
    rating: 4.8,
    reviews: 156,
    originalPrice: 2500,
    discountedPrice: 750,
    discount: 70,
    pickupTime: '7:00 PM - 9:00 PM',
    distance: '1.2 km',
    available: 5,
    category: 'Restaurant'
  },
  {
    id: 2,
    title: 'Fresh Bakery Box',
    vendor: 'Sweet Sensations',
    location: 'Lekki Phase 1, Lagos',
    rating: 4.9,
    reviews: 203,
    originalPrice: 3000,
    discountedPrice: 900,
    discount: 70,
    pickupTime: '8:00 PM - 10:00 PM',
    distance: '2.1 km',
    available: 8,
    category: 'Bakery'
  },
  {
    id: 3,
    title: 'Mixed Grill Platter',
    vendor: 'Grill Masters VI',
    location: 'Victoria Island, Lagos',
    rating: 4.7,
    reviews: 98,
    originalPrice: 4500,
    discountedPrice: 1350,
    discount: 70,
    pickupTime: '9:00 PM - 11:00 PM',
    distance: '0.8 km',
    available: 3,
    category: 'Restaurant'
  },
  {
    id: 4,
    title: 'Jollof Party Pack',
    vendor: 'Mama Put Express',
    location: 'Ikeja GRA, Lagos',
    rating: 4.6,
    reviews: 187,
    originalPrice: 1800,
    discountedPrice: 600,
    discount: 67,
    pickupTime: '6:00 PM - 8:00 PM',
    distance: '3.5 km',
    available: 12,
    category: 'Local Cuisine'
  },
  {
    id: 5,
    title: 'Grocery Surprise Box',
    vendor: 'ShopRite Ikeja',
    location: 'Ikeja City Mall',
    rating: 4.5,
    reviews: 312,
    originalPrice: 5000,
    discountedPrice: 1500,
    discount: 70,
    pickupTime: '8:30 PM - 9:30 PM',
    distance: '4.2 km',
    available: 15,
    category: 'Supermarket'
  },
  {
    id: 6,
    title: 'Asian Fusion Meal',
    vendor: 'Wok Express',
    location: 'Lekki Phase 1, Lagos',
    rating: 4.8,
    reviews: 143,
    originalPrice: 3500,
    discountedPrice: 1050,
    discount: 70,
    pickupTime: '7:30 PM - 9:30 PM',
    distance: '2.3 km',
    available: 6,
    category: 'Restaurant'
  }
];

export default function CustomerInterface({ onNavigate }: CustomerInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = ['All', 'Restaurant', 'Bakery', 'Supermarket', 'Local Cuisine'];

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-20">
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
                  <h1 className="text-xl font-bold text-white">SlashFood</h1>
                  <p className="text-xs text-emerald-400">Browse Deals</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">Lagos, Nigeria</span>
              </div>
              <button className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-colors">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for food, restaurants, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-emerald-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 bg-slate-800/50 border border-emerald-500/30 rounded-2xl text-white hover:bg-slate-800 transition-colors flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800/50 border border-emerald-500/30 text-gray-300 hover:border-emerald-500/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 bg-slate-800/50 border border-emerald-500/30 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Advanced Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Distance</label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                  <option>Within 5 km</option>
                  <option>Within 10 km</option>
                  <option>Within 20 km</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Pickup Time</label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                  <option>Anytime Today</option>
                  <option>Morning (6-12)</option>
                  <option>Afternoon (12-6)</option>
                  <option>Evening (6-12)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Sort By</label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                  <option>Distance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Available Deals Near You
            <span className="ml-3 text-lg text-emerald-400">({filteredDeals.length})</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isFavorite={favorites.includes(deal.id)}
              onToggleFavorite={() => toggleFavorite(deal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DealCard({ deal, isFavorite, onToggleFavorite }: {
  deal: typeof mockDeals[0];
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl overflow-hidden hover:border-emerald-500/60 transition-all hover:transform hover:scale-[1.02]">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center">
          <ShoppingBag className="w-16 h-16 text-white/40" />
        </div>
        <div className="absolute top-3 left-3 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
          -{deal.discount}% OFF
        </div>
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-900 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-emerald-400 text-sm font-semibold">
          {deal.available} left
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">{deal.title}</h3>
            <p className="text-gray-400 text-sm">{deal.vendor}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-3 text-sm text-gray-400">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-white font-semibold">{deal.rating}</span>
            <span className="ml-1">({deal.reviews})</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-emerald-400" />
            <span>{deal.distance}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-400 text-sm mb-4">
          <Clock className="w-4 h-4 mr-1 text-emerald-400" />
          <span>Pickup: {deal.pickupTime}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-2xl">₦{deal.discountedPrice.toLocaleString()}</span>
            <span className="text-gray-500 text-sm line-through">₦{deal.originalPrice.toLocaleString()}</span>
          </div>
          <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all transform group-hover:scale-105 shadow-lg shadow-emerald-500/30">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
