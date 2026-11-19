import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { verifyAndActivateSubscription } from '../services/subscriptionService';
import { getActiveSubscription, isBackendEnabled } from '../services/backendService';

const POLL_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 1500;

async function waitForActiveSubscription(reference: string): Promise<boolean> {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
    const subscription = await getActiveSubscription();
    if (subscription?.status === 'active' && subscription.reference === reference) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  return false;
}

export default function SubscriptionCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const txRef = searchParams.get('tx_ref') || searchParams.get('transaction_id');
    const statusParam = searchParams.get('status');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!txRef) {
      setStatus('error');
      return;
    }

    let cancelled = false;

    const confirmSubscription = async () => {
      if (statusParam !== 'successful' && statusParam !== 'completed') {
        setStatus('error');
        return;
      }

      if (isBackendEnabled) {
        try {
          const active = await waitForActiveSubscription(txRef);
          if (cancelled) return;
          if (active) {
            setStatus('success');
            setTimeout(() => navigate('/dashboard'), 2000);
          } else {
            setStatus('error');
          }
        } catch (error) {
          console.error('Failed to verify subscription:', error);
          if (!cancelled) setStatus('error');
        }
        return;
      }

      const result = verifyAndActivateSubscription(user.id, txRef);
      if (result && result.status === 'active') {
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setStatus('error');
      }
    };

    void confirmSubscription();

    return () => {
      cancelled = true;
    };
  }, [searchParams, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">?</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your subscription has been activated. Redirecting to dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">?</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">We couldn't verify your payment. Please try again or contact support.</p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
