import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, Clock, Shield } from 'lucide-react';

const FilloutForm = () => {
  return (
    <>
      <div 
        style={{ width: '100%', height: '500px' }} 
        data-fillout-id="2ZfNTTDczqus" 
        data-fillout-embed-type="standard" 
        data-fillout-inherit-parameters 
        data-fillout-dynamic-resize
      />
      <script src="https://server.fillout.com/embed/v1/"></script>
      <noscript>
        <p className="text-center py-4">
          <a 
            href="https://form.fillout.com/2ZfNTTDczqus" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Click here to open the form in a new tab
          </a>
        </p>
      </noscript>
    </>
  );
};

const ListYourFund = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="list-your-fund" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              List Your Fund on Our Platform
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Are you a fund manager offering Portugal Golden Visa eligible investment opportunities? 
              Join our platform to reach qualified investors actively evaluating investment options.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Reach Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Connect with qualified investors actively searching for opportunities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Detailed Listing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Showcase your fund with comprehensive information and analysis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Quick Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Our team reviews submissions within 5-7 business days
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Verified Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  All fund information is verified for accuracy and compliance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Fund Information</CardTitle>
              <p className="text-gray-600">
                Please provide detailed information about your investment fund. All fields are required 
                to ensure comprehensive analysis for potential investors.
              </p>
            </CardHeader>
            <CardContent>
              <FilloutForm />
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Privacy Notice:</strong> All information submitted will be kept confidential during our review process. 
              Only approved funds will be listed publicly on our platform. We comply with all applicable data protection regulations.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListYourFund;