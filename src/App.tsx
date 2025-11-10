import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import CustomerInterface from './components/CustomerInterface';
import PartnerDashboard from './components/PartnerDashboard';
import { PartnerAuthProvider } from './contexts/PartnerAuthContext';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'customer' | 'partner'>('home');

  useEffect(() => {
    // Set default view based on screen size after component mounts
    const handleInitialView = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setCurrentView('customer');
        }
      }
    };

    handleInitialView();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PartnerAuthProvider>
        {currentView === 'home' && <HomePage onNavigate={setCurrentView} />}
        {currentView === 'customer' && <CustomerInterface onNavigate={setCurrentView} />}
        {currentView === 'partner' && <PartnerDashboard onNavigate={setCurrentView} />}
      </PartnerAuthProvider>
    </div>
  );
}

export default App;
