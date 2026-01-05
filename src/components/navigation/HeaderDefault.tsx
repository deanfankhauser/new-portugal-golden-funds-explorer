import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileNavigation from '../MobileNavigation';
import DisclaimerBanner from '../common/DisclaimerBanner';

const HeaderDefault: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <DisclaimerBanner />
      <header className="bg-background border-b border-border/50 w-full">
        {/* Main Header Row */}
        <div className="py-3">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center gap-4">
              {/* Left - Menu Toggle (Desktop) */}
              <div className="hidden md:flex items-center flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMenu}
                  className="text-foreground hover:bg-muted gap-2"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">Menu</span>
                </Button>
              </div>

              {/* Center - Logo */}
              <div className="flex items-center justify-center flex-1 md:flex-none">
                <Link to="/" className="flex items-center">
                  <img
                    src="/lovable-uploads/ab17d046-1cb9-44fd-aa6d-c4d338e11090.png"
                    alt="Movingto Logo"
                    className="h-6"
                    width="116"
                    height="24"
                  />
                </Link>
              </div>

              {/* Right - User Menu (Desktop) */}
              <div className="hidden md:flex items-center flex-shrink-0">
                <UserMenu variant="light" />
              </div>

              {/* Mobile Navigation */}
              <div className="flex md:hidden items-center">
                <MobileNavigation />
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Navigation Row (Desktop) */}
        {isMenuOpen && (
          <div className="hidden md:block border-t border-border/50 bg-muted/30">
            <div className="container mx-auto px-4 py-2">
              <NavLinks onLinkClick={closeMenu} />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default HeaderDefault;
