import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTags } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { tagToSlug } from '@/lib/utils';
import { Tag as TagIcon } from 'lucide-react';
import { StructuredDataService } from '../services/structuredDataService';
import { EnhancedStructuredDataService } from '../services/enhancedStructuredDataService';
import { SEOService } from '../services/seoService';
import { URL_CONFIG } from '../utils/urlConfig';

const TagsHub = () => {
  const allTags = getAllTags();
  
  useEffect(() => {
    const currentUrl = URL_CONFIG.buildUrl('tags');
    
    // Initialize comprehensive SEO
    SEOService.initializeSEO(currentUrl);

    // Set optimized page title for SEO
    const optimizedTitle = 'All Golden Visa Fund Tags | Movingto';
    document.title = optimizedTitle;
    
    // Set optimized meta description for SEO (keep under 155 chars)
    const optimizedDescription = SEOService.optimizeMetaDescription(
      'Browse all Golden Visa fund tags. Find and compare Portugal Golden Visa funds by their investment types, risk levels, and focus areas.',
      []
    );
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', optimizedDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = optimizedDescription;
      document.head.appendChild(meta);
    }

    // Add comprehensive meta tags
    const updateOrCreateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('author', 'Dean Fankhauser, CEO');
    updateOrCreateMeta('robots', 'index, follow, max-image-preview:large');

    // Update Open Graph meta tags
    const updateOrCreateOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    const fallbackImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';

    updateOrCreateOGMeta('og:title', optimizedTitle);
    updateOrCreateOGMeta('og:description', optimizedDescription);
    updateOrCreateOGMeta('og:type', 'website');
    updateOrCreateOGMeta('og:url', currentUrl);
    updateOrCreateOGMeta('og:image', fallbackImage);
    updateOrCreateOGMeta('og:site_name', 'Movingto Portugal Golden Visa Funds');

    // Add Twitter Card meta tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
    updateOrCreateTwitterMeta('twitter:site', '@movingtoio');
    updateOrCreateTwitterMeta('twitter:title', optimizedTitle);
    updateOrCreateTwitterMeta('twitter:description', optimizedDescription);
    updateOrCreateTwitterMeta('twitter:image', fallbackImage);

    // Generate comprehensive structured data schemas
    const schemas = [
      // Enhanced CollectionPage schema
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': currentUrl
        },
        'name': 'All Golden Visa Fund Tags',
        'description': optimizedDescription,
        'numberOfItems': allTags.length,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': allTags.length,
          'itemListElement': allTags.map((tag, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'Thing',
              'name': tag,
              'url': URL_CONFIG.buildTagUrl(tagToSlug(tag)),
              'description': `Golden Visa funds tagged with ${tag}`
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
              'name': 'Tags',
              'item': currentUrl
            }
          ]
        }
      },
      // Add enhanced schemas
      EnhancedStructuredDataService.generateWebSiteSchema(),
      EnhancedStructuredDataService.generateOrganizationSchema(),
      EnhancedStructuredDataService.generateArticleSchema(
        'Complete Directory of Golden Visa Fund Tags',
        optimizedDescription,
        currentUrl
      )
    ];

    // Add FAQ schema for tags directory
    const tagsFAQSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What are Golden Visa fund tags?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Golden Visa fund tags categorize investment funds by type, risk level, focus area, and other characteristics to help investors find suitable options.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How many different fund tags are available?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `There are ${allTags.length} different tags available to categorize Golden Visa investment funds across various investment types and characteristics.`
          }
        }
      ]
    };
    schemas.push(tagsFAQSchema);

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, 'tags-hub');

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('tags-hub');
    };
  }, [allTags.length]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
                    <meta itemProp="url" content={URL_CONFIG.buildTagUrl(tagToSlug(tag))} />
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
