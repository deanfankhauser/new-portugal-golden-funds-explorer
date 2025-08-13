
import React from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const CORRECT_PASSWORD = "MovingtoGlobal2025";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
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
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
