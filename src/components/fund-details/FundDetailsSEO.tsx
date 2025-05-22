
import { useEffect } from 'react';
import { Fund } from '../../data/funds';

interface FundDetailsSEOProps {
  fund: Fund;
}

const FundDetailsSEO: React.FC<FundDetailsSEOProps> = ({ fund }) => {
  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = `${fund.name} | Movingto`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Learn more about ${fund.name} in the Movingto Golden Visa funds directory. Compare with similar funds.`
      );
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [fund]);

  return null; // This component doesn't render anything
};

export default FundDetailsSEO;
