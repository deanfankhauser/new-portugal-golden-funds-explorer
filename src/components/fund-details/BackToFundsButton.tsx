
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const BackToFundsButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-black group transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to funds
      </Button>
    </div>
  );
};

export default BackToFundsButton;
