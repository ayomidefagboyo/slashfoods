import { useState } from 'react';
import HomePage from './components/HomePage';
import CustomerInterface from './components/CustomerInterface';
import PartnerDashboard from './components/PartnerDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'customer' | 'partner'>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {currentView === 'home' && <HomePage onNavigate={setCurrentView} />}
      {currentView === 'customer' && <CustomerInterface onNavigate={setCurrentView} />}
      {currentView === 'partner' && <PartnerDashboard onNavigate={setCurrentView} />}
    </div>
  );
}

export default App;
