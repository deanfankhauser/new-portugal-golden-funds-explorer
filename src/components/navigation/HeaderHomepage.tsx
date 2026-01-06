import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileNavigation from '../MobileNavigation';
import DisclaimerBanner from '../common/DisclaimerBanner';
import { Button } from '@/components/ui/button';
import { buildContactUrl, openExternalLink } from '@/utils/urlHelpers';

const HeaderHomepage: React.FC = () => {
  const handleGetInTouch = () => {
    openExternalLink(buildContactUrl('nav_get_in_touch'));
  };

  return (
    <>
      <DisclaimerBanner />
      <header className="bg-white border-b border-border/50 py-3 w-full">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center gap-4">
            {/* Left - Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/lovable-uploads/movingto-logo-black.png"
                  alt="Movingto Logo"
                  className="h-6"
                  width="116"
                  height="24"
                />
              </Link>
            </div>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center">
              <NavLinks />
            </div>

            {/* Right - Get in touch + User Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Button
                variant="default"
                size="sm"
                onClick={handleGetInTouch}
              >
                Get in touch
              </Button>
              <UserMenu variant="light" />
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center">
              <MobileNavigation />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderHomepage;
