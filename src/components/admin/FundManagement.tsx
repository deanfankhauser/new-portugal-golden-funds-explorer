import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FundData {
  id: string;
  name: string;
  category?: string;
  manager_name?: string;
  website?: string;
}

const FundManagement: React.FC = () => {
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const { data, error } = await supabase
        .from('funds')
        .select('id, name, category, manager_name, website')
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

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.manager_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <CardTitle className="text-sm font-medium">Fund Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Manage fund information and data
            </div>
          </CardContent>
        </Card>
      </div>

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
                  className="p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{fund.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="truncate">{fund.manager_name}</span>
                        <Badge variant="outline" className="text-xs">{fund.category}</Badge>
                      </div>
                    </div>
                    {fund.website && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(fund.website, '_blank')}
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
    </div>
  );
};

export default FundManagement;