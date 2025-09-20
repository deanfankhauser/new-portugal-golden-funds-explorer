import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, TrendingUp, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MonthlyPerformanceData {
  returns?: number;
  aum?: number;
  nav?: number;
}

interface HistoricalPerformanceEditorProps {
  value?: Record<string, MonthlyPerformanceData>;
  onChange: (value: Record<string, MonthlyPerformanceData>) => void;
}

const HistoricalPerformanceEditor: React.FC<HistoricalPerformanceEditorProps> = ({
  value = {},
  onChange
}) => {
  const [performanceData, setPerformanceData] = useState<Record<string, MonthlyPerformanceData>>(value);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    setPerformanceData(value || {});
  }, [value]);

  // Generate year options (last 3 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 3; i++) {
      years.push((currentYear - i).toString());
    }
    return years;
  };

  // Generate month options
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const yearOptions = generateYearOptions();

  const addMonthFromSelection = () => {
    if (selectedYear && selectedMonth) {
      const monthKey = `${selectedYear}-${selectedMonth}`;
      if (!performanceData[monthKey]) {
        const newData = {
          ...performanceData,
          [monthKey]: { returns: 0, aum: 0, nav: 1.0 }
        };
        setPerformanceData(newData);
        onChange(newData);
        setSelectedYear('');
        setSelectedMonth('');
      }
    }
  };

  // Check if a month is already added or outside valid range
  const isMonthAvailable = (year: string, month: string) => {
    const monthKey = `${year}-${month}`;
    const currentDate = new Date();
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1);
    
    return !performanceData[monthKey] && selectedDate <= currentDate;
  };

  const existingMonths = Object.keys(performanceData).sort().reverse();

  const removeMonth = (monthKey: string) => {
    const newData = { ...performanceData };
    delete newData[monthKey];
    setPerformanceData(newData);
    onChange(newData);
  };

  const updateMonthData = (monthKey: string, field: keyof MonthlyPerformanceData, value: number) => {
    const newData = {
      ...performanceData,
      [monthKey]: {
        ...performanceData[monthKey],
        [field]: value
      }
    };
    setPerformanceData(newData);
    onChange(newData);
  };

  const getMonthDisplayName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Historical Performance (Monthly Data)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add monthly performance data for up to the last 3 years
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new month with year/month selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label>Select Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Choose year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Select Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Choose month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions
                  .filter(month => selectedYear ? isMonthAvailable(selectedYear, month.value) : true)
                  .map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button 
              onClick={addMonthFromSelection}
              disabled={!selectedYear || !selectedMonth}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Month
            </Button>
          </div>
        </div>

        {/* Existing months */}
        <div className="space-y-4">
          {existingMonths.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No monthly data added yet. Select a month to get started.
            </p>
          ) : (
            existingMonths.map((monthKey) => {
              const data = performanceData[monthKey];
              return (
                <Card key={monthKey} className="border-muted">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-sm">
                        {getMonthDisplayName(monthKey)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMonth(monthKey)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`returns-${monthKey}`}>Returns (%)</Label>
                        <Input
                          id={`returns-${monthKey}`}
                          type="number"
                          step="0.01"
                          value={data?.returns || 0}
                          onChange={(e) => updateMonthData(monthKey, 'returns', parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 2.5 or -1.2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`aum-${monthKey}`}>AUM (€)</Label>
                        <Input
                          id={`aum-${monthKey}`}
                          type="number"
                          step="1000000"
                          value={data?.aum || 0}
                          onChange={(e) => updateMonthData(monthKey, 'aum', parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 50000000"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          €{((data?.aum || 0) / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <Label htmlFor={`nav-${monthKey}`}>NAV</Label>
                        <Input
                          id={`nav-${monthKey}`}
                          type="number"
                          step="0.001"
                          value={data?.nav || 1.0}
                          onChange={(e) => updateMonthData(monthKey, 'nav', parseFloat(e.target.value) || 1.0)}
                          placeholder="e.g., 1.025"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {existingMonths.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Tip: Returns can be positive or negative. AUM should be in euros (will display in millions). 
              NAV typically starts at 1.0 and changes based on performance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalPerformanceEditor;
