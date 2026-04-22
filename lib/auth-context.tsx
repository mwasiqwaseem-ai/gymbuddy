'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone: string | null;
  isAdmin: boolean;
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'cancelled';
  trialEndDate: Date | null;
  subscriptionEndDate: Date | null;
  stripeCustomerId: string | null;
  height: string;
  weight: string;
  goal: string;
  age: string;
  streak: number;
  lastWorkoutDate: string | null;
  favorites: string[];
  createdAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  isSubscribed: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (firebaseUser: User) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setUserData({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phone: firebaseUser.phoneNumber,
        isAdmin: data.isAdmin || false,
        subscriptionStatus: data.subscriptionStatus || 'trial',
        trialEndDate: data.trialEndDate?.toDate() || null,
        subscriptionEndDate: data.subscriptionEndDate?.toDate() || null,
        stripeCustomerId: data.stripeCustomerId || null,
        height: data.height || '',
        weight: data.weight || '',
        goal: data.goal || '',
        age: data.age || '',
        streak: data.streak || 0,
        lastWorkoutDate: data.lastWorkoutDate || null,
        favorites: data.favorites || [],
        createdAt: data.createdAt?.toDate() || null,
      });
    } else {
      // New user — create profile with 7-day trial
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);
      const newUserData = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phone: firebaseUser.phoneNumber,
        isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        subscriptionStatus: 'trial',
        trialEndDate: trialEnd,
        subscriptionEndDate: null,
        stripeCustomerId: null,
        height: '',
        weight: '',
        goal: 'Build Muscle',
        age: '',
        streak: 0,
        lastWorkoutDate: null,
        favorites: [],
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, newUserData);
      setUserData({
        uid: firebaseUser.uid,
        ...newUserData,
        trialEndDate: trialEnd,
        subscriptionEndDate: null,
        createdAt: new Date(),
      } as UserData);
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithPhone = async (phoneNumber: string) => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, data, { merge: true });
    setUserData((prev) => prev ? { ...prev, ...data } : null);
  };

  const isSubscribed = () => {
    if (!userData) return false;
    if (userData.subscriptionStatus === 'active') return true;
    if (userData.subscriptionStatus === 'trial' && userData.trialEndDate) {
      return new Date() < userData.trialEndDate;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user, userData, loading,
      signInWithGoogle, signInWithPhone,
      logout, updateUserData, isSubscribed
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
