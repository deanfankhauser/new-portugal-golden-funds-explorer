
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DisclaimerPage = () => {
  useEffect(() => {
    document.title = "Disclaimer | Portugal Golden Visa Funds";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
          
          <div className="prose max-w-none">
            <h2>Information Purpose</h2>
            <p>
              The information provided on Portugal Golden Visa Funds is for general informational purposes only. 
              All information on the site is provided in good faith, however, we make no representation or warranty 
              of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, 
              or completeness of any information on the site.
            </p>
            
            <h2>Not Financial Advice</h2>
            <p>
              The information contained on this website is not intended as, and shall not be understood or construed as, 
              financial advice. We are not an attorney, accountant, or financial advisor, nor are we holding ourselves 
              out to be. The information contained on this website is not a substitute for financial advice from a 
              professional who is aware of the facts and circumstances of your individual situation.
            </p>
            
            <h2>Investment Risks</h2>
            <p>
              Investing in funds carries risks, including the loss of principal. Fund performance is not guaranteed, 
              and past performance does not guarantee future results. Investment returns will fluctuate and are subject 
              to market volatility, so that an investor's shares, when redeemed, or sold, may be worth more or less than 
              their original cost.
            </p>
            
            <h2>Immigration and Visa Information</h2>
            <p>
              Information about the Portugal Golden Visa program is subject to change. Immigration laws, requirements, 
              and procedures can change without notice. We do not guarantee that the information provided is current or 
              accurate. For the most up-to-date information, please consult with a qualified immigration attorney or contact 
              the Portuguese Immigration and Borders Service (SEF).
            </p>
            
            <h2>No Endorsement</h2>
            <p>
              The listing of any fund in our directory does not constitute an endorsement or recommendation by 
              Portugal Golden Visa Funds. We do not personally evaluate the funds for their investment merit, 
              suitability for any particular investor, or compliance with applicable laws and regulations.
            </p>
            
            <h2>External Links</h2>
            <p>
              Our website may contain links to external websites that are not provided or maintained by or in any way 
              affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness 
              of any information on these external websites.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you would like to contact us to understand more about this disclaimer or wish to contact us concerning 
              any matter relating to it, please email us at info@portugalGoldenVisaFunds.com.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DisclaimerPage;
