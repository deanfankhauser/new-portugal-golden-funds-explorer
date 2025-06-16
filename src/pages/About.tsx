import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="about" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Movingto
          </h2>
          <div className="mt-6 text-gray-700">
            <p className="mb-4">
              Movingto is dedicated to providing comprehensive and reliable information about Portugal Golden Visa investment funds.
              Our mission is to empower investors with the knowledge they need to make informed decisions.
            </p>
            <p className="mb-4">
              We understand that navigating the world of investment funds can be complex, especially when it comes to the Portugal Golden Visa program.
              That's why we've created a platform that simplifies the process, offering detailed fund information, comparisons, and expert insights.
            </p>
            <h3 className="text-xl font-semibold mb-2">Our Commitment</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Providing accurate and up-to-date fund data</li>
              <li>Offering unbiased comparisons of investment opportunities</li>
              <li>Delivering expert insights and analysis</li>
              <li>Supporting investors in achieving their residency goals</li>
            </ul>
            <p className="mb-4">
              Whether you're a seasoned investor or just starting your journey, Movingto is here to guide you every step of the way.
              Explore our resources, compare funds, and make confident investment decisions with Movingto.
            </p>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p>
              Have questions or need assistance? <a href="mailto:info@movingto.com" className="text-blue-500">Contact us</a> today!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
