import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Edit3, Trash2, Clock, CheckCircle, XCircle, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFundEditing, FundEditSuggestion } from '@/hooks/useFundEditing';

const MyEditsSection: React.FC = () => {
  const [suggestions, setSuggestions] = useState<FundEditSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<FundEditSuggestion | null>(null);
  const { getUserSuggestions, isAuthenticated } = useFundEditing();
  const { toast } = useToast();

  const loadSuggestions = async () => {
    if (!isAuthenticated) return;
    
    try {
      const userSuggestions = await getUserSuggestions();
      setSuggestions(userSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to load your edit suggestions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [isAuthenticated]);

  const deleteSuggestion = async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from('fund_edit_suggestions')
        .delete()
        .eq('id', suggestionId)
        .eq('status', 'pending'); // Only allow deletion of pending suggestions

      if (error) throw error;

      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      toast({
        title: "Suggestion Deleted",
        description: "Your edit suggestion has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to delete suggestion. Only pending suggestions can be deleted.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderValueComparison = (field: string, currentValue: any, suggestedValue: any) => {
    const isChanged = JSON.stringify(currentValue) !== JSON.stringify(suggestedValue);
    
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="font-medium text-muted-foreground mb-1">Current</div>
          <div className={`p-2 bg-muted rounded text-xs ${isChanged ? 'border-l-2 border-red-400' : ''}`}>
            {typeof currentValue === 'object' 
              ? JSON.stringify(currentValue, null, 1) 
              : String(currentValue || 'Not set')}
          </div>
        </div>
        <div>
          <div className="font-medium text-muted-foreground mb-1">Suggested</div>
          <div className={`p-2 bg-muted rounded text-xs ${isChanged ? 'border-l-2 border-green-400' : ''}`}>
            {typeof suggestedValue === 'object' 
              ? JSON.stringify(suggestedValue, null, 1) 
              : String(suggestedValue || 'Not set')}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to view your edit suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading your edit suggestions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          My Edit Suggestions ({suggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No edit suggestions yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Submit suggestions when viewing fund details to help keep information accurate.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(suggestion.status)}
                        <span className="font-medium font-mono text-sm">{suggestion.fund_id}</span>
                        <Badge className={getStatusColor(suggestion.status)}>
                          {suggestion.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(suggestion.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          {Object.keys(suggestion.suggested_changes || {}).length} field(s) changed
                        </div>
                      </div>

                      {suggestion.status === 'rejected' && suggestion.rejection_reason && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</div>
                          <div className="text-sm text-red-700">{suggestion.rejection_reason}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSuggestion(suggestion)}
                      >
                        View Details
                      </Button>
                      
                      {suggestion.status === 'pending' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Suggestion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this edit suggestion? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteSuggestion(suggestion.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedSuggestion && (
          <AlertDialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
            <AlertDialogContent className="max-w-4xl max-h-[80vh]">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Edit Suggestion - {selectedSuggestion.fund_id}
                  <Badge className={getStatusColor(selectedSuggestion.status)}>
                    {selectedSuggestion.status}
                  </Badge>
                </AlertDialogTitle>
              </AlertDialogHeader>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Submitted on {new Date(selectedSuggestion.created_at).toLocaleDateString()}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Proposed Changes</h4>
                    {Object.keys(selectedSuggestion.suggested_changes || {}).map((field) => (
                      <div key={field} className="space-y-2">
                        <h5 className="text-sm font-medium capitalize">{field.replace(/_/g, ' ')}</h5>
                        {renderValueComparison(
                          field,
                          selectedSuggestion.current_values?.[field],
                          selectedSuggestion.suggested_changes?.[field]
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedSuggestion.status === 'rejected' && selectedSuggestion.rejection_reason && (
                    <>
                      <Separator />
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="font-medium text-red-800 mb-2">Rejection Reason</div>
                        <div className="text-sm text-red-700">
                          {selectedSuggestion.rejection_reason}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};

export default MyEditsSection;