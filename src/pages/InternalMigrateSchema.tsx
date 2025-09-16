import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MigrationResult {
  success: boolean;
  message?: string;
  summary?: any;
  error?: string;
}

export default function InternalMigrateSchema() {
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        const { data, error } = await supabase.functions.invoke('migrate-schema', {
          body: {}
        });
        if (error) {
          setResult({ success: false, error: error.message });
        } else {
          setResult({ success: true, summary: data });
        }
      } catch (e: any) {
        setResult({ success: false, error: e?.message || 'Unknown error' });
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl py-10">
      <h1 className="text-2xl font-semibold mb-4">Schema Migration Runner</h1>
      <p className="mb-4">This invokes the migrate-schema Edge Function to copy schema from production to Funds_Develop.</p>
      {loading && <p>Running migration...</p>}
      {!loading && result && (
        <pre className="rounded-md p-4 bg-muted overflow-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
