import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import SEOAnalysisPanel from './SEOAnalysisPanel';

const SEOAnalysisToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
  if (!isDev) return null;

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg"
          size="icon"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
      {isOpen && <SEOAnalysisPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default SEOAnalysisToggle;
