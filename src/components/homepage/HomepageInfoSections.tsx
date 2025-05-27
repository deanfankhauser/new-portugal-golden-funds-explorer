
import React from 'react';

const HomepageInfoSections = () => {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      {/* What are Golden Visa Funds explanation */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">What are Portugal Golden Visa Investment Funds?</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Portugal Golden Visa investment funds are specially qualified investment vehicles that allow non-EU citizens to obtain Portuguese residency through financial investment. Under the current program, investors must commit a minimum of €500,000 to eligible investment funds.
          </p>
          <p>
            These funds focus on supporting the Portuguese economy through various sectors including real estate, venture capital, infrastructure, and innovation. All funds listed in our directory are officially approved by Portuguese authorities and meet the strict criteria required for Golden Visa eligibility.
          </p>
          <p className="font-medium">
            Key benefits include: Portuguese residency permit, visa-free travel within the Schengen area, path to permanent residency and citizenship, and the ability to include family members in your application.
          </p>
        </div>
      </div>

      {/* Additional descriptive content */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Why Choose Our Fund Directory?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Comprehensive Coverage</h4>
            <p className="text-sm">Access detailed information on all major Golden Visa eligible funds, including performance metrics, fee structures, and investment strategies.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Expert Analysis</h4>
            <p className="text-sm">Each fund profile includes professional analysis, risk assessments, and suitability recommendations to help you make informed decisions.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Real-time Updates</h4>
            <p className="text-sm">Our database is continuously updated with the latest fund information, regulatory changes, and market developments.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Comparison Tools</h4>
            <p className="text-sm">Compare multiple funds side-by-side to evaluate investment terms, expected returns, and alignment with your investment goals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageInfoSections;
