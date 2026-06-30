import { GoogleAuthProvider, signInWithPopup, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const provider = new GoogleAuthProvider();

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: 'citizen' | 'authority' | '';
  createdAt: any;
  lastLogin: any;
  communityScore: number;
  reportsSubmitted: number;
  reportsVerified: number;
  badges: string[];
  status: 'active' | 'suspended';
}

// Signs in a user via Google popup
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Logs out current user session
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Gets user profile document from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

// Creates a new user profile document in Firestore
export const createUserProfile = async (user: FirebaseUser, role: 'citizen' | 'authority'): Promise<UserProfile> => {
  const docRef = doc(db, 'users', user.uid);
  const newProfile: UserProfile = {
    uid: user.uid,
    name: user.displayName || 'CivicMind User',
    email: user.email || '',
    photoURL: user.photoURL || '',
    role,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    communityScore: 0,
    reportsSubmitted: 0,
    reportsVerified: 0,
    badges: [],
    status: 'active',
  };

  await setDoc(docRef, newProfile);
  return newProfile;
};

// Updates the last login timestamp of a user
export const updateLastLogin = async (uid: string): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    lastLogin: serverTimestamp(),
  });
};

// Increments reports submitted count atomically in Firestore
export const incrementUserReportsCount = async (uid: string): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    reportsSubmitted: increment(1),
  });
};
