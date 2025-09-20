import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FundLogo from '../fund-details/FundLogo';
import FundLogoUpload from './FundLogoUpload';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FundData {
  id: string;
  name: string;
  logo_url?: string;
  category?: string;
  manager_name?: string;
  website?: string;
}

const FundManagement: React.FC = () => {
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState<FundData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const { data, error } = await supabase
        .from('funds')
        .select('id, name, logo_url, category, manager_name, website')
        .order('name');

      if (error) {
        throw error;
      }

      setFunds(data || []);
    } catch (error) {
      console.error('Error fetching funds:', error);
      toast({
        title: 'Error',
        description: 'Failed to load funds data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpdate = (fundId: string, logoUrl: string | null) => {
    setFunds(prev => prev.map(fund => 
      fund.id === fundId ? { ...fund, logo_url: logoUrl } : fund
    ));
    
    if (selectedFund && selectedFund.id === fundId) {
      setSelectedFund(prev => prev ? { ...prev, logo_url: logoUrl } : null);
    }
  };

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.manager_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fundsWithLogos = funds.filter(fund => fund.logo_url).length;
  const logoCompletionRate = funds.length > 0 ? Math.round((fundsWithLogos / funds.length) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funds.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Funds with Logos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fundsWithLogos}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Logo Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logoCompletionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funds List */}
        <Card>
          <CardHeader>
            <CardTitle>Fund Management</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredFunds.map((fund) => (
                  <div
                    key={fund.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFund?.id === fund.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedFund(fund)}
                  >
                    <div className="flex items-center gap-3">
                      <FundLogo 
                        logoUrl={fund.logo_url} 
                        fundName={fund.name} 
                        size="sm" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{fund.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate">{fund.manager_name}</span>
                          {fund.logo_url ? (
                            <Badge variant="default" className="text-xs">Logo</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">No Logo</Badge>
                          )}
                        </div>
                      </div>
                      {fund.website && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(fund.website, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Logo Management */}
        <div className="space-y-4">
          {selectedFund ? (
            <FundLogoUpload
              fundId={selectedFund.id}
              fundName={selectedFund.name}
              currentLogoUrl={selectedFund.logo_url}
              onLogoUpdate={(logoUrl) => handleLogoUpdate(selectedFund.id, logoUrl)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logo Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Select a fund from the list to manage its logo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundManagement;