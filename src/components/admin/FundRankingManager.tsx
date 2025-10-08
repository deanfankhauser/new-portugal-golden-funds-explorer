import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Hash,
  AlertCircle,
  Save,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { FundRankingService, FundRankingData } from '@/services/fundRankingService';
import { Fund } from '@/data/types/funds';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type EnrichedFund = Fund & { rankingData: FundRankingData };

const FundRankingManager: React.FC = () => {
  const { funds: allFunds, loading: fundsLoading } = useRealTimeFunds();
  const [rankings, setRankings] = useState<FundRankingData[]>([]);
  const [enrichedFunds, setEnrichedFunds] = useState<EnrichedFund[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFund, setEditingFund] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const { toast } = useToast();

  // Fetch rankings from Supabase
  useEffect(() => {
    fetchRankings();
  }, []);

  // Enrich funds with ranking data whenever funds or rankings change
  useEffect(() => {
    if (!fundsLoading && allFunds.length > 0) {
      const enriched = FundRankingService.enrichFundsWithRankings(allFunds, rankings);
      const sorted = FundRankingService.sortByRank(enriched);
      setEnrichedFunds(sorted);
      setLoading(false);
    }
  }, [allFunds, rankings, fundsLoading]);

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_rankings')
        .select('*')
        .order('manual_rank');

      if (error) throw error;

      // Transform DB data to include computed fields
      const enrichedRankings: FundRankingData[] = (data || []).map(row => ({
        ...row,
        recency_rank: null, // Will be computed later
        final_rank: row.manual_rank || 999
      }));

      setRankings(enrichedRankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fund rankings',
        variant: 'destructive'
      });
    }
  };

  const saveRanking = async (fundId: string, manual_rank: number, notes?: string) => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('fund_rankings')
        .select('id')
        .eq('fund_id', fundId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('fund_rankings')
          .update({ 
            manual_rank,
            notes: notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('fund_id', fundId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('fund_rankings')
          .insert({
            fund_id: fundId,
            manual_rank,
            notes: notes || null
          });

        if (error) throw error;
      }

      await fetchRankings();
      
      toast({
        title: 'Success',
        description: 'Ranking saved successfully'
      });
    } catch (error) {
      console.error('Error saving ranking:', error);
      toast({
        title: 'Error',
        description: 'Failed to save ranking',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
      setEditingFund(null);
    }
  };

  const moveRank = async (fund: EnrichedFund, direction: 'up' | 'down') => {
    const currentRank = fund.rankingData.manual_rank || 999;
    const newRank = direction === 'up' ? Math.max(1, currentRank - 1) : currentRank + 1;
    await saveRanking(fund.id, newRank, fund.rankingData.notes || undefined);
  };

  const filteredFunds = enrichedFunds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rankedCount = enrichedFunds.filter(f => f.rankingData.manual_rank !== null).length;
  const recencyRankedCount = enrichedFunds.length - rankedCount;

  if (loading || fundsLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading rankings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Manually Ranked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rankedCount}</div>
            <p className="text-xs text-muted-foreground">
              {((rankedCount / enrichedFunds.length) * 100).toFixed(0)}% of total funds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Recency Ranked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recencyRankedCount}</div>
            <p className="text-xs text-muted-foreground">Ranked by update recency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Total Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrichedFunds.length}</div>
            <p className="text-xs text-muted-foreground">All funds in the system</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Ranking Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Fund Rankings
              </CardTitle>
              <CardDescription>
                Manage fund visibility and rankings across the site
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  How Rankings Work
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fund Ranking System</DialogTitle>
                  <DialogDescription className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Manual Rank</h4>
                      <p className="text-sm">
                        Set custom rankings for funds. Lower numbers = higher visibility (rank 1 appears first). 
                        Manual ranks always take priority over recency-based rankings.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recency Rank</h4>
                      <p className="text-sm">
                        Funds without manual ranks are automatically ranked by how recently they were updated.
                        More recently updated funds appear higher in the list. This encourages fund managers 
                        to keep their information current.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Priority Order</h4>
                      <p className="text-sm">
                        1. Manual ranks (highest priority)<br/>
                        2. Recency-based ranks (for unranked funds)<br/>
                        3. Completely unranked funds appear last
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search funds by name, manager, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {filteredFunds.map((fund, index) => (
                <div
                  key={fund.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank Display */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <div className="text-2xl font-bold text-primary">
                        #{fund.rankingData.final_rank}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveRank(fund, 'up')}
                          disabled={saving}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveRank(fund, 'down')}
                          disabled={saving}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Fund Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{fund.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="truncate">{fund.managerName}</span>
                            <Badge variant="outline" className="text-xs">
                              {fund.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Ranking Details */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Manual:</span>
                          <span>{fund.rankingData.manual_rank || '—'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Last Updated:</span>
                          <span>
                            {fund.updatedAt 
                              ? new Date(fund.updatedAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })
                              : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Notes Section */}
                      {editingFund === fund.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add notes about this ranking (optional)..."
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="min-h-[60px]"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                const currentRank = fund.rankingData.manual_rank || index + 1;
                                saveRanking(fund.id, currentRank, editNotes);
                              }}
                              disabled={saving}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save Notes
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingFund(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : fund.rankingData.notes ? (
                        <div 
                          className="text-xs text-muted-foreground italic bg-muted p-2 rounded cursor-pointer"
                          onClick={() => {
                            setEditingFund(fund.id);
                            setEditNotes(fund.rankingData.notes || '');
                          }}
                        >
                          {fund.rankingData.notes}
                        </div>
                      ) : null}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingFund(fund.id);
                          setEditNotes(fund.rankingData.notes || '');
                        }}
                      >
                        {fund.rankingData.notes ? 'Edit Notes' : 'Add Notes'}
                      </Button>
                    </div>
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

export default FundRankingManager;
