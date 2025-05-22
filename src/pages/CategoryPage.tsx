
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FundCard from '../components/FundCard';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { category: categoryParam } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Convert URL param to actual category
  const decodedCategory = categoryParam ? decodeURIComponent(categoryParam) : '';
  const allCategories = getAllCategories();
  
  // Check if the category exists
  const categoryExists = allCategories.includes(decodedCategory as any);
  const funds = categoryExists ? getFundsByCategory(decodedCategory as any) : [];

  useEffect(() => {
    if (!categoryExists) {
      // If category doesn't exist, redirect to homepage
      navigate('/');
      return;
    }

    // Set page title for SEO
    document.title = `${decodedCategory} Funds | Portugal Golden Visa Funds`;
    
    // Set meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Explore Portugal Golden Visa ${decodedCategory} investment funds. Find the best ${decodedCategory} funds for your Golden Visa investment.`
      );
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [decodedCategory, categoryExists, navigate]);

  if (!categoryExists) return null;

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
            {decodedCategory} Funds
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore Portugal Golden Visa funds in the {decodedCategory} category.
          </p>
        </div>
        
        {funds.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No funds found</h3>
            <p className="text-gray-500">
              No funds are currently in the {decodedCategory} category
            </p>
            <Link to="/" className="inline-block mt-4 text-[#EF4444] hover:underline">
              View all funds
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              {funds.length} fund{funds.length !== 1 ? 's' : ''} in {decodedCategory} category
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

export default CategoryPage;
