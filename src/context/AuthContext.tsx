import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { 
  signInWithGoogle, 
  logoutUser, 
  getUserProfile, 
  createUserProfile, 
  updateLastLogin 
} from '../services/authService';

interface AuthContextType {
  user: FirebaseUser | null;
  role: 'citizen' | 'authority' | '' | null; // null means not loaded, '' means onboarding needed
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (role: 'citizen' | 'authority') => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<'citizen' | 'authority' | '' | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            await updateLastLogin(currentUser.uid);
            setRole(profile.role);
          } else {
            // User exists in Auth but has no Firestore profile -> onboarding required
            setRole('');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setRole('');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const firebaseUser = await signInWithGoogle();
      const profile = await getUserProfile(firebaseUser.uid);
      if (profile) {
        await updateLastLogin(firebaseUser.uid);
        setRole(profile.role);
      } else {
        setRole('');
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (selectedRole: 'citizen' | 'authority') => {
    if (!user) throw new Error('No authenticated user found');
    setLoading(true);
    try {
      const profile = await createUserProfile(user, selectedRole);
      setRole(profile.role);
    } catch (err) {
      console.error('Failed to create user profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}
