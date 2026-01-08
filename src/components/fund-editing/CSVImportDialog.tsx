import React, { useState } from 'react';
import Papa from 'papaparse';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadCSVTemplate } from '@/utils/csvTemplates';

interface MonthlyPerformanceData {
  returns?: number;
  aum?: number;
  nav?: number;
}

interface CSVRow {
  date: string;
  returns?: number;
  aum?: number;
  nav?: number;
  error?: string;
}

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: Record<string, MonthlyPerformanceData>) => void;
  existingData: Record<string, MonthlyPerformanceData>;
}

const CSVImportDialog: React.FC<CSVImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
  existingData
}) => {
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const validateAndParseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: CSVRow[] = [];
        const validationErrors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          const lineNum = index + 2; // +2 because header is line 1, data starts at line 2

          // Check for required Date column
          const date = row.Date || row.date || row.DATE || row.Month || row.month;
          if (!date) {
            validationErrors.push(`Line ${lineNum}: Missing date column`);
            return;
          }

          // Validate date format (YYYY-MM)
          const dateRegex = /^\d{4}-\d{2}$/;
          if (!dateRegex.test(date)) {
            validationErrors.push(`Line ${lineNum}: Invalid date format "${date}". Expected YYYY-MM (e.g., 2024-01)`);
            return;
          }

          // Parse numeric values
          const returns = row.Returns || row.returns || row.RETURNS;
          const aum = row.AUM || row.aum;
          const nav = row.NAV || row.nav;

          const parsedRow: CSVRow = {
            date: date.trim(),
          };

          // Validate and parse returns
          if (returns !== undefined && returns !== '') {
            const returnsNum = parseFloat(returns);
            if (isNaN(returnsNum)) {
              parsedRow.error = `Invalid returns value: ${returns}`;
            } else {
              parsedRow.returns = returnsNum;
            }
          }

          // Validate and parse AUM (expecting millions)
          if (aum !== undefined && aum !== '') {
            const aumNum = parseFloat(aum);
            if (isNaN(aumNum)) {
              parsedRow.error = `Invalid AUM value: ${aum}`;
            } else {
              parsedRow.aum = aumNum;
            }
          }

          // Validate and parse NAV
          if (nav !== undefined && nav !== '') {
            const navNum = parseFloat(nav);
            if (isNaN(navNum)) {
              parsedRow.error = `Invalid NAV value: ${nav}`;
            } else {
              parsedRow.nav = navNum;
            }
          }

          rows.push(parsedRow);
        });

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        } else {
          setErrors([]);
        }

        setParsedData(rows);
        setFileName(file.name);
      },
      error: (error) => {
        toast({
          variant: "destructive",
          title: "CSV Parse Error",
          description: error.message,
        });
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a CSV file",
        });
        return;
      }
      validateAndParseCSV(file);
    }
  };

  const handleImport = () => {
    const validRows = parsedData.filter(row => !row.error);
    
    if (validRows.length === 0) {
      toast({
        variant: "destructive",
        title: "No Valid Data",
        description: "No valid rows to import",
      });
      return;
    }

    // Convert to the format expected by the editor
    const importData: Record<string, MonthlyPerformanceData> = {};
    validRows.forEach(row => {
      importData[row.date] = {
        returns: row.returns,
        aum: row.aum ? row.aum * 1000000 : undefined, // Convert millions to euros
        nav: row.nav
      };
    });

    // Merge with existing data
    const mergedData = { ...existingData, ...importData };
    onImport(mergedData);

    toast({
      title: "Import Successful",
      description: `Imported ${validRows.length} month${validRows.length !== 1 ? 's' : ''} of data`,
    });

    // Reset and close
    setParsedData([]);
    setFileName('');
    setErrors([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setParsedData([]);
    setFileName('');
    setErrors([]);
    onOpenChange(false);
  };

  const validRowCount = parsedData.filter(row => !row.error).length;
  const errorRowCount = parsedData.filter(row => row.error).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Historical Performance Data
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Upload a CSV file with your historical performance data. Expected format: Date, Returns, AUM, NAV</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadCSVTemplate}
              className="gap-2 text-xs"
            >
              <Download className="h-3 w-3" />
              Download Template
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* CSV Format Help */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Expected CSV format:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong>Date</strong> (required): YYYY-MM format (e.g., 2024-01)</li>
                <li><strong>Returns</strong> (optional): Monthly return percentage (e.g., 2.5 or -1.2)</li>
                <li><strong>AUM</strong> (optional): Assets under management in millions (e.g., 50 for €50M)</li>
                <li><strong>NAV</strong> (optional): Net asset value (e.g., 1.025)</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">
                Note: Column names are case-insensitive. Existing data will be overwritten for matching dates.
              </p>
            </AlertDescription>
          </Alert>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Validation Errors:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview Data */}
          {parsedData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Preview ({parsedData.length} rows)</h4>
                <div className="flex gap-4 text-sm">
                  {validRowCount > 0 && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      {validRowCount} valid
                    </span>
                  )}
                  {errorRowCount > 0 && (
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {errorRowCount} errors
                    </span>
                  )}
                </div>
              </div>

              <div className="border rounded-lg max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Returns (%)</TableHead>
                      <TableHead>AUM (€M)</TableHead>
                      <TableHead>NAV</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((row, idx) => (
                      <TableRow key={idx} className={row.error ? 'bg-destructive/10' : ''}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.returns !== undefined ? row.returns.toFixed(2) : '-'}</TableCell>
                        <TableCell>{row.aum !== undefined ? `€${row.aum.toFixed(1)}M` : '-'}</TableCell>
                        <TableCell>{row.nav !== undefined ? row.nav.toFixed(3) : '-'}</TableCell>
                        <TableCell>
                          {row.error ? (
                            <span className="text-destructive text-sm">{row.error}</span>
                          ) : existingData[row.date] ? (
                            <span className="text-amber-600 text-sm">Will overwrite</span>
                          ) : (
                            <span className="text-emerald-600 text-sm">New</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={validRowCount === 0}
          >
            Import {validRowCount > 0 ? `${validRowCount} Row${validRowCount !== 1 ? 's' : ''}` : 'Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportDialog;
