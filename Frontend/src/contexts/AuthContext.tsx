import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Firebase user to our User interface
  const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin User',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || undefined,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = convertFirebaseUser(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = convertFirebaseUser(userCredential.user);
      setUser(userData);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userData = convertFirebaseUser(userCredential.user);
      setUser(userData);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};