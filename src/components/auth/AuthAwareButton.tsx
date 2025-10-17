import React, { useState, useEffect } from 'react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, Building, TrendingUp, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import UniversalAuthButton from './UniversalAuthButton';
import { supabase } from '@/integrations/supabase/client';

const AuthAwareButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  // SSR-safe: Don't render during server-side rendering
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Add error boundary and safe fallback
  let authState;
  try {
    authState = useEnhancedAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    return <UniversalAuthButton />;
  }

  const { user, profile, userType, signOut, loading } = authState;

  console.log('🔐 AuthAwareButton state:', { user: !!user, profile: !!profile, loading, userType });

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          return;
        }

        // Only set admin if we actually have a record with a valid role
        setIsAdmin(data && data.role ? true : false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  // Show login button during loading (hydration) or if no user
  if (loading || !user) {
    return <UniversalAuthButton />;
  }

  const getDisplayName = () => {
    if (userType === 'manager' && profile && 'manager_name' in profile && (profile as any).manager_name) {
      return (profile as any).manager_name as string;
    }
    if (userType === 'investor' && profile && 'first_name' in profile && (profile as any).first_name) {
      const p: any = profile;
      return `${p.first_name} ${p.last_name || ''}`.trim();
    }
    return user.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = () => {
    if (!profile) return undefined;
    if (userType === 'manager' && 'logo_url' in (profile as any)) {
      return (profile as any).logo_url as string | undefined;
    }
    if (userType === 'investor' && 'avatar_url' in (profile as any)) {
      return (profile as any).avatar_url as string | undefined;
    }
    return undefined;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <div className="flex items-center gap-1">
              {userType === 'manager' ? (
                <Building className="h-3 w-3 text-muted-foreground" />
              ) : (
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
              )}
              <p className="font-medium text-sm">{getDisplayName()}</p>
            </div>
            <p className="w-[200px] truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/saved-funds" className="w-full cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Saved Funds
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account-settings" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        {userType === 'manager' && (
          <DropdownMenuItem asChild>
            <Link to="/account-settings?tab=edits" className="w-full cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              My Edits
            </Link>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="w-full cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthAwareButton;