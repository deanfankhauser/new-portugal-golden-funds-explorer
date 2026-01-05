import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileNavigation from '../MobileNavigation';
import DisclaimerBanner from '../common/DisclaimerBanner';

const HeaderHomepage: React.FC = () => {
  return (
    <>
      <DisclaimerBanner />
      <header className="bg-background border-b border-border/50 py-3 w-full">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center gap-4">
            {/* Left - Logo */}
            <div className="flex items-center flex-shrink-0">
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

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center">
              <NavLinks />
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
      </header>
    </>
  );
};

export default HeaderHomepage;
