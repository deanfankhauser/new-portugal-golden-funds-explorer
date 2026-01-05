import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles, Calculator, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ className = '', onLinkClick }) => {
  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        asChild
        className="text-foreground hover:bg-muted hover:text-foreground"
      >
        <Link to="/funds" onClick={onLinkClick}>
          Funds
        </Link>
      </Button>

      <Button
        variant="ghost"
        asChild
        className="text-foreground hover:bg-muted hover:text-foreground"
      >
        <Link to="/managers" onClick={onLinkClick}>
          Managers
        </Link>
      </Button>

      {/* Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-foreground hover:bg-muted hover:text-foreground gap-1"
          >
            Tools
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 bg-background border border-border shadow-lg z-50">
          <DropdownMenuItem asChild>
            <Link to="/fund-matcher" className="flex items-center gap-2 cursor-pointer" onClick={onLinkClick}>
              <Sparkles className="h-4 w-4" />
              Fund Matcher
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/roi-calculator" className="flex items-center gap-2 cursor-pointer" onClick={onLinkClick}>
              <Calculator className="h-4 w-4" />
              ROI Calculator
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/cost-calculator" className="flex items-center gap-2 cursor-pointer" onClick={onLinkClick}>
              <DollarSign className="h-4 w-4" />
              Cost Calculator
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        asChild
        className="text-foreground hover:bg-muted hover:text-foreground"
      >
        <Link to="/verified-funds" onClick={onLinkClick}>
          Verified
        </Link>
      </Button>

      <Button
        variant="ghost"
        asChild
        className="text-foreground hover:bg-muted hover:text-foreground"
      >
        <Link to="/about" onClick={onLinkClick}>
          About
        </Link>
      </Button>
    </nav>
  );
};

export default NavLinks;
