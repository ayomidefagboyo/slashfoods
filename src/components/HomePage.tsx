import { ShoppingBag, Store, Leaf, TrendingDown, MapPin, Clock, ChevronRight, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: 'home' | 'customer' | 'partner') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-emerald-500/20 backdrop-blur-md bg-slate-900/50 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center transform rotate-3">
                  <Leaf className="w-7 h-7 text-white transform -rotate-3" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
                  SlashFood
                </h1>
                <p className="text-xs text-emerald-400/80">Waste Less. Save More.</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#how" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">How It Works</a>
              <a href="#benefits" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Benefits</a>
              <a href="#partners" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Partners</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('customer')}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                Browse Deals
              </button>
              <button
                onClick={() => onNavigate('partner')}
                className="px-6 py-2.5 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-xl font-semibold transition-all"
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
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">Nigeria's First Food Waste Platform</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Save Money.<br />
                <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
                  Fight Food Waste.
                </span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed">
                Connect with restaurants, supermarkets, and vendors across Nigeria to buy delicious food at up to 70% off before it goes to waste.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('customer')}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-emerald-500/40 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Start Saving Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('partner')}
                  className="px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Store className="w-5 h-5" />
                  <span>Become a Partner</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-400">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2M+</div>
                  <div className="text-sm text-gray-400">Meals Saved</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl blur-3xl opacity-20"></div>
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

      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">How SlashFood Works</h3>
            <p className="text-xl text-gray-400">Three simple steps to start saving</p>
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

      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-bold text-white">
                Why Choose SlashFood?
              </h3>

              <BenefitItem
                icon={<TrendingDown className="w-6 h-6 text-emerald-400" />}
                title="Save Up to 70%"
                description="Get your favorite meals at a fraction of the cost. Perfect for students, families, and anyone who loves great deals."
              />

              <BenefitItem
                icon={<Leaf className="w-6 h-6 text-emerald-400" />}
                title="Fight Food Waste"
                description="Help reduce the 40% of food that goes to waste in Nigeria while making a positive environmental impact."
              />

              <BenefitItem
                icon={<Store className="w-6 h-6 text-emerald-400" />}
                title="Support Local Businesses"
                description="Help your favorite restaurants and stores reduce waste and attract new customers."
              />
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-sm">
              <h4 className="text-2xl font-bold text-white mb-6">Join the Movement</h4>
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

      <footer className="border-t border-emerald-500/20 py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SlashFood</span>
              </div>
              <p className="text-gray-400 text-sm">Fighting food waste, one meal at a time.</p>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">For Customers</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>How It Works</li>
                <li>Find Deals</li>
                <li>Help Center</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">For Partners</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Become a Partner</li>
                <li>Partner Dashboard</li>
                <li>Resources</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-emerald-500/20 text-center text-gray-400 text-sm">
            <p>&copy; 2025 SlashFood Nigeria. All rights reserved.</p>
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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-4 hover:border-emerald-500/60 transition-all transform hover:scale-105 cursor-pointer">
      <div className="aspect-video bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl mb-3 flex items-center justify-center">
        <ShoppingBag className="w-8 h-8 text-white/60" />
      </div>
      <div className="absolute top-6 right-6 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
        -{discount} OFF
      </div>
      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
      <p className="text-gray-400 text-xs mb-2">{vendor}</p>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold text-lg">{price}</span>
          <span className="text-gray-500 text-xs line-through">{original}</span>
        </div>
      </div>
      <div className="flex items-center text-emerald-400 text-xs">
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
      <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-500/60 transition-all">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {number}
        </div>
        <div className="text-emerald-400 mb-4">{icon}</div>
        <h4 className="text-white font-bold text-xl mb-3">{title}</h4>
        <p className="text-gray-400">{description}</p>
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
      <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h5 className="text-white font-bold text-lg mb-2">{title}</h5>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-emerald-500/20 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-bold text-xl">{value}</span>
    </div>
  );
}
