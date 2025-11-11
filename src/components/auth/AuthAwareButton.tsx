import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, User, Settings, LogOut, Shield, Building, TrendingUp } from 'lucide-react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import UniversalAuthButton from './UniversalAuthButton';
import { supabase } from '@/integrations/supabase/client';
import { getDisplayName, getAvatarUrl, isManagerProfile } from '@/types/profile';

const AuthAwareButton: React.FC = () => {
  const { user, profile, signOut, loading } = useEnhancedAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAssignedFunds, setHasAssignedFunds] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }

      console.log('🔐 Checking admin status for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const adminStatus = !!data && !error;
        console.log('🔐 Admin check result:', { 
          userId: user.id, 
          isAdmin: adminStatus,
          hasData: !!data,
          error: error?.message 
        });
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('🔐 Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  useEffect(() => {
    const checkManagerAccess = async () => {
      if (!user?.id) {
        setHasAssignedFunds(false);
        return;
      }

      try {
        // Primary: Check company-level assignments
        const { count: companyCount, error: companyErr } = await supabase
          .from('manager_profile_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active');

        let hasAccess = (companyCount || 0) > 0;

        // Legacy fallback: Check fund-level assignments
        if (!hasAccess) {
          const { count: fundCount } = await supabase
            .from('fund_managers' as any)
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'active');

          hasAccess = (fundCount || 0) > 0;
        }

        setHasAssignedFunds(hasAccess);
      } catch (error) {
        console.error('Error checking manager access:', error);
        setHasAssignedFunds(false);
      }
    };

    checkManagerAccess();
  }, [user?.id]);

  console.log('🔐 AuthAwareButton state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    isAdmin,
    loading
  });

  if (loading || !user || !profile) {
    return <UniversalAuthButton />;
  }

  const displayName = getDisplayName(profile);
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarUrl = getAvatarUrl(profile);
  const isManager = isManagerProfile(profile);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex items-center justify-start gap-2">
            <div className="flex flex-col space-y-1 leading-none">
              <div className="flex items-center gap-1">
                {isManager ? (
                  <Building className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                )}
                <p className="font-medium text-sm">{displayName}</p>
              </div>
              <p className="w-[200px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
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
        
        {isManager && (
          <DropdownMenuItem asChild>
            <Link to="/account-settings?tab=edits" className="w-full cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              My Edits
            </Link>
          </DropdownMenuItem>
        )}

        {hasAssignedFunds && (
          <DropdownMenuItem asChild>
            <Link to="/my-funds" className="w-full cursor-pointer">
              <Building className="mr-2 h-4 w-4" />
              Manage My Funds
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
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthAwareButton;
