
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

const ADMIN_PASSWORD = "golden2024visa"; // Hardcoded password

const Admin = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast.success("Authentication successful", {
        description: "Welcome to the admin panel"
      });
    } else {
      toast.error("Authentication failed", {
        description: "The password you entered is incorrect"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        {!authenticated ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Fund Management</h2>
              <Button onClick={() => navigate('/admin/new-fund')}>
                Create New Fund
              </Button>
            </div>
            <p className="text-gray-600 mb-8">
              This page will allow you to manage funds. Navigate to the create new fund page to add a fund, 
              or click on existing funds below to edit or delete them.
            </p>
            
            <div className="bg-muted p-8 rounded-lg text-center">
              <p className="text-muted-foreground">
                Fund management interface will be implemented in Part 2
              </p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
