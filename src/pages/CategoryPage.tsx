
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFundsByCategory, getAllCategories } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FundListItem from '../components/FundListItem';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from 'lucide-react';
import { slugToCategory, categoryToSlug } from '@/lib/utils';

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

    // Set page title for SEO
    document.title = `${category} Golden Visa Investment Funds | Portugal Golden Visa Funds`;
    
    // Set meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Explore ${category} Golden Visa investment funds. Find and compare the best ${category} funds for your Golden Visa investment.`
      );
    }

    // Create JSON-LD structured data for search engines
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://portugalvisafunds.com/categories/${categorySlug}`
      },
      'name': `${category} Golden Visa Investment Funds`,
      'description': `Explore ${category} Golden Visa investment funds. Find and compare the best ${category} funds for your Golden Visa investment.`,
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Product',
          'name': fund.name,
          'description': fund.description,
          'url': `https://portugalvisafunds.com/funds/${fund.id}`
        }
      })),
      // Adding breadcrumbs for better SEO
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://portugalvisafunds.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Categories',
            'item': 'https://portugalvisafunds.com/categories'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': `${category}`,
            'item': `https://portugalvisafunds.com/categories/${categorySlug}`
          }
        ]
      }
    };
    
    script.textContent = JSON.stringify(structuredData);
    
    // Remove any existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(s => s.remove());
    
    // Add the new structured data script
    document.head.appendChild(script);

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [category, categoryExists, navigate, funds, categorySlug]);

  if (!categoryExists) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        {/* Visible breadcrumbs for users and search engines */}
        <nav aria-label="breadcrumbs" className="mb-6">
          <ol className="flex items-center text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-[#EF4444]">Home</Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <span className="font-medium">Categories</span>
            </li>
            <li className="mx-2">/</li>
            <li>
              <span className="font-medium text-[#EF4444]">{category}</span>
            </li>
          </ol>
        </nav>
        
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

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center justify-center mb-4">
            <Folder className="w-6 h-6 text-[#EF4444] mr-2" />
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Category</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
            {category} Golden Visa Investment Funds
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center" itemProp="description">
            Explore {category} Golden Visa Investment Funds and Compare
          </p>
        </div>
        
        {funds.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
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
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600">
                <span itemProp="numberOfItems">{funds.length}</span> fund{funds.length !== 1 ? 's' : ''} in <span className="font-semibold">{category}</span> category
              </p>
              <div className="text-sm text-gray-500">
                Sorted by relevance
              </div>
            </div>
            
            <div className="space-y-4" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
              {funds.map((fund, index) => (
                <div key={fund.id} itemProp="item" itemScope itemType="https://schema.org/Product">
                  <meta itemProp="position" content={`${index + 1}`} />
                  <meta itemProp="name" content={fund.name} />
                  <meta itemProp="description" content={fund.description} />
                  <meta itemProp="url" content={`https://portugalvisafunds.com/funds/${fund.id}`} />
                  <FundListItem fund={fund} />
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Other Categories</h2>
              <div className="flex flex-wrap gap-2">
                {allCategories
                  .filter(cat => cat !== category)
                  .map(cat => (
                    <Link 
                      key={cat} 
                      to={`/categories/${categoryToSlug(cat)}`}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm"
                    >
                      {cat}
                    </Link>
                  ))
                }
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
