import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Search, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FundVerificationService } from '@/services/fundVerificationService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FundData {
  id: string;
  name: string;
  category?: string;
  manager_name?: string;
  website?: string;
  is_verified?: boolean;
  verified_at?: string;
}

const FundManagement: React.FC = () => {
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [togglingFunds, setTogglingFunds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchFunds();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('fund-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funds'
        },
        () => {
          fetchFunds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFunds = async () => {
    try {
      const { data, error } = await supabase
        .from('funds')
        .select('id, name, category, manager_name, website, is_verified, verified_at')
        .order('is_verified', { ascending: false })
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

  const handleVerificationToggle = async (fundId: string, currentStatus: boolean) => {
    setTogglingFunds(prev => new Set(prev).add(fundId));

    try {
      const result = currentStatus 
        ? await FundVerificationService.unverifyFund(fundId)
        : await FundVerificationService.verifyFund(fundId);

      if (result.success) {
        toast({
          title: 'Success',
          description: `Fund ${currentStatus ? 'unverified' : 'verified'} successfully`,
        });
        fetchFunds();
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update verification status',
        variant: 'destructive'
      });
    } finally {
      setTogglingFunds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fundId);
        return newSet;
      });
    }
  };

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = 
      fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.manager_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVerification = 
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && fund.is_verified) ||
      (verificationFilter === 'unverified' && !fund.is_verified);

    return matchesSearch && matchesVerification;
  });

  const verifiedCount = funds.filter(f => f.is_verified).length;
  const unverifiedCount = funds.length - verifiedCount;

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
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Verified Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-muted-foreground" />
              Unverified Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{unverifiedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Funds List */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Verification Management</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
            <div className="flex items-center gap-2 flex-1 w-full">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <Select value={verificationFilter} onValueChange={(value: any) => setVerificationFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Funds</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredFunds.map((fund) => (
                  <div
                    key={fund.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      fund.is_verified 
                        ? 'bg-green-50/50 border-green-200' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{fund.name}</h4>
                          {fund.is_verified && (
                            <Badge className="bg-green-600 text-white border-green-700">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              VERIFIED
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <span className="truncate">{fund.manager_name}</span>
                          <Badge variant="outline" className="text-xs">{fund.category}</Badge>
                          {fund.verified_at && (
                            <span className="text-xs">
                              Verified: {new Date(fund.verified_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {fund.website && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(fund.website, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {fund.is_verified ? 'Verified' : 'Unverified'}
                          </span>
                          <Switch
                            checked={fund.is_verified || false}
                            onCheckedChange={() => handleVerificationToggle(fund.id, fund.is_verified || false)}
                            disabled={togglingFunds.has(fund.id)}
                          />
                          {togglingFunds.has(fund.id) && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredFunds.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No funds found matching your filters
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FundManagement;
