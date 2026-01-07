import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildContactUrl, openExternalLink } from '@/utils/urlHelpers';

export const FloatingActionButton: React.FC = () => {
  const handleContactClick = () => {
    openExternalLink(buildContactUrl('mobile_fab'));
  };

  return (
    <button
      onClick={handleContactClick}
      className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
      aria-label="Book a free call"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};
