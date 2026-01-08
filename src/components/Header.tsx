import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderHomepage from './navigation/HeaderHomepage';
import HeaderDefault from './navigation/HeaderDefault';

const Header: React.FC = () => {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  // Render homepage header on "/" and default header on all other routes
  return isHomepage ? <HeaderHomepage /> : <HeaderDefault />;
};

export default Header;
