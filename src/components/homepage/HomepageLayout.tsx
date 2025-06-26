
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="container mx-auto container-responsive-padding py-6 sm:py-8 lg:py-12 flex-1 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default HomepageLayout;
