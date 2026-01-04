import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { trackGone410 } from '@/utils/errorTracking';

interface GonePageProps {
  slug?: string;
  type?: 'team-member' | 'fund' | 'manager' | 'page';
}

const GonePage = ({ slug, type = 'page' }: GonePageProps) => {
  useEffect(() => {
    if (slug) {
      console.log(`410 Gone: ${type} slug "${slug}" has been permanently removed`);
      trackGone410(slug, type);
    }
  }, [slug, type]);

  const typeLabels: Record<string, string> = {
    'team-member': 'team member profile',
    'fund': 'fund',
    'manager': 'fund manager',
    'page': 'page'
  };

  const typeLabel = typeLabels[type] || 'page';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="410" />
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-6xl font-bold text-muted-foreground mb-4">410</h1>
          <p className="text-2xl text-foreground mb-4">Content Permanently Removed</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            This {typeLabel} has been permanently removed and is no longer available.
            {type === 'team-member' && ' The team member may have left the company or the profile has been consolidated.'}
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {type === 'team-member' && (
              <Link to="/managers">
                <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer px-4 py-2">
                  Browse Fund Managers
                </Badge>
              </Link>
            )}
            <Link to="/">
              <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer px-4 py-2">
                Browse All Funds
              </Badge>
            </Link>
            <Link to="/categories">
              <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer px-4 py-2">
                View Categories
              </Badge>
            </Link>
          </div>
          
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

export default GonePage;
