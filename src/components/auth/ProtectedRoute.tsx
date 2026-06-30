import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Brain } from 'lucide-react';
import CitizenDashboard from '../../pages/CitizenDashboard';
import AuthorityDashboard from '../../pages/AuthorityDashboard';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  // 1. Loading state overlay
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090B] gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Brain className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 animate-pulse">
          Authenticating Session...
        </span>
      </div>
    );
  }

  // 2. Unauthenticated -> Render Landing Page (children)
  if (!user || !role) {
    return <>{children}</>;
  }

  // 3. Render Citizen Dashboard
  if (role === 'citizen') {
    return <CitizenDashboard />;
  }

  return <AuthorityDashboard />;
}
