import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit3, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CompanyLogo } from '../shared/CompanyLogo';

interface FundData {
  id: string;
  name: string;
  category?: string;
  manager_name?: string;
  is_verified?: boolean;
  minimum_investment?: number;
  is_quiz_eligible?: boolean;
}

export const EditFundsManagement: React.FC = () => {
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funds')
        .select('id, name, category, manager_name, is_verified, minimum_investment, is_quiz_eligible')
        .order('name');

      if (error) throw error;
      setFunds(data || []);
    } catch (error: any) {
      console.error('Error fetching funds:', error);
      toast({
        title: 'Error',
        description: 'Failed to load funds',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.manager_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Funds</h1>
          <p className="text-muted-foreground mt-2">
            Direct access to edit all fund pages as super admin
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          {filteredFunds.length} Fund{filteredFunds.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funds by name or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredFunds.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No funds found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFunds.map((fund) => (
                  <Card key={fund.id} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {fund.manager_name && (
                          <CompanyLogo managerName={fund.manager_name} size="sm" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg truncate">{fund.name}</h3>
                            {fund.is_verified && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20 shrink-0">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {fund.is_quiz_eligible && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shrink-0">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Quiz Active
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {fund.manager_name && (
                              <span className="truncate">{fund.manager_name}</span>
                            )}
                            {fund.category && (
                              <>
                                <span>•</span>
                                <span>{fund.category}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatCurrency(fund.minimum_investment)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link to={`/${fund.id}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/manage-fund/${fund.id}`}>
                            <Button size="sm">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Fund
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
