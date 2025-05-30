import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AlertTriangle } from 'lucide-react';

const DisclaimerPage = () => {
  useEffect(() => {
    document.title = "Disclaimer | MovingTo Portugal Golden Visa Funds";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <AlertTriangle className="text-amber-600 h-6 w-6 sm:h-8 sm:w-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">Disclaimer</h1>
          </div>
          
          <div className="prose max-w-none space-y-4 sm:space-y-6 text-sm sm:text-base">
            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-medium">
                The information contained on this website is for general information purposes only. While we strive
                to keep the information up to date and correct, we make no representations or warranties of any kind,
                express or implied, about the completeness, accuracy, reliability, suitability or availability of the
                information contained on this website.
              </p>
            </div>
            
            <section className="border-b border-gray-200 pb-4 sm:pb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Information Purpose</h2>
              <p className="text-gray-600">
                The information provided on MovingTo Portugal Golden Visa Funds is for general informational purposes only. 
                All information on the site is provided in good faith, however, we make no representation or warranty 
                of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, 
                or completeness of any information on the site.
              </p>
            </section>
            
            <section className="border-b border-gray-200 pb-4 sm:pb-6 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Not Financial Advice</h2>
              <p className="text-gray-600">
                The information contained on this website is not intended as, and shall not be understood or construed as, 
                financial advice. We are not an attorney, accountant, or financial advisor, nor are we holding ourselves 
                out to be. The information contained on this website is not a substitute for financial advice from a 
                professional who is aware of the facts and circumstances of your individual situation.
              </p>
            </section>
            
            <section className="border-b border-gray-200 pb-4 sm:pb-6 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Investment Risks</h2>
              <p className="text-gray-600">
                Investing in funds carries risks, including the loss of principal. Fund performance is not guaranteed, 
                and past performance does not guarantee future results. Investment returns will fluctuate and are subject 
                to market volatility, so that an investor's shares, when redeemed, or sold, may be worth more or less than 
                their original cost.
              </p>
            </section>
            
            <section className="border-b border-gray-200 pb-4 sm:pb-6 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Immigration and Visa Information</h2>
              <p className="text-gray-600">
                Information about the Portugal Golden Visa program is subject to change. Immigration laws, requirements, 
                and procedures can change without notice. We do not guarantee that the information provided is current or 
                accurate. For the most up-to-date information, please consult with a qualified immigration attorney or contact 
                the Portuguese Immigration and Borders Service (SEF).
              </p>
            </section>
            
            <section className="border-b border-gray-200 pb-4 sm:pb-6 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">No Endorsement</h2>
              <p className="text-gray-600">
                The listing of any fund in our directory does not constitute an endorsement or recommendation by 
                MovingTo. We do not personally evaluate the funds for their investment merit, 
                suitability for any particular investor, or compliance with applicable laws and regulations.
              </p>
            </section>
            
            <section className="border-b border-gray-200 pb-4 sm:pb-6 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">External Links</h2>
              <p className="text-gray-600">
                Our website may contain links to external websites that are not provided or maintained by or in any way 
                affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness 
                of any information on these external websites.
              </p>
            </section>
            
            <section className="pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Contact Us</h2>
              <p className="text-gray-600">
                If you would like to contact us to understand more about this disclaimer or wish to contact us concerning 
                any matter relating to it, please email us at info@movingto.com or visit our <a href="https://www.movingto.com/contact/contact-movingto" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DisclaimerPage;
