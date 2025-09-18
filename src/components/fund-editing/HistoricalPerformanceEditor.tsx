import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    setPerformanceData(value || {});
  }, [value]);

  const addMonthFromDate = (date: Date) => {
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!performanceData[monthKey]) {
      const newData = {
        ...performanceData,
        [monthKey]: { returns: 0, aum: 0, nav: 1.0 }
      };
      setPerformanceData(newData);
      onChange(newData);
      setSelectedDate(undefined); // Reset the date picker
    }
  };

  // Check if a date is already added or outside the 3-year range
  const isDateDisabled = (date: Date) => {
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const currentDate = new Date();
    const threeYearsAgo = new Date(currentDate.getFullYear() - 3, currentDate.getMonth(), 1);
    
    // Disable if already added or outside 3-year range
    return performanceData[monthKey] !== undefined || 
           date > currentDate || 
           date < threeYearsAgo;
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
        {/* Add new month with calendar */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label>Add Month</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MMMM yyyy") : "Select a month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      addMonthFromDate(date);
                    }
                  }}
                  disabled={isDateDisabled}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
