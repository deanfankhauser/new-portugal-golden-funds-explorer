
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FundCard from '../components/FundCard';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from 'lucide-react';
import { slugToCategory } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

const CategoryPage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Convert URL slug to actual category
  const category = categorySlug ? slugToCategory(categorySlug) : '';
  const allCategories = getAllCategories();
  
  // Check if the category exists
  const categoryExists = allCategories.includes(category as any);
  const funds = categoryExists ? getFundsByCategory(category as any) : [];

  useEffect(() => {
    if (!categoryExists) {
      // If category doesn't exist, redirect to homepage
      navigate('/');
      return;
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [category, categoryExists, navigate]);

  if (!categoryExists) return null;

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://yourwebsite.com/categories/${categorySlug}`
    },
    "name": `${category} Golden Visa Investment Funds`,
    "description": `Explore ${category} Golden Visa investment funds. Find and compare the best ${category} funds for your Golden Visa investment.`,
    "numberOfItems": funds.length,
    "itemListElement": funds.map((fund, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": fund.name,
        "description": fund.description,
        "url": `https://yourwebsite.com/funds/${fund.id}`
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`${category} Golden Visa Investment Funds | Portugal Golden Visa Funds`}</title>
        <meta name="description" 
          content={`Explore ${category} Golden Visa investment funds. Find and compare the best ${category} funds for your Golden Visa investment.`} 
        />
        <link rel="canonical" href={`https://yourwebsite.com/categories/${categorySlug}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
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
          <div className="flex items-center justify-center mb-4">
            <Folder className="w-6 h-6 text-[#EF4444] mr-2" />
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Category</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {category} Golden Visa Investment Funds
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore {category} Golden Visa Investment Funds and Compare
          </p>
        </div>
        
        {funds.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No funds found</h3>
            <p className="text-gray-500">
              No funds are currently in the {category} category
            </p>
            <Link to="/" className="inline-block mt-4 text-[#EF4444] hover:underline">
              View all funds
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {funds.length} fund{funds.length !== 1 ? 's' : ''} in {category} category
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm"
                >
                  Back to top
                </Button>
              </div>
            </div>
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
