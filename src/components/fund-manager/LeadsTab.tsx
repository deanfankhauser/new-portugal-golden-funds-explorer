import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Mail, Calendar, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeadsTabProps {
  fundId: string;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ fundId }) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Lead Management Coming Soon</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          View and manage prospective investors who have shown interest in your fund.
        </p>
        <Badge variant="secondary">In Development</Badge>
      </div>

      <Card className="opacity-60">
        <CardHeader>
          <CardTitle>Prospective Investors</CardTitle>
          <CardDescription>Users who have contacted you about this fund</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  No leads yet. Leads will appear here once investors contact you.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">---</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">---</div>
            <p className="text-xs text-muted-foreground mt-1">New inquiries</p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">---</div>
            <p className="text-xs text-muted-foreground mt-1">Avg. response time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadsTab;
