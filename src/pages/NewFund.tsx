
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";

const NewFund = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')} 
            className="flex items-center text-portugal-blue hover:text-portugal-darkblue"
          >
            Back to Admin Panel
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Create New Fund</h1>
        
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-muted-foreground">
            Fund creation form will be implemented in Part 2
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewFund;
