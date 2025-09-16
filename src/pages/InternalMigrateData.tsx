import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MigrationResult {
  success: boolean;
  message?: string;
  summary?: any;
  results?: any[];
  error?: string;
}

export default function InternalMigrateData() {
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        console.log('Starting data migration...');
        const { data, error } = await supabase.functions.invoke('migrate-data', {
          body: {}
        });
        
        if (error) {
          console.error('Migration error:', error);
          setResult({ success: false, error: error.message });
        } else {
          console.log('Migration completed:', data);
          setResult({ success: true, ...data });
        }
      } catch (e: any) {
        console.error('Unexpected error:', e);
        setResult({ success: false, error: e?.message || 'Unknown error' });
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  return (
    <main className="container mx-auto max-w-4xl py-10">
      <h1 className="text-2xl font-semibold mb-4">Data Migration Runner</h1>
      <p className="mb-4">
        This copies all data from the production Funds project to the Funds_Develop project.
        It will clear existing data in development and copy fresh data from production.
      </p>
      
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          Running migration... This may take a few minutes.
        </div>
      )}
      
      {!loading && result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h2 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? 'Migration Successful!' : 'Migration Failed'}
            </h2>
            {result.message && <p className="mt-1">{result.message}</p>}
          </div>

          {result.summary && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Total Tables: {result.summary.total_tables}</li>
                <li>Successful: {result.summary.successful}</li>
                <li>Failed: {result.summary.failed}</li>
                <li>Total Rows Migrated: {result.summary.total_rows}</li>
              </ul>
            </div>
          )}

          {result.results && result.results.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">Detailed Results</h3>
              <div className="space-y-2 text-sm">
                {result.results.map((tableResult: any, index: number) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-2 rounded ${
                      tableResult.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <span className="font-medium">{tableResult.table}</span>
                    <div className="text-right">
                      <span className={tableResult.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                        {tableResult.status === 'success' ? '✓' : '✗'} {tableResult.rowsProcessed} rows
                      </span>
                      {tableResult.error && (
                        <div className="text-red-600 text-xs mt-1">{tableResult.error}</div>
                      )}
                      {tableResult.message && (
                        <div className="text-gray-600 text-xs mt-1">{tableResult.message}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">Full Response</h3>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}