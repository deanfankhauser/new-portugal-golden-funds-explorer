
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ComparisonIndicator from "./ComparisonIndicator";
import { ExternalLink } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#1A1F2C] text-white py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/65bf8df2803e405540708b3c_movingto-logo-white.svg" 
              alt="MovingTo Logo" 
              className="h-8 md:h-10"
            />
          </Link>
          <div className="flex items-center gap-4">
            <ComparisonIndicator />
            <Button 
              variant="outline" 
              className="hidden sm:flex items-center gap-2 text-white border-white hover:bg-white hover:text-[#1A1F2C] transition-all duration-300"
              onClick={() => window.open("https://www.movingto.io/contact/contact-movingto", "_blank")}
            >
              <span>Get in touch</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="sm:hidden text-white border-white hover:bg-white hover:text-[#1A1F2C] transition-all"
              onClick={() => window.open("https://www.movingto.io/contact/contact-movingto", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
