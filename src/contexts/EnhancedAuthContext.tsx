import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface ManagerProfile extends UserProfile {
  company_name: string;
  manager_name: string;
  phone?: string;
  website?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  registration_number?: string;
  license_number?: string;
  status: 'pending' | 'approved' | 'rejected';
  assets_under_management?: number;
  founded_year?: number;
  logo_url?: string;
}

interface InvestorProfile extends UserProfile {
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  country?: string;
  investment_experience?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  risk_tolerance?: 'conservative' | 'moderate' | 'aggressive';
  annual_income_range?: string;
  net_worth_range?: string;
}

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userType: 'manager' | 'investor' | null;
  profile: ManagerProfile | InvestorProfile | null;
  signUp: (email: string, password: string, userType: 'manager' | 'investor', metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<ManagerProfile | InvestorProfile>) => Promise<{ error: any }>;
  uploadAvatar: (file: File) => Promise<{ error: any; url?: string }>;
  refreshProfile: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    // During SSR, return a safe default instead of throwing
    if (typeof window === 'undefined') {
      return {
        user: null,
        session: null,
        loading: true,
        userType: null,
        profile: null,
        signUp: async () => ({ error: null }),
        signIn: async () => ({ error: null }),
        signOut: async () => ({ error: null }),
        updateProfile: async () => ({ error: null }),
        uploadAvatar: async () => ({ error: null }),
        refreshProfile: async () => {},
      };
    }
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'manager' | 'investor' | null>(null);
  const [profile, setProfile] = useState<ManagerProfile | InvestorProfile | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      // Try to fetch manager profile first
      const { data: managerData, error: managerError } = await supabase
        .from('manager_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (managerData && !managerError) {
        setUserType('manager');
        setProfile(managerData as ManagerProfile);
        return;
      }

      // If no manager profile, try investor profile
      const { data: investorData, error: investorError } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (investorData && !investorError) {
        setUserType('investor');
        setProfile(investorData as InvestorProfile);
        return;
      }

      // No profile found
      setUserType(null);
      setProfile(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserType(null);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setUserType(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userType: 'manager' | 'investor', metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const enhancedMetadata = {
      ...metadata,
      [userType === 'manager' ? 'is_manager' : 'is_investor']: true
    };
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: enhancedMetadata
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUserType(null);
      setProfile(null);
    }
    return { error };
  };

  const updateProfile = async (updates: Partial<ManagerProfile | InvestorProfile>) => {
    if (!user || !userType) {
      return { error: new Error('Not authenticated') };
    }

    const tableName = userType === 'manager' ? 'manager_profiles' : 'investor_profiles';
    
    const { error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      await refreshProfile();
    }

    return { error };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return { error: uploadError };
    }

    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    const avatarUrl = data.publicUrl;

    // Update profile with new avatar URL
    const { error: updateError } = await updateProfile({ avatar_url: avatarUrl });

    return { error: updateError, url: avatarUrl };
  };

  const value = {
    user,
    session,
    loading,
    userType,
    profile,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
    refreshProfile,
  };

  return <EnhancedAuthContext.Provider value={value}>{children}</EnhancedAuthContext.Provider>;
};