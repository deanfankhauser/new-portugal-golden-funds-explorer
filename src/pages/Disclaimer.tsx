import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="disclaimer" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Disclaimer</h1>
          
          <p className="mb-4">
            The information provided on this website is for general informational purposes only. 
            While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, 
            express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website 
            or the information, products, services, or related graphics contained on the website for any purpose. 
            Any reliance you place on such information is therefore strictly at your own risk.
          </p>

          <p className="mb-4">
            In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, 
            or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>

          <p className="mb-4">
            Through this website, you may be able to link to other websites which are not under our control. 
            We have no control over the nature, content, and availability of those sites. 
            The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
          </p>

          <p className="mb-4">
            Every effort is made to keep the website up and running smoothly. 
            However, we take no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.
          </p>

          <p className="mb-4">
            Investment decisions should be based on your own due diligence and consultation with a qualified financial advisor. 
            We do not provide financial advice and are not responsible for any investment decisions made based on the information on this website.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
