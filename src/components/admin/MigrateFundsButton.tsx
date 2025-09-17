import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { fundsData } from '@/data/mock/funds';

const MigrateFundsButton: React.FC = () => {
  const [migrating, setMigrating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const migrateFunds = async () => {
    setMigrating(true);
    setStatus('idle');

    try {
      // Get current fund count
      const { count: currentCount } = await supabase
        .from('funds')
        .select('*', { count: 'exact' });

      console.log(`Current funds in database: ${currentCount}`);
      console.log(`Static funds available: ${fundsData.length}`);

      if (currentCount >= fundsData.length) {
        toast.info(`Database already has ${currentCount} funds. No migration needed.`);
        setStatus('success');
        setMigrating(false);
        return;
      }

      // Get existing fund IDs to avoid duplicates
      const { data: existingFunds } = await supabase
        .from('funds')
        .select('id');

      const existingIds = new Set(existingFunds?.map(f => f.id) || []);

      // Prepare funds for insertion
      const fundsToInsert = fundsData
        .filter(fund => !existingIds.has(fund.id))
        .map(fund => ({
          id: fund.id,
          name: fund.name,
          description: fund.description,
          detailed_description: fund.detailedDescription,
          manager_name: fund.managerName,
          minimum_investment: fund.minimumInvestment,
          management_fee: fund.managementFee,
          performance_fee: fund.performanceFee || 0,
          category: fund.category,
          gv_eligible: true, // All our funds are GV eligible
          expected_return_min: parseFloat(fund.returnTarget?.split('-')[0]?.replace('%', '')) || null,
          expected_return_max: parseFloat(fund.returnTarget?.split('-')[1]?.replace('%', '')) || null,
          risk_level: 'Medium', // Default risk level since it's not in the Fund type
          currency: 'EUR',
          website: fund.websiteUrl,
          lock_up_period_months: fund.term ? fund.term * 12 : null,
          aum: fund.fundSize ? fund.fundSize * 1000000 : null,
          inception_date: fund.established ? `${fund.established}-01-01` : null,
          geographic_allocation: fund.geographicAllocation as any || null,
          team_members: fund.team as any || null,
          pdf_documents: fund.documents as any || null,
          faqs: fund.faqs as any || null,
          tags: fund.tags || []
        }));

      console.log(`Preparing to insert ${fundsToInsert.length} funds`);

      if (fundsToInsert.length === 0) {
        toast.info('No new funds to migrate.');
        setStatus('success');
        setMigrating(false);
        return;
      }

      // Insert funds in batches
      const batchSize = 10;
      let insertedCount = 0;

      for (let i = 0; i < fundsToInsert.length; i += batchSize) {
        const batch = fundsToInsert.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('funds')
          .insert(batch as any); // Type assertion to handle complex JSON types

        if (error) {
          console.error('Error inserting batch:', error);
          throw error;
        }

        insertedCount += batch.length;
        console.log(`Inserted ${insertedCount}/${fundsToInsert.length} funds`);
      }

      toast.success(`Successfully migrated ${insertedCount} funds to the database!`);
      setStatus('success');

      // Refresh the page to see the new funds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Migration error:', error);
      toast.error(`Migration failed: ${error.message}`);
      setStatus('error');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Fund Data Migration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Migrate static fund data to the database. This will add all {fundsData.length} funds from the static data files.
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={migrateFunds}
            disabled={migrating}
            variant={status === 'success' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            {migrating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : status === 'error' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            {migrating ? 'Migrating...' : status === 'success' ? 'Migration Complete' : 'Migrate Funds'}
          </Button>
          
          {status === 'success' && (
            <span className="text-sm text-green-600">
              Funds successfully migrated!
            </span>
          )}
          
          {status === 'error' && (
            <span className="text-sm text-red-600">
              Migration failed - check console
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrateFundsButton;