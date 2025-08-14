
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, Calculator, ClipboardCheck, Mail, ExternalLink, Users } from 'lucide-react';

const MobileNavigation = () => {
  const [open, setOpen] = React.useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          {/* Tools Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Tools
            </h3>
            <div className="space-y-2">
              <Link to="/fund-quiz" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <ClipboardCheck className="h-5 w-5" />
                  <span>Fund Quiz</span>
                </Button>
              </Link>
              <Link to="/roi-calculator" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Calculator className="h-5 w-5" />
                  <span>ROI Calculator</span>
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          {/* Browse Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Browse
            </h3>
            <div className="space-y-2">
              <Link to="/managers" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Users className="h-5 w-5" />
                  <span>Fund Managers</span>
                </Button>
              </Link>
              <Link to="/categories" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <ExternalLink className="h-5 w-5" />
                  <span>Categories</span>
                </Button>
              </Link>
              <Link to="/tags" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <ExternalLink className="h-5 w-5" />
                  <span>Tags</span>
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Support
            </h3>
            <a 
              href="https://movingto.com/contact/contact-movingto" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Mail className="h-5 w-5" />
                <span>Get in Touch</span>
              </Button>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
