
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
        className="flex items-center text-muted-foreground hover:bg-secondary hover:text-foreground group transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 group-hover:text-foreground transition-transform" />
        Back to funds
      </Button>
    </div>
  );
};

export default BackToFundsButton;
