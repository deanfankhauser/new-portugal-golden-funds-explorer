import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, RefreshCw, Search, TrendingUp, Users, Eye, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface FundAnalytics {
  fund_id: string;
  fund_name: string;
  manager_name: string;
  company_name: string;
  manager_email: string;
  last_sign_in_at: string | null;
  team_members_count: number;
  total_leads: number;
  recent_leads: number;
  total_impressions: number;
  recent_impressions: number;
}

type SortField = keyof FundAnalytics;
type SortDirection = 'asc' | 'desc';

export default function FundAnalyticsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("recent_impressions");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ["fund-analytics"],
    queryFn: async () => {
      const { data, error: rpcError } = await supabase.rpc("get_fund_manager_sign_ins");
      if (rpcError) {
        const msg = rpcError.message || rpcError.details || rpcError.hint || "RPC failed";
        console.error('RPC Error (fund-analytics):', rpcError);
        throw new Error(msg);
      }
      return data as FundAnalytics[];
    },
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    retry: 1, // Don't retry auth errors multiple times
  });

  const getErrorMessage = (e: unknown): string => {
    const anyE = e as any;
    return anyE?.message || anyE?.details || anyE?.error_description || anyE?.hint || 'Unknown error occurred';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = analytics
    ?.filter(item => 
      item.fund_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manager_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const stats = analytics ? {
    totalFunds: analytics.length,
    activeManagers: analytics.filter(a => a.last_sign_in_at && 
      new Date(a.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    totalLeads30Days: analytics.reduce((sum, a) => sum + (a.recent_leads || 0), 0),
    totalImpressions30Days: analytics.reduce((sum, a) => sum + (a.recent_impressions || 0), 0),
  } : null;

  if (error) {
    const errorMsg = getErrorMessage(error);
    const isAccessDenied = errorMsg.toLowerCase().includes('access denied');
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Unable to Load Analytics</CardTitle>
            <CardDescription>
              {isAccessDenied 
                ? "You don't have permission to view this data" 
                : "There was an error loading fund analytics data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded">
                {errorMsg}
              </p>
              {isAccessDenied ? (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium">This usually means:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>You're not signed in as an admin user on this environment</li>
                    <li>Please sign in with an admin account or contact support</li>
                  </ul>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Common causes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Your session may have expired</li>
                    <li>You may not have the required permissions</li>
                    <li>There may be a database configuration issue</li>
                  </ul>
                </div>
              )}
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalFunds || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Managers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeManagers || 0}</div>
                <p className="text-xs text-muted-foreground">Signed in last 30 days</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads (30d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalLeads30Days || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions (30d)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalImpressions30Days.toLocaleString() || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fund Analytics Dashboard</CardTitle>
              <CardDescription>Monitor fund performance, manager activity, and engagement metrics</CardDescription>
            </div>
            <Button onClick={() => refetch()} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funds or managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("fund_name")}>
                    <div className="flex items-center gap-1">
                      Fund Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("manager_name")}>
                    <div className="flex items-center gap-1">
                      Manager
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("last_sign_in_at")}>
                    <div className="flex items-center gap-1">
                      Last Sign-In
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("team_members_count")}>
                    <div className="flex items-center justify-end gap-1">
                      Team
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("recent_leads")}>
                    <div className="flex items-center justify-end gap-1">
                      30d Leads
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("total_leads")}>
                    <div className="flex items-center justify-end gap-1">
                      Total Leads
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("recent_impressions")}>
                    <div className="flex items-center justify-end gap-1">
                      30d Views
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("total_impressions")}>
                    <div className="flex items-center justify-end gap-1">
                      Total Views
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSorted?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No funds found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSorted?.map((fund) => (
                    <TableRow key={fund.fund_id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/funds/${fund.fund_id}`} 
                          className="hover:underline text-primary"
                        >
                          {fund.fund_name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{fund.company_name || fund.manager_name}</div>
                          {fund.manager_email && (
                            <div className="text-xs text-muted-foreground">{fund.manager_email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {fund.last_sign_in_at ? (
                          <Badge variant={
                            new Date(fund.last_sign_in_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                              ? "default"
                              : new Date(fund.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                              ? "secondary"
                              : "outline"
                          }>
                            {formatDistanceToNow(new Date(fund.last_sign_in_at), { addSuffix: true })}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Never</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {fund.team_members_count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={fund.recent_leads > 0 ? "font-semibold text-success" : ""}>
                          {fund.recent_leads}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{fund.total_leads}</TableCell>
                      <TableCell className="text-right">
                        <span className={fund.recent_impressions > 0 ? "font-semibold" : ""}>
                          {fund.recent_impressions.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{fund.total_impressions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/funds/${fund.fund_id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}