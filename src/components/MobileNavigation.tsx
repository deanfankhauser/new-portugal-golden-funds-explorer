import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { buildContactUrl } from "../utils/urlHelpers";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Calculator, ClipboardCheck, Mail, ExternalLink, Users, FileText, Star, User, Settings, LogOut, Building, TrendingUp, Shield, LogIn, Sparkles } from 'lucide-react';
import { FundMatcherQuiz } from "./quiz/FundMatcherQuiz";
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

const getSupabase = async () => (await import('@/integrations/supabase/client')).supabase;

const MobileNavigation = () => {
  const [open, setOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  // Auth state with error handling
  let authState;
  try {
    authState = useEnhancedAuth();
  } catch (error) {
    console.error('Auth context error in mobile nav:', error);
    authState = { user: null, profile: null, userType: null, signOut: () => {}, loading: false };
  }

  const { user, profile, userType, signOut, loading } = authState;

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id || typeof window === 'undefined') {
        setIsAdmin(false);
        return;
      }

      try {
        const supabase = await getSupabase();
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

        setIsAdmin(!!data);
      } catch (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  const getDisplayName = (): string => {
    if (loading) return 'Loading...';
    if (!user) return 'Guest';
    
    if (userType === 'manager' && profile && 'manager_name' in profile && (profile as any).manager_name) {
      return (profile as any).manager_name as string;
    }
    if (userType === 'investor' && profile && 'first_name' in profile && 'last_name' in profile) {
      const firstName = (profile as any).first_name;
      const lastName = (profile as any).last_name;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
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
      closeMenu();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const closeMenu = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-background hover:bg-background/10"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          {/* Authentication Section */}
          {!user ? (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Account
              </h3>
              <div className="space-y-2">
                <Link to="/auth" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <LogIn className="h-5 w-5" />
                    <span>Login / Sign Up</span>
                  </Button>
                </Link>
              </div>
              <Separator className="mt-4" />
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Profile
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {userType === 'manager' ? (
                      <Building className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    )}
                    <p className="font-medium text-sm truncate">{getDisplayName()}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Link to="/saved-funds" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <Star className="h-5 w-5" />
                    <span>Watchlist</span>
                  </Button>
                </Link>
                <Link to="/account-settings" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <User className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </Button>
                </Link>
                {userType === 'manager' && (
                  <Link to="/account-settings?tab=edits" onClick={closeMenu}>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                      <Settings className="h-5 w-5" />
                      <span>My Edits</span>
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu}>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                      <Shield className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </Button>
              </div>
              <Separator className="mt-4" />
            </div>
          )}

          {/* Tools Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Tools
            </h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  closeMenu();
                  setQuizOpen(true);
                }}
              >
                <Sparkles className="h-5 w-5" />
                <span>Fund Matcher Quiz</span>
              </Button>
              <Link to="/roi-calculator" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Calculator className="h-5 w-5" />
                  <span>ROI Calculator</span>
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          {/* Browse Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Browse
            </h3>
            <div className="space-y-2">
              <Link to="/managers" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Users className="h-5 w-5" />
                  <span>Fund Managers</span>
                </Button>
              </Link>
              <Link to="/categories" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <ExternalLink className="h-5 w-5" />
                  <span>Categories</span>
                </Button>
              </Link>
              <Link to="/tags" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <ExternalLink className="h-5 w-5" />
                  <span>Tags</span>
                </Button>
              </Link>
              <Link to="/verified-funds" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <ClipboardCheck className="h-5 w-5 text-success" />
                  <span>Verified Funds</span>
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Support
            </h3>
            <Button 
              asChild
              variant="ghost" 
              className="w-full justify-start gap-3 h-12"
            >
              <a 
                href={buildContactUrl('mobile-nav')}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                <Mail className="h-5 w-5" />
                <span>Get in Touch</span>
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
      
      <FundMatcherQuiz open={quizOpen} onOpenChange={setQuizOpen} />
    </Sheet>
  );
};

export default MobileNavigation;