import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ManagerLoginModal from './ManagerLoginModal';
import ManagerProfileModal from './ManagerProfileModal';

const ManagerAuthButton: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!isAuthenticated) {
    return (
      <>
        <Button 
          variant="outline" 
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Manager Login
        </Button>
        
        <ManagerLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Manager';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="text-sm">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block font-medium">
              {userName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Profile Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {user && (
        <ManagerProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
        />
      )}
    </>
  );
};

export default ManagerAuthButton;