
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import AuthAwareButton from "./auth/AuthAwareButton";
import GlobalSearch from "./GlobalSearch";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ComparisonIndicator from "./ComparisonIndicator";
import ShortlistIndicator from "./ShortlistIndicator";
import MobileNavigation from "./MobileNavigation";
import DisclaimerBanner from "./common/DisclaimerBanner";
import { ArrowLeft, Calculator, ClipboardCheck, Users, ExternalLink, TrendingUp, BarChart3, GitCompareArrows } from "lucide-react";
import { FundIndexWidget, ComparisonWidget } from "./navigation/IndexWidgets";

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
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Analysis Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-background hover:bg-background/10 data-[state=open]:bg-background/10">
                    Analysis
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-80 p-4 bg-card">
                      <div className="space-y-3">
                        <FundIndexWidget />
                        <ComparisonWidget />
                        <NavigationMenuLink asChild>
                          <Link to="/alternatives" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                            <GitCompareArrows className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Fund Alternatives</div>
                              <div className="text-sm text-muted-foreground">Find alternative funds</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Tools Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-background hover:bg-background/10 data-[state=open]:bg-background/10">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-4 bg-card">
                      <div className="space-y-2">
                        <NavigationMenuLink asChild>
                          <Link to="/roi-calculator" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                            <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">ROI Calculator</div>
                              <div className="text-sm text-muted-foreground">Calculate returns</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <a href="https://www.movingto.com/tools/golden-visa-cost-calculator" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                            <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Golden Visa Cost Calculator</div>
                              <div className="text-sm text-muted-foreground">Calculate total investment costs</div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                          </a>
                        </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

                {/* Browse Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-background hover:bg-background/10 data-[state=open]:bg-background/10">
                    Browse
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-4 bg-card">
                      <div className="space-y-2">
                         <NavigationMenuLink asChild>
                           <Link to="/managers" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                             <Users className="h-5 w-5 text-primary flex-shrink-0" />
                             <div>
                               <div className="font-medium text-foreground">Fund Managers</div>
                               <div className="text-sm text-muted-foreground">Explore managers</div>
                             </div>
                           </Link>
                         </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/categories" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                            <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Categories</div>
                              <div className="text-sm text-muted-foreground">Browse by category</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/tags" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                            <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Tags</div>
                              <div className="text-sm text-muted-foreground">Browse by tags</div>
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

            <AuthAwareButton />
            <ShortlistIndicator />
            <ComparisonIndicator />
          </div>

          {/* Mobile Navigation and Comparison */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <ShortlistIndicator />
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
