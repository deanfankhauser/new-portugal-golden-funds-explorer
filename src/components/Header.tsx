
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import AuthAwareButton from "./auth/AuthAwareButton";
import GlobalSearch from "./GlobalSearch";
import ComparisonIndicator from "./ComparisonIndicator";
import SavedFundsIndicator from "./SavedFundsIndicator";
import MobileNavigation from "./MobileNavigation";
import DisclaimerBanner from "./common/DisclaimerBanner";
import { FundMatcherQuiz } from "./quiz/FundMatcherQuiz";

const Header = () => {
  const [quizOpen, setQuizOpen] = useState(false);
  
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
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuizOpen(true)}
              className="text-background hover:bg-background/10 gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Fund Matcher</span>
            </Button>
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
    
    <FundMatcherQuiz open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
};

export default Header;
