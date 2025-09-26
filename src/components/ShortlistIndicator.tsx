import React from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Bookmark, X, ExternalLink } from 'lucide-react';
import { useShortlist } from '../contexts/ShortlistContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from './fund-details/utils/formatters';

const ShortlistIndicator = () => {
  const { shortlistedFunds, removeFromShortlist, clearShortlist } = useShortlist();
  const fundCount = shortlistedFunds.length;

  if (fundCount === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative bg-card border-border hover:bg-muted"
        >
          <Bookmark className="h-4 w-4 mr-1" />
          Shortlist
          {fundCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
            >
              {fundCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Your Shortlist ({fundCount})
            </div>
            {fundCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearShortlist}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {fundCount === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No funds shortlisted</h3>
              <p className="text-sm text-muted-foreground">
                Add funds to your shortlist to keep track of interesting opportunities
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {shortlistedFunds.map((fund) => (
                <div key={fund.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          to={`/${fund.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                        >
                          {fund.name}
                        </Link>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Manager:</span>
                          <span className="text-foreground">{fund.managerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="text-foreground">{fund.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min Investment:</span>
                          <span className="text-foreground">
                            {fund.minimumInvestment ? formatCurrency(fund.minimumInvestment) : 'Contact Manager'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Link to={`/${fund.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromShortlist(fund.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Shortlisted funds are saved locally in your browser
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShortlistIndicator;