
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Ensure React is available before creating context
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CORRECT_PASSWORD = "MovingtoGlobal2025";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('movingto_authenticated') === 'true';
    }
    return false;
  });

  const authenticate = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        localStorage.setItem('movingto_authenticated', 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('movingto_authenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
