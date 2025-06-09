
import React from 'react';
import { Calendar } from 'lucide-react';

interface LastUpdatedProps {
  date?: string;
  className?: string;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ 
  date = "June 2025", 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border ${className}`}>
      <Calendar className="h-4 w-4" />
      <span>Last updated: {date}</span>
    </div>
  );
};

export default LastUpdated;
