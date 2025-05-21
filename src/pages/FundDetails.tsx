
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFundById } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';

const FundDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fund = id ? getFundById(id) : undefined;

  useEffect(() => {
    if (!fund) {
      // If fund not found, redirect to homepage
      navigate('/');
    }
    // Set page title for SEO
    if (fund) {
      document.title = `${fund.name} | Portugal Golden Visa Funds`;
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [fund, navigate]);

  if (!fund) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center text-portugal-blue hover:text-portugal-darkblue"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to funds
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
            <h1 className="text-3xl font-bold mb-0">{fund.name}</h1>
            <Badge 
              className={`
                text-base px-4 py-1
                ${fund.fundStatus === 'Open' ? 'bg-green-600' : ''} 
                ${fund.fundStatus === 'Closing Soon' ? 'bg-amber-500' : ''}
                ${fund.fundStatus === 'Closed' ? 'bg-red-600' : ''}
              `}
            >
              {fund.fundStatus}
            </Badge>
          </div>

          <p className="text-xl text-gray-700 mb-8">{fund.description}</p>

          <div className="flex flex-wrap mb-8 gap-2">
            {fund.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/tags/${encodeURIComponent(tag)}`}
                className="bg-secondary hover:bg-primary hover:text-white px-3 py-1 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Minimum Investment</h3>
              <p className="text-2xl font-bold text-portugal-blue">{formatCurrency(fund.minimumInvestment)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Target Return</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.returnTarget}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Fund Size</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.fundSize} Million EUR</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Term</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.term} years</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Management Fee</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.managementFee}%</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Performance Fee</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.performanceFee}%</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Established</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.established}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Regulated By</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.regulatedBy}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Location</h3>
              <p className="text-2xl font-bold text-portugal-blue">{fund.location}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Fund Manager</h2>
            <div className="flex items-center gap-4">
              {fund.managerLogo && (
                <img 
                  src={fund.managerLogo} 
                  alt={fund.managerName}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{fund.managerName}</h3>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About the Fund</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{fund.detailedDescription}</p>
            </div>
          </div>

          {fund.websiteUrl && (
            <div className="text-center mt-8">
              <a 
                href={fund.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-portugal-blue hover:bg-portugal-darkblue text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Visit Fund Website
              </a>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundDetails;
