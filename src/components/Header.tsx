
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ComparisonIndicator from "./ComparisonIndicator";
import { ExternalLink, ArrowLeft, Mail, Calculator, ClipboardCheck } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#1A1F2C] text-white py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => window.open("https://movingto.io", "_blank")}
              aria-label="Go to MovingTo website"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/65bf8df2803e405540708b3c_movingto-logo-white.svg" 
                alt="MovingTo Logo" 
                className="h-6 md:h-7.5"
                style={{ height: "30px" }}
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/fund-quiz">
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center gap-2 border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all duration-300"
              >
                <ClipboardCheck className="h-4 w-4" />
                <span>Fund Quiz</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="sm:hidden border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all"
              >
                <ClipboardCheck className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/roi-calculator">
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center gap-2 border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all duration-300"
              >
                <Calculator className="h-4 w-4" />
                <span>ROI Calculator</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="sm:hidden border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all"
              >
                <Calculator className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://www.movingto.io/contact/contact-movingto" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center gap-2 border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
                <span>Get in touch</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="sm:hidden border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </a>
            <ComparisonIndicator />
            <Link to="/managers">
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center gap-2 border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all duration-300"
              >
                <span>Fund Managers</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="sm:hidden border-white bg-white text-[#1A1F2C] hover:bg-[#f0f0f0] hover:text-black transition-all"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
