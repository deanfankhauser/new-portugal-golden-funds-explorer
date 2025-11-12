import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAllFunds } from '@/hooks/useFundsQuery';
import { createComparisonSlug } from '../../utils/comparisonUtils';
import { ArrowRight } from 'lucide-react';

const ComparisonFinder = () => {
  const [fund1, setFund1] = useState<string>('');
  const [fund2, setFund2] = useState<string>('');
  const navigate = useNavigate();
  
  // Fetch all funds from database
  const { data: allFunds, isLoading } = useAllFunds();

  const handleCompare = () => {
    if (fund1 && fund2 && fund1 !== fund2) {
      const normalizedSlug = createComparisonSlug(fund1, fund2);
      navigate(`/compare/${normalizedSlug}`);
    }
  };

  const availableFunds = allFunds ? allFunds.filter(f => f.id !== fund1) : [];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center">Compare Any Two Funds</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading funds...
          </div>
        ) : !allFunds || allFunds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No funds available for comparison
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                First Fund
              </label>
              <Select value={fund1} onValueChange={setFund1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first fund" />
                </SelectTrigger>
                <SelectContent>
                  {allFunds.map((fund) => (
                    <SelectItem key={fund.id} value={fund.id}>
                      {fund.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          <div className="hidden md:block text-muted-foreground">
            <ArrowRight className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Second Fund
            </label>
            <Select 
              value={fund2} 
              onValueChange={setFund2}
              disabled={!fund1}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select second fund" />
              </SelectTrigger>
              <SelectContent>
                {availableFunds.map((fund) => (
                  <SelectItem key={fund.id} value={fund.id}>
                    {fund.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            <Button 
              onClick={handleCompare}
              disabled={!fund1 || !fund2 || fund1 === fund2}
              className="px-8"
            >
              Compare
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonFinder;