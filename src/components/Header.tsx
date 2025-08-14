
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ComparisonIndicator from "./ComparisonIndicator";
import MobileNavigation from "./MobileNavigation";
import { ArrowLeft, Mail, Calculator, ClipboardCheck, Users, ExternalLink, TrendingUp, BarChart3 } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#1A1F2C] text-white py-3 shadow-lg sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center w-full">
          {/* Left section - Logo and back button */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => window.open("https://www.movingto.com", "_blank")}
              aria-label="Go to MovingTo website"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center">
              <img 
                src="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/65bf8df2803e405540708b3c_movingto-logo-white.svg" 
                alt="MovingTo Logo" 
                className="h-8"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Analysis Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
                    Analysis
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-4 bg-white">
                      <div className="space-y-2">
                        <NavigationMenuLink asChild>
                          <Link to="/index" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <TrendingUp className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Fund Index</div>
                              <div className="text-sm text-gray-500">Ranked fund analysis</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/compare" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <BarChart3 className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Fund Comparison</div>
                              <div className="text-sm text-gray-500">Compare funds side-by-side</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Tools Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-4 bg-white">
                      <div className="space-y-2">
                        <NavigationMenuLink asChild>
                          <Link to="/fund-quiz" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <ClipboardCheck className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Fund Quiz</div>
                              <div className="text-sm text-gray-500">Find your ideal fund</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/roi-calculator" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <Calculator className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">ROI Calculator</div>
                              <div className="text-sm text-gray-500">Calculate returns</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Browse Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
                    Browse
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-4 bg-white">
                      <div className="space-y-2">
                        <NavigationMenuLink asChild>
                          <Link to="/managers" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <Users className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Fund Managers</div>
                              <div className="text-sm text-gray-500">Explore managers</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/categories" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <ExternalLink className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Categories</div>
                              <div className="text-sm text-gray-500">Browse by category</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/tags" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <ExternalLink className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Tags</div>
                              <div className="text-sm text-gray-500">Browse by tags</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Direct Actions */}
            <a href="https://movingto.com/contact/contact-movingto" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all duration-300"
              >
                <Mail className="h-4 w-4 mr-2" />
                Get in Touch
              </Button>
            </a>

            <ComparisonIndicator />
          </div>

          {/* Mobile Navigation and Comparison */}
          <div className="flex md:hidden items-center gap-2">
            <ComparisonIndicator />
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
