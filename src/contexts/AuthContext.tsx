
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CORRECT_PASSWORD = "MovingtoGlobal2025";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously authenticated (stored in localStorage)
    return localStorage.getItem('movingto_authenticated') === 'true';
  });

  const authenticate = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('movingto_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('movingto_authenticated');
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
