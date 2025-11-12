
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import AuthAwareButton from "./auth/AuthAwareButton";
import GlobalSearch from "./GlobalSearch";
import ComparisonIndicator from "./ComparisonIndicator";
import MobileNavigation from "./MobileNavigation";
import DisclaimerBanner from "./common/DisclaimerBanner";

const Header = () => {
  return (
    <>
      <DisclaimerBanner />
      <header className="bg-foreground text-background py-3 shadow-lg w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center gap-4 w-full">
          {/* Left section - Logo */}
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

          {/* Global Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <GlobalSearch />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Button 
              variant="secondary" 
              asChild
            >
              <Link to="/saved-funds">
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Saved Funds</span>
              </Link>
            </Button>
            <ComparisonIndicator />
            <AuthAwareButton />
          </div>

          {/* Mobile Navigation and Comparison */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <ComparisonIndicator />
            <MobileNavigation />
          </div>
        </div>
        
        {/* Global Search - Mobile (full width below header) */}
        <div className="md:hidden mt-3">
          <GlobalSearch />
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
