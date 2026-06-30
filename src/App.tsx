import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import LiveAIAnalysis from './components/LiveAIAnalysis';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CityPulse from './components/CityPulse';
import MunicipalCopilot from './components/MunicipalCopilot';
import CityIntelligenceMap from './components/CityIntelligenceMap';
import PlatformPreview from './components/PlatformPreview';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import RoleSelectionModal from './components/auth/RoleSelectionModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { role, login, completeOnboarding } = useAuth();
  const [isOnboardingSubmitting, setIsOnboardingSubmitting] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error('Auth Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorToast('Google popup was closed before authentication.');
      } else if (err.code === 'auth/network-request-failed') {
        setErrorToast('Network connection failed. Please try again.');
      } else {
        setErrorToast(err.message || 'Sign-In failed.');
      }
      setTimeout(() => setErrorToast(null), 5000);
    }
  };

  const handleSelectRole = async (selectedRole: 'citizen' | 'authority') => {
    setIsOnboardingSubmitting(true);
    try {
      await completeOnboarding(selectedRole);
    } catch (err: any) {
      console.error('Role setup failed:', err);
      setErrorToast(err.message || 'Onboarding setup failed. Try again.');
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsOnboardingSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-background text-zinc-100">
        {/* Sticky Header Navigation */}
        <Navbar onScrollToSection={handleScrollToSection} />

        {/* Main Landing Sections */}
        <main className="relative">
          <Hero onGetStarted={handleLogin} />
          <TrustedBy />
          <LiveAIAnalysis />
          <Features />
          <HowItWorks />
          <CityPulse />
          <MunicipalCopilot />
          <CityIntelligenceMap />
          <PlatformPreview />
          <Stats />
          <Testimonials />
          <CTA onGetStarted={handleLogin} />
        </main>

        {/* Startup-style Mega Footer */}
        <Footer onScrollToSection={handleScrollToSection} />

        {/* First Login Experience Onboarding Modal */}
        {role === '' && (
          <RoleSelectionModal 
            onSelectRole={handleSelectRole} 
            isSubmitting={isOnboardingSubmitting} 
          />
        )}

        {/* Error Toast Notification Overlay */}
        {errorToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-rose-500/20 bg-zinc-950 text-rose-500 shadow-lg text-xs font-bold flex items-center gap-2 max-w-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>{errorToast}</span>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
