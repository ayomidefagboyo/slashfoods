import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, Clock, ShoppingBag, X, ChevronLeft, ChevronRight, Heart, Navigation, CreditCard, Check, User, Phone, MapIcon, Info } from 'lucide-react';
import { useFlutterwave } from 'react-flutterwave';
import { getFlutterwaveConfig, handleFlutterwaveResponse, verifyPayment, type PaymentData, type PaymentResponse } from '../services/paymentService';
import Logo from './Logo';

interface CustomerInterfaceProps {
  onNavigate: (view: 'home' | 'customer' | 'partner') => void;
}

// Interface for deal data structure
interface Deal {
  id: number;
  title: string;
  vendor: string;
  location: string;
  rating: number;
  reviews: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  pickupTime: string;
  distance: number;
  available: number;
  category: string;
  coordinates: { lat: number; lng: number };
  address: string;
  description: string;
}

// Mock data for development - replace with API calls to your backend
const deals: Deal[] = [
  {
    id: 1,
    title: 'Surprise Dinner Bag',
    vendor: 'Kilimanjaro Restaurant',
    location: '12 Akin Adesola Street, Victoria Island',
    rating: 4.8,
    reviews: 156,
    originalPrice: 2500,
    discountedPrice: 750,
    discount: 70,
    pickupTime: '7:00 PM - 9:00 PM',
    distance: 1.2,
    available: 5,
    category: 'Restaurant',
    coordinates: { lat: 6.4265, lng: 3.4234 },
    address: '12 Akin Adesola Street, Victoria Island',
    description: 'A delightful mix of our chef\'s choice dishes including rice, protein, and sides'
  },
  {
    id: 2,
    title: 'Fresh Bakery Box',
    vendor: 'Sweet Sensations',
    location: '15 Admiralty Way, Lekki Phase 1',
    rating: 4.9,
    reviews: 203,
    originalPrice: 3000,
    discountedPrice: 900,
    discount: 70,
    pickupTime: '8:00 PM - 10:00 PM',
    distance: 2.1,
    available: 8,
    category: 'Bakery',
    coordinates: { lat: 6.4474, lng: 3.4737 },
    address: '15 Admiralty Way, Lekki Phase 1',
    description: 'Fresh pastries, bread, cakes, and baked goods from today\'s batch'
  },
  {
    id: 3,
    title: 'Mixed Grill Platter',
    vendor: 'Grill Masters VI',
    location: '5 Ozumba Mbadiwe Avenue, Victoria Island',
    rating: 4.7,
    reviews: 98,
    originalPrice: 4500,
    discountedPrice: 1350,
    discount: 70,
    pickupTime: '9:00 PM - 11:00 PM',
    distance: 0.8,
    available: 3,
    category: 'Restaurant',
    coordinates: { lat: 6.4281, lng: 3.4219 },
    address: '5 Ozumba Mbadiwe Avenue, Victoria Island',
    description: 'Assorted grilled meats, chicken, beef, and sides with our special sauce'
  },
  {
    id: 4,
    title: 'Jollof Party Pack',
    vendor: 'Mama Put Express',
    location: '23 Mobolaji Bank Anthony Way, Ikeja GRA',
    rating: 4.6,
    reviews: 187,
    originalPrice: 1800,
    discountedPrice: 600,
    discount: 67,
    pickupTime: '6:00 PM - 8:00 PM',
    distance: 3.5,
    available: 12,
    category: 'Local Cuisine',
    coordinates: { lat: 6.5958, lng: 3.3621 },
    address: '23 Mobolaji Bank Anthony Way, Ikeja GRA',
    description: 'Authentic Nigerian jollof rice with chicken, plantain, and traditional sides'
  },
  {
    id: 5,
    title: 'Grocery Surprise Box',
    vendor: 'ShopRite Ikeja',
    location: 'Ikeja City Mall, Alausa',
    rating: 4.5,
    reviews: 312,
    originalPrice: 5000,
    discountedPrice: 1500,
    discount: 70,
    pickupTime: '8:30 PM - 9:30 PM',
    distance: 4.2,
    available: 15,
    category: 'Supermarket',
    coordinates: { lat: 6.6018, lng: 3.3515 },
    address: 'Ikeja City Mall, Alausa, Ikeja',
    description: 'Mixed groceries including fruits, vegetables, packaged foods, and household items'
  },
  {
    id: 6,
    title: 'Asian Fusion Meal',
    vendor: 'Wok Express',
    location: '8 Fola Osibo Street, Lekki Phase 1',
    rating: 4.8,
    reviews: 143,
    originalPrice: 3500,
    discountedPrice: 1050,
    discount: 70,
    pickupTime: '7:30 PM - 9:30 PM',
    distance: 2.3,
    available: 6,
    category: 'Restaurant',
    coordinates: { lat: 6.4435, lng: 3.4653 },
    address: '8 Fola Osibo Street, Lekki Phase 1',
    description: 'Asian-inspired dishes including stir-fry, noodles, rice, and fusion specialties'
  },
  {
    id: 5,
    title: 'Lunch Special Box',
    vendor: 'Quick Bite',
    location: '23 Allen Avenue, Ikeja',
    rating: 4.6,
    reviews: 98,
    originalPrice: 2000,
    discountedPrice: 700,
    discount: 65,
    pickupTime: '12:00 PM - 2:00 PM',
    distance: 2.1,
    available: 2,
    category: 'Restaurant',
    coordinates: { lat: 6.6018, lng: 3.3515 },
    address: '23 Allen Avenue, Ikeja',
    description: 'Perfect lunch portions with rice, protein, and vegetables'
  },
  {
    id: 6,
    title: 'Fresh Bread Bundle',
    vendor: 'Golden Crust Bakery',
    location: '34 Herbert Macaulay, Yaba',
    rating: 4.7,
    reviews: 145,
    originalPrice: 1800,
    discountedPrice: 600,
    discount: 67,
    pickupTime: '6:00 PM - 8:00 PM',
    distance: 3.2,
    available: 1,
    category: 'Bakery',
    coordinates: { lat: 6.5164, lng: 3.3740 },
    address: '34 Herbert Macaulay, Yaba',
    description: 'Assorted fresh bread including wheat, white, and specialty loaves'
  },
  {
    id: 7,
    title: 'Grocery Surprise Bag',
    vendor: 'FreshMart Supermarket',
    location: '67 Admiralty Way, Lekki',
    rating: 4.4,
    reviews: 89,
    originalPrice: 4000,
    discountedPrice: 1500,
    discount: 62,
    pickupTime: '8:00 PM - 9:30 PM',
    distance: 1.8,
    available: 3,
    category: 'Supermarket',
    coordinates: { lat: 6.4308, lng: 3.4167 },
    address: '67 Admiralty Way, Lekki',
    description: 'Mix of fresh produce, pantry items, and dairy products'
  },
  {
    id: 8,
    title: 'Evening Dinner Bag',
    vendor: 'Mama Cass Kitchen',
    location: '12 Awolowo Road, Ikoyi',
    rating: 4.8,
    reviews: 167,
    originalPrice: 3500,
    discountedPrice: 1200,
    discount: 66,
    pickupTime: '7:30 PM - 9:00 PM',
    distance: 1.5,
    available: 2,
    category: 'Restaurant',
    coordinates: { lat: 6.4474, lng: 3.4553 },
    address: '12 Awolowo Road, Ikoyi',
    description: 'Traditional Nigerian dinner with jollof rice, proteins, and sides'
  },
  {
    id: 9,
    title: 'Cake & Pastry Box',
    vendor: 'Sweet Treats Bakery',
    location: '45 Opebi Road, Ikeja',
    rating: 4.9,
    reviews: 234,
    originalPrice: 2800,
    discountedPrice: 950,
    discount: 66,
    pickupTime: '6:30 PM - 8:30 PM',
    distance: 2.7,
    available: 1,
    category: 'Bakery',
    coordinates: { lat: 6.6018, lng: 3.3515 },
    address: '45 Opebi Road, Ikeja',
    description: 'Selection of cakes, cupcakes, and pastries'
  }
];

export default function CustomerInterface({ onNavigate }: CustomerInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [userAddress, setUserAddress] = useState<string>('Lagos, Nigeria');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservedDeals, setReservedDeals] = useState<number[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Purchase Flow State
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState<{name: string; email: string; phone: string} | null>(null);

  const categories = ['All', 'Restaurant', 'Bakery', 'Supermarket', 'Local Cuisine'];

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Reverse geocoding function with Google Maps API
  const reverseGeocode = async (lat: number, lng: number) => {
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Try Google Maps API first (more accurate for Nigeria)
    if (googleMapsApiKey && googleMapsApiKey !== 'your_google_maps_api_key_here') {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const result = data.results[0];
          const addressComponents = result.address_components;

          // Extract detailed address components for Nigerian addresses
          let streetNumber = '';
          let streetName = '';
          let neighborhood = '';
          let area = '';
          let city = '';
          let state = '';

          addressComponents.forEach((component: any) => {
            const types = component.types;
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            } else if (types.includes('route') || types.includes('street_address')) {
              streetName = component.long_name;
            } else if (types.includes('sublocality_level_2') || types.includes('neighborhood')) {
              neighborhood = component.long_name;
            } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
              area = component.long_name;
            } else if (types.includes('administrative_area_level_3')) {
              if (!area) area = component.long_name;
            } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
          });

          // Build detailed address string
          let addressParts = [];

          // Add street address if available
          if (streetNumber && streetName) {
            addressParts.push(`${streetNumber} ${streetName}`);
          } else if (streetName) {
            addressParts.push(streetName);
          }

          // Add area details
          if (neighborhood) {
            addressParts.push(neighborhood);
          } else if (area) {
            addressParts.push(area);
          }

          // Add city if different from Lagos
          if (city && city !== 'Lagos') {
            addressParts.push(city);
          } else if (state) {
            addressParts.push(state);
          }

          // Return more specific address or fallback to formatted address
          const specificAddress = addressParts.slice(0, 3).join(', ');
          return specificAddress || result.formatted_address.split(',').slice(0, 2).join(', ');
        }
      } catch (error) {
        console.error('Google Geocoding error:', error);
      }
    }

    // Fallback to OpenStreetMap (free but less detailed for Nigeria)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`
      );
      const data = await response.json();

      if (data && data.address) {
        const {
          neighbourhood,
          suburb,
          city_district,
          city,
          town,
          state_district,
          state
        } = data.address;

        let addressParts = [];

        // Prioritize neighborhood/suburb for detailed location
        if (neighbourhood) addressParts.push(neighbourhood);
        else if (suburb) addressParts.push(suburb);
        else if (city_district) addressParts.push(city_district);

        // Add city/town if different and relevant
        if (city && city !== 'Lagos') addressParts.push(city);
        else if (town && town !== 'Lagos') addressParts.push(town);
        else if (state_district) addressParts.push(state_district);
        else if (state) addressParts.push(state);

        const address = addressParts.slice(0, 2).join(', ');
        return address || 'Current Location';
      }
    } catch (error) {
      console.error('Nominatim geocoding error:', error);
    }

    return 'Current Location';
  };

  // Get user location
  const getUserLocation = async () => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setLocationPermission('granted');

          // Get the actual address
          const address = await reverseGeocode(coords.lat, coords.lng);
          setUserAddress(address);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // Calculate actual distances and sort by proximity
  const dealsWithDistance = deals.map(deal => {
    let calculatedDistance = deal.distance;
    if (userLocation) {
      calculatedDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        deal.coordinates.lat,
        deal.coordinates.lng
      );
    }
    return {
      ...deal,
      distance: calculatedDistance
    };
  });

  const filteredDeals = dealsWithDistance.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.distance - b.distance);

  const handleReserveDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowReservationModal(true);
  };

  const confirmReservation = (customerDetails: {name: string; email: string; phone: string}) => {
    if (selectedDeal) {
      // Store customer details for checkout
      setCustomerInfo(customerDetails);
      // Add to reserved deals for checkout
      setReservedDeals(prev => [...prev, selectedDeal.id]);
      // Update available quantity
      const dealIndex = deals.findIndex(d => d.id === selectedDeal.id);
      if (dealIndex !== -1) {
        deals[dealIndex].available = Math.max(0, deals[dealIndex].available - 1);
      }
      // Close reservation modal and go directly to checkout
      setShowReservationModal(false);
      setSelectedDeal(null);
      setShowCheckout(true);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={() => onNavigate('home')}
                className="md:flex hidden p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-fredoka font-semibold text-orange-600">SlashFood</h1>
                  <p className="text-xs text-orange-500 font-medium hidden sm:block">Browse Deals</p>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-shrink-0">
              {/* Location Dropdown Button */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors max-w-[200px] sm:max-w-xs"
              >
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                {isLoadingLocation ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-700 font-medium">Locating...</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-700 font-medium truncate" title={userAddress}>
                    {userAddress}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 sm:pt-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24">

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search food, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 md:pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all text-sm sm:text-base"
              />
              {/* Mobile Filter Button Inside Search */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            {/* Desktop Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="hidden md:flex px-4 sm:px-6 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-gray-700 hover:bg-gray-50 hover:border-orange-200 transition-all items-center space-x-2 flex-shrink-0"
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Filters</span>
            </button>
          </div>

        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-12 p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-bold text-xl">Advanced Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-700 font-semibold text-sm mb-3 block">Distance</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300">
                  <option>Within 5 km</option>
                  <option>Within 10 km</option>
                  <option>Within 20 km</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-sm mb-3 block">Pickup Time</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300">
                  <option>Anytime Today</option>
                  <option>Morning (6-12)</option>
                  <option>Afternoon (12-6)</option>
                  <option>Evening (6-12)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-sm mb-3 block">Sort By</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300">
                  <option>Distance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Deal Sections */}
        {filteredDeals.length > 0 ? (
          <div className="space-y-8">
            {/* Top Picks Near You */}
            <DealSection
              title="🔥 Top Picks Near You"
              deals={filteredDeals.slice(0, 6)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />

            {/* Save Before It's Too Late */}
            <DealSection
              title="⏰ Save Before It's Too Late"
              deals={filteredDeals.filter(deal => deal.available <= 3)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />

            {/* New Surprise Bags */}
            <DealSection
              title="✨ New Surprise Bags"
              deals={filteredDeals.filter(deal => deal.title.toLowerCase().includes('surprise') || deal.title.toLowerCase().includes('bag'))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />

            {/* Meals */}
            <DealSection
              title="🍽️ Meals"
              deals={filteredDeals.filter(deal => deal.category === 'Restaurant' || deal.title.toLowerCase().includes('meal') || deal.title.toLowerCase().includes('dinner'))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />

            {/* Collect for Lunch */}
            <DealSection
              title="🥙 Collect for Lunch"
              deals={filteredDeals.filter(deal => deal.pickupTime.includes('12:') || deal.pickupTime.includes('1:') || deal.title.toLowerCase().includes('lunch'))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />

            {/* Collect for Dinner */}
            <DealSection
              title="🍽️ Collect for Dinner"
              deals={filteredDeals.filter(deal => deal.pickupTime.includes('6:') || deal.pickupTime.includes('7:') || deal.pickupTime.includes('8:') || deal.title.toLowerCase().includes('dinner'))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />

            {/* Baked Goods */}
            <DealSection
              title="🥖 Baked Goods"
              deals={filteredDeals.filter(deal => deal.category === 'Bakery' || deal.title.toLowerCase().includes('bread') || deal.title.toLowerCase().includes('cake'))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />

            {/* Groceries */}
            <DealSection
              title="🛒 Groceries"
              deals={filteredDeals.filter(deal => deal.category === 'Supermarket' || deal.title.toLowerCase().includes('grocery'))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onReserve={handleReserveDeal}
              reservedDeals={reservedDeals}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No deals available right now</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We're working with local restaurants and vendors to bring you amazing deals.
              Check back soon or try adjusting your location.
            </p>
            <button
              onClick={() => onNavigate('partner')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
            >
              Partner with us
            </button>
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {showReservationModal && selectedDeal && (
        <ReservationModal
          deal={selectedDeal}
          onClose={() => setShowReservationModal(false)}
          onConfirm={confirmReservation}
        />
      )}


      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          reservedDeals={reservedDeals.map(id => deals.find(deal => deal.id === id)!).filter(Boolean)}
          customerInfo={customerInfo}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={(orderDetails) => {
            setOrderDetails(orderDetails);
            setShowCheckout(false);
            setShowOrderConfirmation(true);
            setReservedDeals([]);
            setCustomerInfo(null);
          }}
        />
      )}

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && orderDetails && (
        <OrderConfirmationModal
          orderDetails={orderDetails}
          onClose={() => {
            setShowOrderConfirmation(false);
            setOrderDetails(null);
            setReservedDeals([]); // Clear reserved deals after successful order
          }}
        />
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          currentAddress={userAddress}
          isLoadingLocation={isLoadingLocation}
          locationPermission={locationPermission}
          onClose={() => setShowLocationModal(false)}
          onEnableLocation={getUserLocation}
          onManualLocation={(address) => {
            setUserAddress(address);
            setShowLocationModal(false);
          }}
        />
      )}
    </div>
  );
}

function DealCard({ deal, isFavorite, onToggleFavorite, onReserve, isReserved }: {
  deal: Deal;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReserve: () => void;
  isReserved: boolean;
}) {
  return (
    <div className="flex-shrink-0 w-80 group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300 hover:-translate-y-1 snap-start cursor-pointer" onClick={() => onReserve()}>
      {/* Image Container */}
      <div className="relative">
        <div className="aspect-[2/1] bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-orange-300" />
        </div>

        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          -{deal.discount}% OFF
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Stock Indicator */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-orange-600 text-sm font-semibold shadow-lg">
          {deal.available} left
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-gray-900 font-bold text-base mb-1">{deal.title}</h3>
        </div>

        {/* Vendor with Star Rating */}
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-gray-900 font-medium text-sm mr-2">{deal.rating}</span>
          <span className="text-gray-600 font-medium text-sm">{deal.vendor}</span>
        </div>

        {/* Pickup Time and Distance on same line */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1 text-orange-500" />
            <span className="font-medium text-sm">{deal.pickupTime}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-orange-500" />
            <span className="font-medium text-sm">{deal.distance.toFixed(1)} km</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-900 font-bold text-base">₦{deal.discountedPrice.toLocaleString()}</span>
            <span className="text-gray-500 text-sm line-through">₦{deal.originalPrice.toLocaleString()}</span>
          </div>
          {isReserved && (
            <div className="flex items-center text-green-600">
              <Check className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Reserved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile version of DealCard - compact horizontal layout
function DealCardMobile({ deal, isFavorite, onToggleFavorite, onReserve, isReserved }: {
  deal: Deal;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReserve: () => void;
  isReserved: boolean;
}) {
  return (
    <div className="flex-shrink-0 w-64 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all snap-start cursor-pointer" onClick={() => onReserve()}>
      {/* Image Container */}
      <div className="relative">
        <div className="aspect-[2/1] bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-orange-300" />
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
          -{deal.discount}%
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Stock Indicator */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-orange-600 text-xs font-semibold">
          {deal.available} left
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-2">
          <h3 className="text-gray-900 font-bold text-sm mb-1 line-clamp-1">{deal.title}</h3>
        </div>

        {/* Vendor with Star Rating */}
        <div className="flex items-center mb-2">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-gray-900 font-medium text-xs mr-1">{deal.rating}</span>
          <span className="text-gray-600 font-medium text-xs line-clamp-1">{deal.vendor}</span>
        </div>

        {/* Pickup Time and Distance on same line */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center text-gray-600">
            <Clock className="w-3 h-3 mr-1 text-orange-500" />
            <span className="font-medium">{deal.pickupTime}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-3 h-3 mr-1 text-orange-500" />
            <span className="font-medium">{deal.distance.toFixed(1)} km</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-900 font-bold text-sm">₦{deal.discountedPrice.toLocaleString()}</span>
            <span className="text-gray-500 text-xs line-through">₦{deal.originalPrice.toLocaleString()}</span>
          </div>
          {isReserved && (
            <div className="flex items-center text-green-600">
              <Check className="w-3 h-3 mr-1" />
              <span className="text-xs font-medium">Reserved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReservationModal({ deal, onClose, onConfirm }: {
  deal: Deal;
  onClose: () => void;
  onConfirm: (customerDetails: {name: string; email: string; phone: string}) => void;
}) {
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerDetails.name && customerDetails.email && customerDetails.phone) {
      onConfirm(customerDetails);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center sm:items-center items-end justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-8 max-w-md w-full border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reserve Deal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Deal Summary */}
        <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{deal.title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{deal.vendor}</p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-lg sm:text-2xl font-bold text-gray-900">₦{deal.discountedPrice.toLocaleString()}</span>
              <span className="text-gray-500 line-through text-sm">₦{deal.originalPrice.toLocaleString()}</span>
            </div>
            <span className="bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
              -{deal.discount}% OFF
            </span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 text-orange-500" />
            <span>Pickup: {deal.pickupTime}</span>
          </div>

          {/* What's Included Tooltip - Compact for mobile */}
          <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Info className="w-3 sm:w-4 h-3 sm:h-4 text-blue-500" />
              <span className="text-xs sm:text-sm font-semibold text-blue-900">What you could get:</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-800">{deal.description}</p>
          </div>
        </div>

        {/* Customer Details Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-gray-700 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 block">Name</label>
            <input
              type="text"
              value={customerDetails.name}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm sm:text-base focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 block">Email</label>
            <input
              type="email"
              value={customerDetails.email}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm sm:text-base focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 block">Phone</label>
            <input
              type="tel"
              value={customerDetails.phone}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm sm:text-base focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              placeholder="Enter your phone"
              required
            />
          </div>

          <div className="flex space-x-3 sm:space-x-4 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-sm sm:text-base transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              <CreditCard className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Pay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function CheckoutModal({ reservedDeals, customerInfo, onClose, onOrderComplete }: {
  reservedDeals: Deal[];
  customerInfo: {name: string; email: string; phone: string} | null;
  onClose: () => void;
  onOrderComplete: (orderDetails: any) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const total = reservedDeals.reduce((sum, deal) => sum + deal.discountedPrice, 0);

  // Flutterwave configuration
  const flutterwaveConfig = customerInfo ? getFlutterwaveConfig({
    amount: total,
    email: customerInfo.email,
    name: customerInfo.name,
    phone: customerInfo.phone,
    orderId: `SL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }) : null;

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo || !flutterwaveConfig) {
      setPaymentError('Customer information not available');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const paymentData: PaymentData = {
        amount: total,
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        orderId: flutterwaveConfig.tx_ref
      };

      // Trigger Flutterwave payment
      handleFlutterwavePayment({
        callback: (response) => {
          const flutterwaveResponse = handleFlutterwaveResponse(response);
          handlePaymentResponse(flutterwaveResponse, paymentData);
        },
        onClose: () => {
          setIsProcessing(false);
          setPaymentError('Payment was cancelled');
        },
      });
    } catch (error) {
      setIsProcessing(false);
      setPaymentError('Payment processing failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const handlePaymentResponse = async (paymentResponse: PaymentResponse, paymentData: PaymentData) => {
    if (paymentResponse.success) {
      // Verify payment
      const isVerified = await verifyPayment(paymentResponse.reference, paymentResponse.provider);

      if (isVerified) {
        const orderDetails = {
          orderId: paymentData.orderId,
          pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
          customerDetails: customerInfo,
          deals: reservedDeals,
          total,
          paymentMethod: 'flutterwave',
          paymentReference: paymentResponse.reference,
          orderDate: new Date().toISOString(),
          status: 'confirmed'
        };

        setIsProcessing(false);
        onOrderComplete(orderDetails);
      } else {
        setIsProcessing(false);
        setPaymentError('Payment verification failed. Please contact support.');
      }
    } else {
      setIsProcessing(false);
      setPaymentError(paymentResponse.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Payment Error */}
          {paymentError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <X className="w-5 h-5 text-red-500" />
                <p className="text-red-800 font-medium">Payment Error</p>
              </div>
              <p className="text-red-700 text-sm mt-1">{paymentError}</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              {reservedDeals.map((deal) => (
                <div key={deal.id} className="flex justify-between">
                  <span className="text-gray-600">{deal.title}</span>
                  <span className="font-medium">₦{deal.discountedPrice.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Secure payment powered by Flutterwave</p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay ₦{total.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderConfirmationModal({ orderDetails, onClose }: {
  orderDetails: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Thank you for your purchase. Your deals have been reserved.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-gray-700">Order ID</span>
            <span className="font-bold text-gray-900">{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between items-center mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <span className="font-medium text-orange-700">Pickup Code</span>
            <span className="font-bold text-orange-900 text-xl">{orderDetails.pickupCode}</span>
          </div>
          <div className="space-y-2">
            {orderDetails.deals.map((deal: any) => (
              <div key={deal.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{deal.title}</h4>
                  <p className="text-sm text-gray-600">{deal.vendor}</p>
                  <p className="text-sm text-orange-500 font-medium">Pickup: {deal.pickupTime}</p>
                  <p className="text-xs text-gray-500">{deal.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">₦{deal.discountedPrice.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-orange-600">₦{orderDetails.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📱 Next Steps</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Show your pickup code at the restaurant</li>
            <li>• Arrive during the specified pickup times</li>
            <li>• Provide your pickup code: <span className="font-bold">{orderDetails.pickupCode}</span></li>
            <li>• Check your email for pickup instructions</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// Location Modal - Bottom slide-up modal
function LocationModal({ currentAddress, isLoadingLocation, locationPermission, onClose, onEnableLocation, onManualLocation }: {
  currentAddress: string;
  isLoadingLocation: boolean;
  locationPermission: 'granted' | 'denied' | 'prompt';
  onClose: () => void;
  onEnableLocation: () => void;
  onManualLocation: (address: string) => void;
}) {
  const [manualAddress, setManualAddress] = useState(currentAddress);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50 p-0">
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Set Your Location</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Current Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Location</h3>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium flex-1">{currentAddress}</span>
            </div>
          </div>

          {/* Enable Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Use GPS Location</h3>
            <button
              onClick={onEnableLocation}
              disabled={isLoadingLocation}
              className={`w-full flex items-center justify-center space-x-3 p-4 rounded-xl font-semibold transition-all ${
                locationPermission === 'granted'
                  ? 'bg-green-50 border-2 border-green-200 text-green-700'
                  : 'bg-orange-50 border-2 border-orange-200 text-orange-600 hover:bg-orange-100'
              } disabled:opacity-50`}
            >
              {isLoadingLocation ? (
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              ) : locationPermission === 'granted' ? (
                <Navigation className="w-5 h-5 text-green-600" />
              ) : (
                <Navigation className="w-5 h-5 text-orange-600" />
              )}
              <span>
                {isLoadingLocation
                  ? 'Getting location...'
                  : locationPermission === 'granted'
                  ? 'Location enabled - Tap to refresh'
                  : 'Enable location access'
                }
              </span>
            </button>
          </div>

          {/* Manual Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Or Set Manually</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Enter your address..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
              />
              <button
                onClick={() => onManualLocation(manualAddress)}
                disabled={!manualAddress.trim()}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Set This Location
              </button>
            </div>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Areas</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                'Victoria Island, Lagos',
                'Lekki Phase 1, Lagos',
                'Ikeja GRA, Lagos',
                'Ikoyi, Lagos',
                'Surulere, Lagos',
                'Yaba, Lagos'
              ].map((location) => (
                <button
                  key={location}
                  onClick={() => onManualLocation(location)}
                  className="text-left p-3 bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-gray-100 rounded-xl transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{location}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Deal Section Component
function DealSection({ title, deals, favorites, onToggleFavorite, onReserve, reservedDeals }: {
  title: string;
  deals: Deal[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onReserve: (deal: Deal) => void;
  reservedDeals: number[];
}) {
  if (deals.length === 0) return null;

  const scrollLeft = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const sectionId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <span className="text-sm text-orange-500 font-semibold">({deals.length})</span>
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="block sm:hidden">
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {deals.map((deal) => (
            <DealCardMobile
              key={deal.id}
              deal={deal}
              isFavorite={favorites.includes(deal.id)}
              onToggleFavorite={() => onToggleFavorite(deal.id)}
              onReserve={() => onReserve(deal)}
              isReserved={reservedDeals.includes(deal.id)}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Horizontal Scroll with Arrows */}
      <div className="hidden sm:block relative">
        {/* Left Arrow */}
        <button
          onClick={() => scrollLeft(`${sectionId}-desktop`)}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scrollRight(`${sectionId}-desktop`)}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable Container */}
        <div
          id={`${sectionId}-desktop`}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isFavorite={favorites.includes(deal.id)}
              onToggleFavorite={() => onToggleFavorite(deal.id)}
              onReserve={() => onReserve(deal)}
              isReserved={reservedDeals.includes(deal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}