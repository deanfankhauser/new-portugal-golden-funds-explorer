import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Mail, MailCheck, MailX, Search, Eye, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  user_agent: string | null;
  referrer: string | null;
  admin_email_sent: boolean;
  admin_email_sent_at: string | null;
  user_email_sent: boolean;
  user_email_sent_at: string | null;
  postmark_message_id: string | null;
  error_message: string | null;
  created_at: string;
}

export function ContactSubmissionsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const { data: submissions, isLoading, refetch } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const filteredSubmissions = submissions?.filter((submission) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      submission.name.toLowerCase().includes(searchLower) ||
      submission.email.toLowerCase().includes(searchLower) ||
      submission.subject.toLowerCase().includes(searchLower) ||
      submission.message.toLowerCase().includes(searchLower)
    );
  });

  const getEmailStatusBadge = (adminSent: boolean, userSent: boolean) => {
    if (adminSent && userSent) {
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <MailCheck className="h-3 w-3 mr-1" />
          All Sent
        </Badge>
      );
    }
    if (adminSent && !userSent) {
      return (
        <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Mail className="h-3 w-3 mr-1" />
          Admin Only
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <MailX className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>All contact form submissions with email delivery status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Submissions
              </CardTitle>
              <CardDescription>
                {submissions?.length || 0} total submissions
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, subject, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredSubmissions && filteredSubmissions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Email Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(submission.created_at), "MMM d, yyyy")}
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(submission.created_at), "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>
                        <a 
                          href={`mailto:${submission.email}`} 
                          className="text-primary hover:underline"
                        >
                          {submission.email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {submission.subject}
                      </TableCell>
                      <TableCell>
                        {getEmailStatusBadge(submission.admin_email_sent, submission.user_email_sent)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No submissions match your search" : "No contact submissions yet"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && format(new Date(selectedSubmission.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1">
                    <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <p className="mt-1">{selectedSubmission.subject}</p>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Email Delivery Status */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Email Delivery Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {selectedSubmission.admin_email_sent ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Admin Notification</p>
                      {selectedSubmission.admin_email_sent_at && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(selectedSubmission.admin_email_sent_at), "MMM d, h:mm a")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSubmission.user_email_sent ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-medium">User Confirmation</p>
                      {selectedSubmission.user_email_sent_at && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(selectedSubmission.user_email_sent_at), "MMM d, h:mm a")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedSubmission.postmark_message_id && (
                  <div className="mt-3">
                    <label className="text-xs font-medium text-muted-foreground">Postmark Message ID</label>
                    <p className="text-xs font-mono">{selectedSubmission.postmark_message_id}</p>
                  </div>
                )}

                {selectedSubmission.error_message && (
                  <div className="mt-3 p-3 bg-destructive/10 rounded-lg">
                    <label className="text-xs font-medium text-destructive">Error Message</label>
                    <p className="text-sm text-destructive">{selectedSubmission.error_message}</p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              {(selectedSubmission.referrer || selectedSubmission.user_agent) && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Metadata</h4>
                  <div className="space-y-2 text-sm">
                    {selectedSubmission.referrer && (
                      <div>
                        <span className="text-muted-foreground">Referrer: </span>
                        <span className="font-mono text-xs">{selectedSubmission.referrer}</span>
                      </div>
                    )}
                    {selectedSubmission.user_agent && (
                      <div>
                        <span className="text-muted-foreground">User Agent: </span>
                        <span className="font-mono text-xs break-all">{selectedSubmission.user_agent}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
