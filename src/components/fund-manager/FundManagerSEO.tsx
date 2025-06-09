
import React from 'react';
import PageSEO from '../common/PageSEO';
import { FundManagerData, useFundManagerStructuredData } from '../../hooks/useFundManagerStructuredData';
import { MANAGER_META_DATA } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';
import { managerToSlug } from '../../lib/utils';

interface FundManagerSEOProps {
  managerData: FundManagerData;
}

const FundManagerSEO: React.FC<FundManagerSEOProps> = ({ managerData }) => {
  // Add structured data using our hook
  useFundManagerStructuredData(managerData);

  const pageUrl = URL_CONFIG.buildManagerUrl(managerData.name);
  const managerSlug = managerToSlug(managerData.name);
  const metaData = MANAGER_META_DATA[managerSlug];

  if (!metaData) {
    console.error('FundManagerSEO: No meta data found for manager:', managerSlug);
    return null;
  }

  return (
    <PageSEO
      title={metaData.title}
      description={metaData.description}
      keywords={metaData.keywords}
      canonicalUrl={pageUrl}
      ogTitle={metaData.ogTitle}
      ogDescription={metaData.ogDescription}
      twitterTitle={metaData.twitterTitle}
      twitterDescription={metaData.twitterDescription}
      imageUrl={managerData.logo}
      imageAlt={metaData.imageAlt}
    />
  );
};

export default FundManagerSEO;
