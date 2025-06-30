
import React from 'react';
import { Calendar, GitCompare, Download, ExternalLink, Home, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const SSGIndexCTA: React.FC = () => {
  const handleDownloadReport = () => {
    // This would generate and download a PDF report
    console.log('Downloading full index report...');
    // For now, just show an alert
    alert('PDF download feature coming soon! Contact us for a detailed report.');
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Take Action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button 
            onClick={handleDownloadReport}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Full Index Report (PDF)
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/compare'}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare All Funds
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/fund-quiz'}
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Find My Ideal Fund
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open('https://movingto.com/contact', '_blank')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book a Free Consultation
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
        
        <div className="pt-4 border-t border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <a href="/funds" className="block text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <Home className="h-3 w-3" />
              Browse All Funds
            </a>
            <a href="/categories" className="block text-blue-600 hover:text-blue-800">
              → Fund Categories Guide
            </a>
            <a href="/faqs" className="block text-blue-600 hover:text-blue-800">
              → Frequently Asked Questions
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SSGIndexCTA;
