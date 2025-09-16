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
          console.warn('supabase.functions.invoke failed, falling back to direct fetch:', error.message);
          const resp = await fetch('https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/migrate-schema', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8'
            },
            body: JSON.stringify({})
          });

          if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`HTTP ${resp.status}: ${text}`);
          }

          const json = await resp.json();
          setResult({ success: true, summary: json });
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
