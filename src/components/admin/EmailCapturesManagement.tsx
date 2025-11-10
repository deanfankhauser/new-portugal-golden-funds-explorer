import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Mail, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface EmailCapture {
  id: string;
  email: string;
  source: string;
  status: string;
  created_at: string;
  confirmed_at: string | null;
  user_agent: string | null;
  referrer_url: string | null;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  confirmedThisMonth: number;
  confirmationRate: number;
}

export default function EmailCapturesManagement() {
  const [captures, setCaptures] = useState<EmailCapture[]>([]);
  const [filteredCaptures, setFilteredCaptures] = useState<EmailCapture[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    confirmedThisMonth: 0,
    confirmationRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const { toast } = useToast();

  // Fetch email captures
  const fetchCaptures = async () => {
    try {
      const { data, error } = await supabase
        .from('email_captures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCaptures(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching email captures:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email captures',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data: EmailCapture[]) => {
    const total = data.length;
    const pending = data.filter((c) => c.status === 'pending_confirmation').length;
    const confirmed = data.filter((c) => c.status === 'confirmed').length;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const confirmedThisMonth = data.filter(
      (c) => c.status === 'confirmed' && new Date(c.confirmed_at!) >= startOfMonth
    ).length;

    const confirmationRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

    setStats({
      total,
      pending,
      confirmed,
      confirmedThisMonth,
      confirmationRate,
    });
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchCaptures();

    const channel = supabase
      .channel('email_captures_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_captures',
        },
        () => {
          fetchCaptures();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...captures];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCaptures(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [captures, statusFilter, searchQuery]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Email',
      'Status',
      'Source',
      'Created At',
      'Confirmed At',
      'User Agent',
      'Referrer URL',
    ];

    const rows = filteredCaptures.map((capture) => [
      capture.email,
      capture.status,
      capture.source,
      format(new Date(capture.created_at), 'yyyy-MM-dd HH:mm:ss'),
      capture.confirmed_at
        ? format(new Date(capture.confirmed_at), 'yyyy-MM-dd HH:mm:ss')
        : '',
      capture.user_agent || '',
      capture.referrer_url || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `email-captures-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: `Exported ${filteredCaptures.length} email captures`,
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredCaptures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCaptures = filteredCaptures.slice(startIndex, endIndex);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      confirmed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      pending_confirmation: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      unsubscribed: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
      bounced: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    }[status] || { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Mail };

    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading email captures...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Captures</CardTitle>
            <Mail className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Confirmed This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.confirmedThisMonth}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Confirmation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.confirmationRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Email Captures</CardTitle>
            <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending_confirmation">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Source</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Confirmed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCaptures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No email captures found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCaptures.map((capture) => (
                    <TableRow key={capture.id}>
                      <TableCell className="font-medium">{capture.email}</TableCell>
                      <TableCell>
                        <StatusBadge status={capture.status} />
                      </TableCell>
                      <TableCell className="text-gray-600">{capture.source}</TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(capture.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {capture.confirmed_at
                          ? format(new Date(capture.confirmed_at), 'MMM dd, yyyy HH:mm')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredCaptures.length)} of{' '}
                {filteredCaptures.length} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
