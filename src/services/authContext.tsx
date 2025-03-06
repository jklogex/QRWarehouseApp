import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile, onAuthStateChange, supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  email: string;
  role: string;
  displayName: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  setUserProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current session
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user profile from Supabase
        const profileResult = await getUserProfile(currentUser.id);
        if (profileResult.success) {
          setUserProfile(profileResult.profile as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    };

    getCurrentUser();

    // Set up auth state change listener
    const { data: authListener } = onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user profile from Supabase
        const profileResult = await getUserProfile(currentUser.id);
        if (profileResult.success) {
          setUserProfile(profileResult.profile as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    setUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 