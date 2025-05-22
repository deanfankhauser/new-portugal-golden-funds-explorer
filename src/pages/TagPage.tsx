
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFundsByTag, getAllTags } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FundCard from '../components/FundCard';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const TagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const decodedTag = tag ? decodeURIComponent(tag) : '';
  const allTags = getAllTags();
  
  // Check if the tag exists
  const tagExists = allTags.includes(decodedTag as any);
  const funds = tagExists ? getFundsByTag(decodedTag as any) : [];

  useEffect(() => {
    if (!tagExists) {
      // If tag doesn't exist, redirect to homepage
      navigate('/');
      return;
    }

    // Set page title for SEO
    document.title = `${decodedTag} Funds | Portugal Golden Visa Funds`;
    
    // Set meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Explore Portugal Golden Visa ${decodedTag} investment funds. Find the best ${decodedTag} funds for your Golden Visa investment.`
      );
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [decodedTag, tagExists, navigate]);

  if (!tagExists) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center text-black hover:bg-[#f0f0f0]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all funds
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {decodedTag} Funds
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore Portugal Golden Visa funds specializing in {decodedTag.toLowerCase()}.
          </p>
        </div>
        
        {funds.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No funds found</h3>
            <p className="text-gray-500">
              No funds are currently tagged with {decodedTag}
            </p>
            <Link to="/" className="inline-block mt-4 text-[#EF4444] hover:underline">
              View all funds
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              {funds.length} fund{funds.length !== 1 ? 's' : ''} tagged with {decodedTag}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funds.map(fund => (
                <FundCard key={fund.id} fund={fund} />
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TagPage;
