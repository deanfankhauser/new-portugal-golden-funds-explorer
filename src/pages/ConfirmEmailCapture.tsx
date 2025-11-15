import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PageSEO from '@/components/common/PageSEO';

export default function ConfirmEmailCapture() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link. No token provided.');
        return;
      }

      try {
        // Find the email by confirmation token
        const { data: emailData, error: findError } = await supabase
          .from('email_captures')
          .select('id, email, status')
          .eq('confirmation_token', token)
          .single();

        if (findError || !emailData) {
          console.error('Error finding email:', findError);
          setStatus('error');
          setMessage('Invalid or expired confirmation link.');
          return;
        }

        // Check if already confirmed
        if (emailData.status === 'confirmed') {
          setStatus('success');
          setMessage("You're already confirmed! No need to confirm again.");
          return;
        }

        // Update status to confirmed
        const { error: updateError } = await supabase
          .from('email_captures')
          .update({
            status: 'confirmed',
            confirmed_at: new Date().toISOString(),
            confirmation_token: null, // Clear token for security
          })
          .eq('id', emailData.id);

        if (updateError) {
          console.error('Error updating confirmation:', updateError);
          setStatus('error');
          setMessage('Failed to confirm your subscription. Please try again.');
          return;
        }

        setStatus('success');
        setMessage('Successfully confirmed! You\'ll start receiving our fund updates.');

        // Redirect to homepage after 5 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <>

      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-200">
          <CardContent className="pt-6">
            {status === 'loading' && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Confirming your subscription...
                </h2>
                <p className="text-sm text-gray-600">Please wait a moment</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  You're confirmed! 🎉
                </h2>
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-sm text-gray-700">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-gray-600 mb-6">
                  Thanks for confirming! You'll receive our latest Golden Visa fund picks and investment insights.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Browse Funds
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  Redirecting to homepage in 5 seconds...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Oops! Something went wrong
                </h2>
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-gray-700">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-gray-600 mb-6">
                  The confirmation link may be invalid or expired. Please try subscribing again or contact support if the problem persists.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Return to Home
                  </Button>
                  <Button
                    onClick={() => navigate('/contact')}
                    variant="outline"
                    className="w-full"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
