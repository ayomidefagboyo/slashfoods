import React, { useState, useEffect } from 'react';
import { Mail, Lock, Phone, Building, Eye, EyeOff, Search, ChevronRight, ArrowLeft, Check, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { usePartnerAuth } from '../contexts/PartnerAuthContext';
import Logo from './Logo';

interface PartnerAuthProps {
  onBack: () => void;
}

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  business_status?: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
}

export default function PartnerAuth({ onBack }: PartnerAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Multi-step form state
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [googlePlaces, setGooglePlaces] = useState<GooglePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Interactive validation states
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  const [isStepValid, setIsStepValid] = useState(false);

  const { signIn, signUp } = usePartnerAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    business_type: '',
    description: '',
    latitude: 0,
    longitude: 0
  });

  // Google Places search function
  const searchPlaces = async (query: string) => {
    if (!query.trim() || query.length < 3) return;

    setSearchLoading(true);
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    try {
      // Since Google Places API has CORS restrictions, we'll create mock results
      // In production, this should be handled by your backend API
      const mockResults = [
        {
          place_id: `place_${Date.now()}_1`,
          name: query,
          formatted_address: `${query}, Victoria Island, Lagos, Nigeria`,
          types: ['establishment', 'store'],
          business_status: 'OPERATIONAL',
          rating: 4.2,
          user_ratings_total: 127
        },
        {
          place_id: `place_${Date.now()}_2`,
          name: `${query} Express`,
          formatted_address: `${query} Express, Ikeja, Lagos, Nigeria`,
          types: ['establishment', 'store'],
          business_status: 'OPERATIONAL',
          rating: 4.0,
          user_ratings_total: 89
        },
        {
          place_id: `place_${Date.now()}_3`,
          name: `${query} Mall`,
          formatted_address: `${query} Mall, Lekki, Lagos, Nigeria`,
          types: ['establishment', 'shopping_mall'],
          business_status: 'OPERATIONAL',
          rating: 4.5,
          user_ratings_total: 203
        }
      ];

      setGooglePlaces(mockResults);
    } catch (error) {
      console.error('Google Places search error:', error);
      // Fallback: create manual entries with user's query as address
      setGooglePlaces([
        {
          place_id: 'manual_1',
          name: query,
          formatted_address: `${query}, Lagos, Nigeria`,
          types: ['establishment'],
          geometry: { location: { lat: 6.5244, lng: 3.3792 } }
        }
      ]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPlaces(searchQuery);
      } else {
        setGooglePlaces([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectPlace = (place: GooglePlace) => {
    setSelectedPlace(place);
    setFormData({
      ...formData,
      name: place.name,
      address: place.formatted_address,
      latitude: place.geometry?.location?.lat || 0,
      longitude: place.geometry?.location?.lng || 0,
      phone: place.formatted_phone_number || ''
    });
    setGooglePlaces([]);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (!/(?=.*[A-Za-z])/.test(value)) return 'Password must contain at least one letter';
        return '';
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^(\+234|0)[789]\d{9}$/.test(value.replace(/\s/g, ''))) return 'Please enter a valid Nigerian phone number';
        return '';
      case 'business_type':
        if (!value) return 'Please select a business type';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    // Validate field in real-time
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  // Check step validation
  useEffect(() => {
    switch (step) {
      case 1:
        setIsStepValid(!!selectedPlace);
        break;
      case 2:
        setIsStepValid(
          !!formData.business_type &&
          !!formData.phone &&
          !fieldErrors.phone &&
          !fieldErrors.business_type
        );
        break;
      case 3:
        setIsStepValid(
          !!formData.email &&
          !!formData.password &&
          !fieldErrors.email &&
          !fieldErrors.password
        );
        break;
      default:
        setIsStepValid(false);
    }
  }, [step, formData, fieldErrors, selectedPlace]);

  const nextStep = () => {
    if (isStepValid) {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  // Interactive Input Component
  const InteractiveInput = ({
    type,
    name,
    value,
    placeholder,
    icon: Icon,
    rightIcon,
    required = false,
    disabled = false
  }: {
    type: string;
    name: string;
    value: string;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
    rightIcon?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
  }) => {
    const hasError = touchedFields[name] && fieldErrors[name];
    const isValid = touchedFields[name] && !fieldErrors[name] && value;

    return (
      <div>
        <div className="relative">
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
            hasError ? 'text-red-400' : isValid ? 'text-green-400' : 'text-gray-400'
          }`} />
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 ${rightIcon ? 'pr-12' : 'pr-4'} py-3 border rounded-xl transition-all duration-200 ${
              hasError
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                : isValid
                ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
            } focus:outline-none focus:ring-2`}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
          {/* Status Icons */}
          {isValid && !rightIcon && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {hasError && !rightIcon && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>

        {/* Error Message with Animation */}
        <div className={`mt-1 transition-all duration-200 overflow-hidden ${
          hasError ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <p className="text-red-600 text-xs font-medium flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {fieldErrors[name]}
          </p>
        </div>

        {/* Success Message */}
        <div className={`mt-1 transition-all duration-200 overflow-hidden ${
          isValid ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <p className="text-green-600 text-xs font-medium flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Looks good!
          </p>
        </div>
      </div>
    );
  };

  // Reset form when switching between login/signup
  const switchMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setSelectedPlace(null);
    setGooglePlaces([]);
    setSearchQuery('');
    setError(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      address: '',
      business_type: '',
      description: '',
      latitude: 0,
      longitude: 0
    });
  };

  // Show login form if isLogin is true
  if (isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner Login</h1>
            <p className="text-gray-600">Access your partner dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="partner@restaurant.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={switchMode} className="text-orange-500 hover:text-orange-600 font-medium">
              Don't have an account? Join SlashFood
            </button>
          </div>

          <div className="mt-6 text-center">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step signup flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join SlashFood</h1>
          <p className="text-gray-600">Start reducing food waste and growing your business</p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Store Search */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-left duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Search for your store or restaurant
              </label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                  searchQuery ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                    searchQuery
                      ? 'border-orange-300 bg-orange-50 focus:border-orange-500 focus:ring-orange-500'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  placeholder="Type your store name..."
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Google Places Results */}
              {googlePlaces.length > 0 && (
                <div className="mt-3 border border-gray-200 rounded-xl max-h-60 overflow-y-auto">
                  {googlePlaces.map((place) => (
                    <button
                      key={place.place_id}
                      onClick={() => selectPlace(place)}
                      className="w-full text-left p-4 hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-semibold text-gray-900">{place.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{place.formatted_address}</div>
                      {place.rating && (
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>{place.rating} ({place.user_ratings_total} reviews)</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Store */}
            {selectedPlace && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPlace.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedPlace.formatted_address}</p>
                  </div>
                  <Check className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            )}


            {/* Navigation */}
            <div className="flex space-x-3 pt-6">
              <button
                onClick={switchMode}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all hover:border-gray-300"
              >
                Back to Login
              </button>
              <button
                onClick={nextStep}
                disabled={!isStepValid}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                  isStepValid
                    ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 shadow-lg shadow-orange-500/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isStepValid ? 'group-hover:translate-x-1' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Business Details */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {/* Business Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
              <div className="relative">
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors appearance-none bg-white text-base [&>option]:bg-white"
                  required
                >
                  <option value="">Select your business type</option>
                  <option value="restaurant">🍽️ Restaurant</option>
                  <option value="bakery">🥖 Bakery</option>
                  <option value="supermarket">🛒 Supermarket</option>
                  <option value="local_cuisine">🍲 Local Cuisine</option>
                  <option value="others">🏢 Others</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <InteractiveInput
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="+234 801 234 5678"
                icon={Phone}
                required
              />
            </div>

            {/* Store Info Display */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Store Information</h3>
              <p className="text-sm text-gray-600"><strong>Name:</strong> {formData.name}</p>
              <p className="text-sm text-gray-600 mt-1"><strong>Address:</strong> {formData.address}</p>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                onClick={prevStep}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 hover:border-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={nextStep}
                disabled={!isStepValid}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                  isStepValid
                    ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 shadow-lg shadow-orange-500/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isStepValid ? 'group-hover:translate-x-1' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Account Setup */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <InteractiveInput
                type="email"
                name="email"
                value={formData.email}
                placeholder="partner@restaurant.com"
                icon={Mail}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Create Password</label>
              <InteractiveInput
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                placeholder="Create a secure password"
                icon={Lock}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                required
              />

              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded transition-all duration-200 ${
                        formData.password.length >= level * 2
                          ? formData.password.length >= 8
                            ? 'bg-green-500'
                            : formData.password.length >= 6
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password strength: {
                    formData.password.length >= 8 ? 'Strong' :
                    formData.password.length >= 6 ? 'Good' :
                    formData.password.length >= 1 ? 'Weak' : ''
                  }
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 hover:border-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={loading || !isStepValid}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                  loading || !isStepValid
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105 shadow-lg shadow-orange-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}