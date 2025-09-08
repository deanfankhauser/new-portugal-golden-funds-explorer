import React from 'react';
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
import { User, Settings, LogOut, Building, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import UniversalAuthButton from './UniversalAuthButton';

const AuthAwareButton = () => {
  const { user, profile, userType, signOut, loading } = useEnhancedAuth();

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (!user || !profile) {
    return <UniversalAuthButton />;
  }

  const getDisplayName = () => {
    if (userType === 'manager' && profile.manager_name) {
      return profile.manager_name;
    }
    if (userType === 'investor' && profile.first_name) {
      return `${profile.first_name} ${profile.last_name || ''}`.trim();
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
    if (userType === 'manager') {
      return profile.logo_url;
    }
    return profile.avatar_url;
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
          <Link to="/account-settings" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account-settings" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
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