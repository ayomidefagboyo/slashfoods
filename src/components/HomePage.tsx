import { ShoppingBag, Store, TrendingDown, MapPin, Clock, ChevronRight, Sparkles, Leaf } from 'lucide-react';
import Logo from './Logo';

interface HomePageProps {
  onNavigate: (view: 'home' | 'customer' | 'partner') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-md fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="transform rotate-3">
                  <Logo className="w-12 h-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-fredoka font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  SlashFood
                </h1>
                <p className="text-xs text-orange-500">Waste Less. Save More.</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#how" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">How It Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Benefits</a>
              <a href="#partners" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Partners</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('customer')}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
              >
                Browse Deals
              </button>
              <button
                onClick={() => onNavigate('partner')}
                className="px-6 py-2.5 border-2 border-orange-200 text-orange-500 hover:bg-orange-50 rounded-xl font-semibold transition-all"
              >
                Partner Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">

              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Get Massive Savings on<br />
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Food & Groceries.
                </span>
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('customer')}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/40 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Start Saving Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('partner')}
                  className="px-8 py-4 border-2 border-orange-200 text-orange-500 hover:bg-orange-50 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Store className="w-5 h-5" />
                  <span>Become a Partner</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500">Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-500">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">2M+</div>
                  <div className="text-sm text-gray-500">Meals Saved</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-3xl opacity-10"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <DealCard
                    title="Chicken Shawarma"
                    vendor="Kilimanjaro Lagos"
                    original="₦2,500"
                    price="₦750"
                    discount="70%"
                    time="Pickup: 7-9 PM"
                  />
                  <DealCard
                    title="Jollof Rice & Chicken"
                    vendor="Mama Put Express"
                    original="₦1,800"
                    price="₦600"
                    discount="67%"
                    time="Pickup: 6-8 PM"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <DealCard
                    title="Fresh Baked Goods"
                    vendor="Sweet Sensations"
                    original="₦3,000"
                    price="₦900"
                    discount="70%"
                    time="Pickup: 8-10 PM"
                  />
                  <DealCard
                    title="Mixed Grill Platter"
                    vendor="Grill Masters VI"
                    original="₦4,500"
                    price="₦1,350"
                    discount="70%"
                    time="Pickup: 9-11 PM"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How <span className="font-fredoka font-semibold text-orange-600">SlashFood</span> Works</h3>
            <p className="text-xl text-gray-600">Three simple steps to start saving</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon={<MapPin className="w-8 h-8" />}
              title="Find Nearby Deals"
              description="Browse restaurants and stores near you offering discounted surprise bags of delicious food."
            />
            <StepCard
              number="2"
              icon={<ShoppingBag className="w-8 h-8" />}
              title="Reserve Your Bag"
              description="Pay securely through our platform using your preferred Nigerian payment method."
            />
            <StepCard
              number="3"
              icon={<Clock className="w-8 h-8" />}
              title="Pick Up & Enjoy"
              description="Collect your food during the pickup window and enjoy great meals at amazing prices!"
            />
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-bold text-gray-900">
                Why Choose <span className="font-fredoka font-semibold text-orange-600">SlashFood</span>?
              </h3>

              <BenefitItem
                icon={<TrendingDown className="w-6 h-6 text-orange-500" />}
                title="Save Up to 70%"
                description="Get your favorite meals at a fraction of the cost. Perfect for students, families, and anyone who loves great deals."
              />

              <BenefitItem
                icon={<Leaf className="w-6 h-6 text-orange-500" />}
                title="Fight Food Waste"
                description="Help reduce the 40% of food that goes to waste in Nigeria while making a positive environmental impact."
              />

              <BenefitItem
                icon={<Store className="w-6 h-6 text-orange-500" />}
                title="Support Local Businesses"
                description="Help your favorite restaurants and stores reduce waste and attract new customers."
              />
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-3xl p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Join the Movement</h4>
              <div className="space-y-6">
                <StatItem label="CO2 Emissions Saved" value="1,200+ tons" />
                <StatItem label="Meals Rescued" value="2M+" />
                <StatItem label="Money Saved by Users" value="₦450M+" />
                <StatItem label="Partner Businesses" value="500+" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo className="w-10 h-10" />
                <span className="text-xl font-fredoka font-semibold text-orange-600">SlashFood</span>
              </div>
              <p className="text-gray-600 text-sm">Fighting food waste, one meal at a time.</p>
            </div>

            <div>
              <h5 className="text-gray-900 font-semibold mb-4">For Customers</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>How It Works</li>
                <li>Find Deals</li>
                <li>Help Center</li>
              </ul>
            </div>

            <div>
              <h5 className="text-gray-900 font-semibold mb-4">For Partners</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>Become a Partner</li>
                <li>Partner Dashboard</li>
                <li>Resources</li>
              </ul>
            </div>

            <div>
              <h5 className="text-gray-900 font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>&copy; 2025 <span className="font-fredoka font-semibold text-orange-600">SlashFood</span> Nigeria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DealCard({ title, vendor, original, price, discount, time }: {
  title: string;
  vendor: string;
  original: string;
  price: string;
  discount: string;
  time: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer relative">
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-3 flex items-center justify-center">
        <ShoppingBag className="w-8 h-8 text-orange-400" />
      </div>
      <div className="absolute top-6 right-6 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        -{discount} OFF
      </div>
      <h4 className="text-gray-900 font-bold text-sm mb-1">{title}</h4>
      <p className="text-gray-600 text-xs mb-2">{vendor}</p>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-900 font-bold text-lg">{price}</span>
          <span className="text-gray-500 text-xs line-through">{original}</span>
        </div>
      </div>
      <div className="flex items-center text-orange-500 text-xs">
        <Clock className="w-3 h-3 mr-1" />
        {time}
      </div>
    </div>
  );
}

function StepCard({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-orange-300 hover:shadow-lg transition-all">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {number}
        </div>
        <div className="text-orange-500 mb-4">{icon}</div>
        <h4 className="text-gray-900 font-bold text-xl mb-3">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h5 className="text-gray-900 font-bold text-lg mb-2">{title}</h5>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-orange-200 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-bold text-xl">{value}</span>
    </div>
  );
}
