
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Portugal Golden Visa Funds";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Last updated: May 21, 2025</p>

            <p>
              Portugal Golden Visa Funds ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We may collect information about you in various ways, including:
            </p>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, our servers may automatically log standard data provided by your 
              web browser. This may include your computer's IP address, browser type and version, the pages 
              you visit, the time and date of your visits, time spent on each page, and other details.
            </p>

            <h3>Cookies</h3>
            <p>
              We may use "cookies" to collect information and improve our services. A cookie is a small data 
              file that is transferred to your device. You can instruct your browser to refuse all cookies or 
              to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be 
              able to use some portions of our Service.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our website</li>
            </ul>

            <h2>Sharing Your Information</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside 
              parties except as described in this Privacy Policy. We may share your information with:
            </p>
            <ul>
              <li>Service providers who perform services on our behalf</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Affiliated companies within our corporate family</li>
              <li>
                As required by law, such as to comply with a subpoena or similar legal process, or when we 
                believe in good faith that disclosure is necessary to protect our rights
              </li>
            </ul>

            <h2>Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal 
              information. While we have taken reasonable steps to secure the personal information you provide 
              to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, 
              and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul>
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of your personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to restrict processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically 
              for any changes.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@portugalGoldenVisaFunds.com.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;
