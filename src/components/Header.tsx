
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, ChevronDown, Calculator, Target, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthAwareButton from "./auth/AuthAwareButton";
import GlobalSearch from "./GlobalSearch";
import ComparisonIndicator from "./ComparisonIndicator";
import SavedFundsIndicator from "./SavedFundsIndicator";
import MobileNavigation from "./MobileNavigation";
import DisclaimerBanner from "./common/DisclaimerBanner";

const Header = () => {
  return (
    <>
      <DisclaimerBanner />
      <header className="bg-foreground text-background py-3 shadow-lg w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center gap-4 w-full">
          {/* Left section - Logo and Hamburger Menu */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/ab17d046-1cb9-44fd-aa6d-c4d338e11090.png" 
                alt="Movingto Logo" 
                className="h-6"
                width="116"
                height="24"
              />
            </Link>
            
            {/* Hamburger Menu - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-background hover:bg-background/10 hover:text-white"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/about" className="w-full cursor-pointer">
                      About Us
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/submit-fund" className="w-full cursor-pointer">
                      Submit Fund
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Global Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <GlobalSearch />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-background hover:bg-background/10 hover:text-white gap-1.5"
                >
                  <span>Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/fund-matcher" className="w-full cursor-pointer flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Fund Matcher
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/roi-calculator" className="w-full cursor-pointer flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    ROI Calculator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cost-calculator" className="w-full cursor-pointer flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cost Calculator
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SavedFundsIndicator />
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
