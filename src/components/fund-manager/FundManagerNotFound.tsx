
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

interface FundManagerNotFoundProps {
  managerName: string;
}

const FundManagerNotFound: React.FC<FundManagerNotFoundProps> = ({ managerName }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Fund Manager Not Found</h1>
          <p className="text-gray-600">
            We couldn't find a fund manager with the name "{managerName}".
          </p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Browse Portugal Golden Visa Investment Fund Index
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FundManagerNotFound;
