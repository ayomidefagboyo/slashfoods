import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Partner } from '../lib/supabase';
import { getCurrentPartner } from '../services/supabaseService';

interface PartnerAuthContextType {
  partner: Partner | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: PartnerSignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshPartner: () => Promise<void>;
}

interface PartnerSignUpData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  business_type: string;
  description?: string;
}

const PartnerAuthContext = createContext<PartnerAuthContextType | undefined>(undefined);

export const usePartnerAuth = () => {
  const context = useContext(PartnerAuthContext);
  if (context === undefined) {
    throw new Error('usePartnerAuth must be used within a PartnerAuthProvider');
  }
  return context;
};

export const PartnerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPartner = async () => {
    try {
      const currentPartner = await getCurrentPartner();
      setPartner(currentPartner);
    } catch (error) {
      console.error('Error refreshing partner:', error);
      setPartner(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      await refreshPartner();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (data: PartnerSignUpData) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // Create partner record
      const { error: partnerError } = await supabase
        .from('partners')
        .insert([{
          email: data.email,
          name: data.name,
          phone: data.phone,
          address: data.address,
          business_type: data.business_type,
          description: data.description,
        }]);

      if (partnerError) throw partnerError;

      await refreshPartner();
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setPartner(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await refreshPartner();
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await refreshPartner();
        } else if (event === 'SIGNED_OUT') {
          setPartner(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    partner,
    loading,
    signIn,
    signUp,
    signOut,
    refreshPartner,
  };

  return (
    <PartnerAuthContext.Provider value={value}>
      {children}
    </PartnerAuthContext.Provider>
  );
};