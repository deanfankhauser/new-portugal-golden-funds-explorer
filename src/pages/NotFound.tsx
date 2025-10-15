
import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  
  // Common tag slugs that might be accessed without /tags/ prefix
  const commonTags = useMemo(() => [
    'solar', 'crypto', 'regulated', 'carbon-credits', 'tech', 'healthcare',
    'film', 'real-estate', 'low-risk', 'medium-risk', 'high-risk', 'flexible',
    'renewable-energy', 'european-focus', 'sustainability', 'diversified',
    'institutional-grade', 'esg', 'growth', 'income', 'value', 'balanced',
    'ai', 'fintech', 'biotech', 'infrastructure', 'agriculture', 'tourism',
    'manufacturing', 'education', 'entertainment'
  ], []);

  // Detect if this looks like a tag URL without the /tags/ prefix
  const suggestedTagUrl = useMemo(() => {
    const pathname = location.pathname.replace(/^\//, '').replace(/\/$/, '');
    
    // Check if the pathname matches a known tag
    if (commonTags.includes(pathname.toLowerCase())) {
      return `/tags/${pathname.toLowerCase()}`;
    }
    
    return null;
  }, [location.pathname, commonTags]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <PageSEO pageType="404" />
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl text-foreground mb-4">Oops! Page not found</p>
          
          {suggestedTagUrl ? (
            <div className="mb-8">
              <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-lg mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold text-foreground">
                    Looking for funds with this tag?
                  </p>
                </div>
                <p className="text-muted-foreground mb-4">
                  It looks like you're trying to access a tag page. Try this correct URL:
                </p>
                <Link 
                  to={suggestedTagUrl}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  View {location.pathname.replace(/^\//, '')} funds
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                <p className="mb-2">Or explore other options:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link to="/tags">
                    <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                      Browse all tags
                    </Badge>
                  </Link>
                  <Link to="/categories">
                    <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                      Browse categories
                    </Badge>
                  </Link>
                  <Link to="/index">
                    <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                      View fund index
                    </Badge>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                The page you are looking for might have been removed, had its name changed, 
                or is temporarily unavailable.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Link to="/index">
                  <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    Browse all funds
                  </Badge>
                </Link>
                <Link to="/tags">
                  <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    Explore tags
                  </Badge>
                </Link>
                <Link to="/categories">
                  <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    View categories
                  </Badge>
                </Link>
              </div>
            </div>
          )}
          
          <Link 
            to="/" 
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
