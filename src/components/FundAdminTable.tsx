
import React from 'react';
import { Fund } from '../data/funds';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

interface FundAdminTableProps {
  funds: Fund[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FundAdminTable: React.FC<FundAdminTableProps> = ({ funds, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fund Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Min Investment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funds.map((fund) => (
            <TableRow key={fund.id}>
              <TableCell className="font-medium">{fund.name}</TableCell>
              <TableCell>{fund.category}</TableCell>
              <TableCell>{formatCurrency(fund.minimumInvestment)}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                  ${fund.fundStatus === 'Open' ? 'bg-green-100 text-green-800' : ''} 
                  ${fund.fundStatus === 'Closing Soon' ? 'bg-amber-100 text-amber-800' : ''}
                  ${fund.fundStatus === 'Closed' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {fund.fundStatus}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onEdit(fund.id)}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    onClick={() => onDelete(fund.id)}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FundAdminTable;
