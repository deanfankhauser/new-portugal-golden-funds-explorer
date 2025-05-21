
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import FundForm, { FundFormValues } from '../components/FundForm';

const NewFund = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const defaultValues: FundFormValues = {
    id: "",
    name: "",
    description: "",
    detailedDescription: "",
    category: "Real Estate",
    tags: [],
    minimumInvestment: 500000,
    fundSize: 0,
    managementFee: 0,
    performanceFee: 0,
    term: 0,
    managerName: "",
    returnTarget: "",
    fundStatus: "Open",
    established: new Date().getFullYear(),
    regulatedBy: "",
    location: "Portugal",
    websiteUrl: "",
  };

  const handleSubmit = async (data: FundFormValues) => {
    setIsCreating(true);
    try {
      // In a real application, we would save this data to a database
      console.log("Form submitted:", data);
      
      // Simulate some delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Fund created successfully", {
        description: `Created fund: ${data.name}`
      });
      navigate('/admin');
    } catch (error) {
      toast.error("Failed to create fund", {
        description: "Please try again"
      });
    } finally {
      setIsCreating(false);
    }
  };

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
        
        <FundForm 
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitButtonText="Create Fund"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default NewFund;
