
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { getFundById } from "../data/funds";
import FundForm, { FundFormValues } from '../components/FundForm';

const EditFund = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<FundFormValues | null>(null);

  useEffect(() => {
    if (id) {
      const fund = getFundById(id);
      if (fund) {
        // Populate form with fund data
        setDefaultValues({
          id: fund.id,
          name: fund.name,
          description: fund.description,
          detailedDescription: fund.detailedDescription,
          category: fund.category,
          tags: fund.tags,
          minimumInvestment: fund.minimumInvestment,
          fundSize: fund.fundSize,
          managementFee: fund.managementFee,
          performanceFee: fund.performanceFee,
          subscriptionFee: fund.subscriptionFee,
          redemptionFee: fund.redemptionFee,
          term: fund.term,
          managerName: fund.managerName,
          managerLogo: fund.managerLogo || "",
          returnTarget: fund.returnTarget,
          fundStatus: fund.fundStatus,
          websiteUrl: fund.websiteUrl || "",
          established: fund.established,
          regulatedBy: fund.regulatedBy,
          location: fund.location,
        });
      } else {
        toast.error("Fund not found", {
          description: "The requested fund could not be found"
        });
        navigate('/admin');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = (data: FundFormValues) => {
    // In a real application, we would save this data to a database
    console.log("Form submitted:", data);
    toast.success("Fund updated successfully", {
      description: `Updated fund: ${data.name}`
    });
    navigate('/admin');
  };

  if (loading || !defaultValues) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <p>Loading fund data...</p>
        </main>
        <Footer />
      </div>
    );
  }

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
        
        <h1 className="text-3xl font-bold mb-6">Edit Fund</h1>
        
        <FundForm 
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitButtonText="Update Fund"
          isEditMode={true}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default EditFund;
