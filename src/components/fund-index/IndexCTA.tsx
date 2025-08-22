
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, GitCompare, Download, ExternalLink, Home, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';

const IndexCTA: React.FC = () => {
  const navigate = useNavigate();
  
  const handleDownloadReport = () => {
    // This would generate and download a PDF report
    // Download report functionality
    // For now, just show an alert
    alert('PDF download feature coming soon! Contact us for a detailed report.');
  };

  const handleBrowseAllFunds = () => {
    navigate('/');
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="text-foreground">Take Action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button 
            onClick={handleDownloadReport}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Full Index Report (PDF)
          </Button>
          
          <Link to="/compare" className="block">
            <Button variant="outline" className="w-full">
              <GitCompare className="h-4 w-4 mr-2" />
              Compare All Funds
            </Button>
          </Link>
          
          <Link to="/fund-quiz" className="block">
            <Button variant="outline" className="w-full">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Find My Ideal Fund
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => openExternalLink(buildContactUrl('index-cta'))}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book a Free Consultation
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
        
        <div className="pt-4 border-t border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <button 
              onClick={handleBrowseAllFunds}
              className="block text-primary hover:text-primary/80 flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              <Home className="h-3 w-3" />
              Browse All Funds
            </button>
            <Link to="/categories" className="block text-primary hover:text-primary/80">
              → Fund Categories Guide
            </Link>
            <Link to="/faqs" className="block text-primary hover:text-primary/80">
              → Frequently Asked Questions
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexCTA;
