import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getEmailRedirectUrl } from '@/utils/authRedirect';
import { Profile } from '@/types/profile';
import { queryClient } from '@/providers/QueryProvider';

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  sendMagicLink: (email: string, metadata?: any) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  uploadAvatar: (file: File) => Promise<{ error: any; url?: string }>;
  refreshProfile: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
      return {
        user: null,
        session: null,
        loading: true,
        profile: null,
        sendMagicLink: async () => ({ error: null }),
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let subscription: any = null;
    let timeoutId: NodeJS.Timeout;
    
    const initializeAuth = async () => {
      try {
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event, session?.user?.email || 'no user');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user!.id).catch(console.error);
          // Check for pending invitations after auth
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            checkPendingInvitations(session.user.email!, session.user.id).catch(console.error);
          }
        }, 100);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

        subscription = authListener.data.subscription;

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user!.id).catch(console.error);
          }, 100);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('🔐 Auth initialization error:', error);
        setLoading(false);
      }
    };

    timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    initializeAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isHydrated]);

  const checkPendingInvitations = async (email: string, userId: string) => {
    try {
      console.log('🎫 Checking pending invitations for:', email, 'userId:', userId);
      
      const { data, error } = await supabase.functions.invoke('check-pending-invitations', {
        body: { email, userId },
      });

      if (error) {
        console.error('🎫 Error checking invitations:', error);
        return;
      }

      if (data?.acceptedInvitations && data.acceptedInvitations.length > 0) {
        console.log('🎫 Auto-accepted invitations:', data.acceptedInvitations);
        
        // Show success toast for each accepted invitation
        const companies = data.acceptedInvitations.map((inv: any) => inv.companyName);
        
        // Invalidate team member queries for all affected companies
        companies.forEach((companyName: string) => {
          queryClient.invalidateQueries({ queryKey: ['team-members', companyName] });
        });
        
        if (typeof window !== 'undefined') {
          const { toast } = await import('@/hooks/use-toast');
          toast({
            title: companies.length === 1 ? 'Team Access Granted!' : 'Multiple Team Invitations Accepted!',
            description: companies.length === 1 
              ? `You now have access to ${companies[0]}.`
              : `You now have access to: ${companies.join(', ')}`,
          });
        }

        // Refresh profile to get updated permissions
        if (user?.id) {
          await fetchProfile(user.id);
        }
      }
    } catch (error) {
      console.error('🎫 Error in checkPendingInvitations:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔐 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        console.log('🔐 Found profile:', data.email);
        setProfile(data as Profile);
      } else {
        console.warn('🔐 No profile found for user:', userId);
        setProfile(null);
      }
    } catch (error) {
      console.error('🔐 Error fetching profile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const redirectUrl = getEmailRedirectUrl();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: metadata?.first_name || '',
          last_name: metadata?.last_name || '',
          invitation_token: metadata?.invitation_token || undefined,
        },
      },
    });

    // Check for pending invitations after signup
    if (!error && email && data?.user?.id) {
      setTimeout(() => {
        checkPendingInvitations(email, data.user!.id).catch(console.error);
      }, 1000);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Check for pending invitations after signin
    if (!error && email && data?.user?.id) {
      setTimeout(() => {
        checkPendingInvitations(email, data.user!.id).catch(console.error);
      }, 500);
    }
    
    return { error };
  };

  const sendMagicLink = async (email: string, metadata?: any) => {
    try {
      console.log('🔐 Sending magic link to:', email);
      
      const { data, error } = await supabase.functions.invoke('send-magic-link', {
        body: { 
          email,
          metadata: {
            first_name: metadata?.first_name || '',
            last_name: metadata?.last_name || '',
            invitation_token: metadata?.invitation_token || undefined,
          }
        }
      });

      if (error) {
        console.error('❌ Magic link error:', error);
        return { error };
      }

      console.log('✅ Magic link sent successfully');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Magic link exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 Signing out user...');
      
      // Always clear local state first
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔐 Sign-out error (clearing session anyway):', error);
        // Clear localStorage as fallback for stale sessions
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sb-bkmvydnfhmkjnuszroim-auth-token');
        }
      } else {
        console.log('🔐 Successfully signed out');
      }
      
      return { error: null }; // Always return success to UI
    } catch (error) {
      console.error('🔐 Sign-out exception:', error);
      // Clear localStorage as fallback
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-bkmvydnfhmkjnuszroim-auth-token');
      }
      return { error: null }; // Always return success to UI
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }
    
    const { error } = await supabase
      .from('profiles')
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

    const cropToSquare = (input: File): Promise<File> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;

          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));

          ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Failed to create blob'));
            const cropped = new File([blob], input.name, { type: input.type, lastModified: Date.now() });
            resolve(cropped);
          }, input.type, 0.9);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(input);
      });
    };

    let fileToUpload: File = file;
    try {
      fileToUpload = await cropToSquare(file);
    } catch (_e) {
      // Fall back to original
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, fileToUpload, { upsert: true });

    if (uploadError) {
      return { error: uploadError };
    }

    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

    // Update both avatar_url and logo_url for backwards compatibility
    const { error: updateError } = await updateProfile({ 
      avatar_url: avatarUrl,
      logo_url: avatarUrl
    });

    return { error: updateError, url: avatarUrl };
  };

  const value = {
    user: isHydrated ? user : null,
    session: isHydrated ? session : null,
    loading: !isHydrated || loading,
    profile: isHydrated ? profile : null,
    sendMagicLink,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
    refreshProfile,
  };

  return <EnhancedAuthContext.Provider value={value}>{children}</EnhancedAuthContext.Provider>;
};
