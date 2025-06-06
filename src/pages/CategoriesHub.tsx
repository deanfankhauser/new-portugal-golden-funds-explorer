
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getAllCategories } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { categoryToSlug } from '@/lib/utils';
import { Folder } from 'lucide-react';
import { StructuredDataService } from '../services/structuredDataService';
import { SEOService } from '../services/seoService';
import { URL_CONFIG } from '../utils/urlConfig';

const CategoriesHub = () => {
  const allCategories = getAllCategories();
  const pageUrl = URL_CONFIG.buildUrl('categories');
  const title = 'All Golden Visa Fund Categories | Movingto';
  const description = SEOService.optimizeMetaDescription(
    'Browse all Golden Visa fund categories. Find and compare Portugal Golden Visa funds by their investment categories.',
    ['Golden Visa', 'Categories', 'Portugal', 'Investment Funds']
  );
  const socialImageUrl = 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg';
  
  useEffect(() => {
    // Initialize comprehensive SEO setup
    SEOService.initializeSEO(pageUrl);

    // Generate enhanced structured data schemas
    const schemas = [
      // WebSite schema
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL,
        'description': 'Find and compare the best Golden Visa investment funds in Portugal',
        'publisher': {
          '@type': 'Organization',
          'name': 'Movingto',
          'url': URL_CONFIG.BASE_URL
        }
      },

      // Organization schema
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL,
        'logo': socialImageUrl,
        'description': 'Leading platform for Golden Visa investment fund comparison and research'
      },

      // CollectionPage schema
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': pageUrl
        },
        'name': 'All Golden Visa Fund Categories',
        'description': description,
        'numberOfItems': allCategories.length,
        'author': {
          '@type': 'Person',
          'name': 'Dean Fankhauser',
          'jobTitle': 'CEO'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Movingto'
        },
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': allCategories.length,
          'itemListElement': allCategories.map((category, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'Thing',
              'name': category,
              'url': URL_CONFIG.buildCategoryUrl(categoryToSlug(category)),
              'description': `Golden Visa funds in the ${category} category`
            }
          }))
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': URL_CONFIG.BASE_URL
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Categories',
              'item': pageUrl
            }
          ]
        }
      }
    ];

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, 'categories-hub');

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('categories-hub');
    };
  }, [allCategories.length, pageUrl, description]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="Golden Visa, Categories, Portugal, Investment Funds, Immigration" />
        <meta name="author" content="Dean Fankhauser, CEO" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Movingto" />
        <meta property="og:image" content={socialImageUrl} />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:alt" content="Movingto - Golden Visa Investment Funds" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@movingtoio" />
        <meta name="twitter:creator" content="@movingtoio" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialImageUrl} />
        <meta name="twitter:image:alt" content="Movingto - Golden Visa Investment Funds" />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#EF4444" />
        <meta name="format-detection" content="telephone=no" />
      </Helmet>

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
              <span className="font-medium text-[#EF4444]">Categories</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center justify-center mb-4">
            <Folder className="w-6 h-6 text-[#EF4444] mr-2" />
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Directory</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
            All Golden Visa Fund Categories
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center" itemProp="description">
            Browse all investment categories for Portugal Golden Visa Funds
          </p>
        </div>
        
        <section className="bg-white p-6 rounded-lg shadow-sm" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-2xl font-bold mb-6">All Categories ({allCategories.length})</h2>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" itemProp="itemListElement" itemScope itemType="https://schema.org/ItemList">
            {allCategories.map((category, index) => (
              <li key={category} 
                className="border border-gray-100 rounded-lg hover:shadow-md transition-all duration-300"
                itemProp="item" 
                itemScope 
                itemType="https://schema.org/Thing"
              >
                <Link 
                  to={`/categories/${categoryToSlug(category)}`} 
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Folder className="w-5 h-5 mr-3 text-[#EF4444]" />
                    <div>
                      <meta itemProp="position" content={`${index + 1}`} />
                      <span itemProp="name" className="font-medium text-lg text-gray-800">{category}</span>
                      <meta itemProp="url" content={URL_CONFIG.buildCategoryUrl(categoryToSlug(category))} />
                    </div>
                  </div>
                  <span className="text-[#EF4444]">→</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Each category represents a different investment approach in the Portuguese market. Click on a category to see all funds in that investment area.
            </p>
            <Link 
              to="/" 
              className="text-[#EF4444] hover:underline flex items-center"
            >
              View all funds
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoriesHub;
