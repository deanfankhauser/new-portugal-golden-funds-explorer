
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTags } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { tagToSlug } from '@/lib/utils';
import { Tag as TagIcon } from 'lucide-react';

const TagsHub = () => {
  const allTags = getAllTags();
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="tags-hub" />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1" itemScope itemType="https://schema.org/CollectionPage">
        {/* Visible breadcrumbs for users and search engines */}
        <nav aria-label="breadcrumbs" className="mb-4 sm:mb-6">
          <ol className="flex items-center text-xs sm:text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-[#EF4444]">Home</Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <span className="font-medium text-[#EF4444]">Tags</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <TagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#EF4444] mr-2" />
            <span className="text-xs sm:text-sm bg-gray-100 px-2 sm:px-3 py-1 rounded-full">Directory</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-center" itemProp="name">
            All Golden Visa Fund Tags
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto text-center px-2 sm:px-0" itemProp="description">
            Browse all investment types, risk levels, and focus areas
          </p>
        </div>
        
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm" aria-labelledby="tags-heading">
          <h2 id="tags-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Tags ({allTags.length})</h2>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
            {allTags.map((tag, index) => (
              <li key={tag} 
                className="border border-gray-100 rounded-lg hover:shadow-md transition-all duration-300"
                itemProp="item" 
                itemScope 
                itemType="https://schema.org/Thing"
              >
                <Link 
                  to={`/tags/${tagToSlug(tag)}`} 
                  className="p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <meta itemProp="position" content={`${index + 1}`} />
                    <span itemProp="name" className="font-medium text-base sm:text-lg text-gray-800">{tag}</span>
                  </div>
                  <span className="text-[#EF4444]">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TagsHub;
