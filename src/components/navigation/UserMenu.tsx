import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, GitCompare, User, Settings, LogOut, Shield, Building, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useSavedFunds } from '@/hooks/useSavedFunds';
import { useComparison } from '@/contexts/ComparisonContext';
import { toast } from 'sonner';

const getSupabase = async () => (await import('@/integrations/supabase/client')).supabase;

interface UserMenuProps {
  variant?: 'light' | 'dark';
}

const UserMenu: React.FC<UserMenuProps> = ({ variant = 'light' }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAssignedFunds, setHasAssignedFunds] = useState(false);

  // Auth state with error handling
  let authState;
  try {
    authState = useEnhancedAuth();
  } catch (error) {
    authState = { user: null, profile: null, signOut: () => {}, loading: false };
  }

  const { user, profile, signOut, loading } = authState;
  const { savedFunds } = useSavedFunds();
  const { compareFunds } = useComparison();

  const savedCount = savedFunds.length;
  const compareCount = compareFunds.length;

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id || typeof window === 'undefined') {
        setIsAdmin(false);
        return;
      }

      try {
        const supabase = await getSupabase();
        const { data } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        setIsAdmin(!!data);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  // Check for assigned funds (manager access)
  useEffect(() => {
    const checkAssignedFunds = async () => {
      if (!user?.id || typeof window === 'undefined') {
        setHasAssignedFunds(false);
        return;
      }

      try {
        const supabase = await getSupabase();
        const { data } = await supabase
          .from('fund_managers')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);

        setHasAssignedFunds(!!data && data.length > 0);
      } catch (error) {
        setHasAssignedFunds(false);
      }
    };

    checkAssignedFunds();
  }, [user?.id]);

  const getDisplayName = (): string => {
    if (loading) return 'Loading...';
    if (!user) return 'Guest';

    if (profile) {
      if ('manager_name' in profile && (profile as any).manager_name) {
        return (profile as any).manager_name as string;
      }
      if ('first_name' in profile && 'last_name' in profile) {
        const firstName = (profile as any).first_name;
        const lastName = (profile as any).last_name;
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        }
      }
    }

    return user.email?.split('@')[0] || 'User';
  };

  const getInitials = (): string => {
    const name = getDisplayName();
    if (name === 'Loading...' || name === 'Guest') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarUrl = (): string => {
    if (profile && 'avatar_url' in profile) {
      return (profile as any).avatar_url || '';
    }
    return '';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const iconClass = variant === 'dark' 
    ? 'text-background hover:bg-background/10' 
    : 'text-foreground hover:bg-muted';

  const badgeClass = 'absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center';

  return (
    <div className="flex items-center gap-1">
      {/* Saved Funds */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/saved-funds')}
        className={`relative ${iconClass}`}
        aria-label={`Shortlist (${savedCount})`}
      >
        <Star className="h-5 w-5" />
        {savedCount > 0 && (
          <span className={badgeClass}>{savedCount}</span>
        )}
      </Button>

      {/* Compare */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/compare')}
        className={`relative ${iconClass}`}
        aria-label={`Compare (${compareCount})`}
      >
        <GitCompare className="h-5 w-5" />
        {compareCount > 0 && (
          <span className={badgeClass}>{compareCount}</span>
        )}
      </Button>

      {/* User Avatar / Login */}
      {!user ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/auth')}
          className={iconClass}
          aria-label="Sign in"
        >
          <User className="h-5 w-5" />
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${iconClass}`}
              aria-label="User menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg z-50">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium">{getDisplayName()}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/saved-funds" className="flex items-center gap-2 cursor-pointer">
                <Star className="h-4 w-4" />
                Shortlist
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account-settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            {hasAssignedFunds && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account-settings?tab=edits" className="flex items-center gap-2 cursor-pointer">
                    <Edit className="h-4 w-4" />
                    My Edits
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/manager/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Building className="h-4 w-4" />
                    Manage Funds
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserMenu;
