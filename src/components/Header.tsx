
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { buildContactUrl } from "../utils/urlHelpers";
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
import { ArrowLeft, Mail, Calculator, ClipboardCheck, Users, ExternalLink, TrendingUp, BarChart3, FileText, GitCompareArrows } from "lucide-react";
import { FundIndexWidget, ComparisonWidget } from "./navigation/IndexWidgets";

const Header = () => {
  return (
    <header className="bg-[#1A1F2C] text-white py-3 shadow-lg sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center w-full">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/65bf8df2803e405540708b3c_movingto-logo-white.svg" 
                alt="MovingTo Logo" 
                className="h-6"
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
                    <div className="w-80 p-4 bg-white">
                      <div className="space-y-3">
                        <FundIndexWidget />
                        <ComparisonWidget />
                        <NavigationMenuLink asChild>
                          <Link to="/alternatives" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <GitCompareArrows className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Fund Alternatives</div>
                              <div className="text-sm text-gray-500">Find alternative funds</div>
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
                            <ClipboardCheck className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Fund Quiz</div>
                              <div className="text-sm text-gray-500">Find your ideal fund</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/roi-calculator" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">ROI Calculator</div>
                              <div className="text-sm text-gray-500">Calculate returns</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <a href="https://www.movingto.com/tools/golden-visa-cost-calculator" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Golden Visa Cost Calculator</div>
                              <div className="text-sm text-gray-500">Calculate total investment costs</div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                          </a>
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
                            <Users className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Fund Managers</div>
                              <div className="text-sm text-gray-500">Explore managers</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/categories" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">Categories</div>
                              <div className="text-sm text-gray-500">Browse by category</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/tags" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                            <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
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
            <Button 
              asChild
              variant="ghost" 
              className="text-white hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              <a href="https://www.movingto.com/contact/submit-fund" target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" />
                Submit Fund
              </a>
            </Button>

            <Button 
              asChild
              variant="outline" 
              className="border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all duration-300"
            >
              <a href={buildContactUrl('header')} target="_blank" rel="noopener noreferrer">
                <Mail className="h-4 w-4 mr-2" />
                Get in Touch
              </a>
            </Button>

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
