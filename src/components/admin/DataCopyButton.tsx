import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const DataCopyButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCopyData = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🚀 Starting data copy to Funds_Develop...');
      
      const { data, error } = await supabase.functions.invoke('copy-data-to-develop', {
        body: {}
      });

      if (error) {
        console.error('❌ Copy function error:', error);
        toast.error('Copy Failed', {
          description: `Error: ${error.message}`
        });
        setResult({ success: false, error: error.message });
      } else {
        console.log('✅ Copy completed:', data);
        toast.success('Copy Completed!', {
          description: `Successfully copied data from ${data.results?.copied_tables?.length || 0} tables`
        });
        setResult(data);
      }
    } catch (err: any) {
      console.error('💥 Unexpected error:', err);
      toast.error('Copy Failed', {
        description: 'An unexpected error occurred'
      });
      setResult({ success: false, error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Copy Data to Funds_Develop
        </CardTitle>
        <CardDescription>
          This will copy all data from the main Fund project to the Funds_Develop project.
          <br />
          <strong>Warning:</strong> This will overwrite existing data in Funds_Develop.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={handleCopyData} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Copying Data...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Start Data Copy
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.success ? (
                <div className="space-y-2">
                  <p className="font-medium">✅ Data copy completed successfully!</p>
                  {result.results?.copied_tables && (
                    <div>
                      <p className="text-sm">Tables copied:</p>
                      <ul className="text-xs list-disc list-inside ml-4">
                        {result.results.copied_tables.map((table: string) => (
                          <li key={table}>{table} ({result.results.stats[table]} records)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.results?.errors && result.results.errors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-orange-600">Warnings:</p>
                      <ul className="text-xs list-disc list-inside ml-4">
                        {result.results.errors.map((error: string, idx: number) => (
                          <li key={idx} className="text-orange-600">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>❌ Copy failed: {result.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <p><strong>What gets copied:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>All admin users and permissions</li>
            <li>Manager and investor profiles</li>
            <li>All fund data</li>
            <li>Fund edit suggestions and history</li>
            <li>Account deletion requests</li>
            <li>Storage bucket configurations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};