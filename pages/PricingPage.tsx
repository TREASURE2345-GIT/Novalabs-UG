import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { initiateFlutterwavePayment } from '../services/subscriptionService';
import { isBackendEnabled, startSubscriptionCheckout } from '../services/backendService';
import type { SubscriptionPlan } from '../types';

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<SubscriptionPlan | null>(null);

  const handleSubscribe = async (plan: Exclude<SubscriptionPlan, 'free'>) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(plan);
    try {
      const paymentUrl = isBackendEnabled
        ? (await startSubscriptionCheckout(plan)).link
        : initiateFlutterwavePayment(user, plan);
      window.location.href = paymentUrl;
    } catch (error) {
      console.error(error);
      setLoading(null);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/">
            <img src="/novalab-logo.png" alt="NovaLabs" className="h-12 w-auto" />
          </Link>
          <div className="space-x-4">
            {user ? (
              <Link to="/dashboard" className="px-6 py-2 text-blue-600 hover:text-blue-900 font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2 text-blue-600 hover:text-blue-900 font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access basic lab features for free. Upgrade for advanced learning features, student management, and school-wide access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">UGX 0</span>
                <span className="text-gray-600">/forever</span>
              </div>
              <p className="text-gray-600 mb-6">Access to basic laboratory features</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Basic virtual lab experiments</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Self-paced learning</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Progress tracking</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Access on any device</span></li>
              </ul>
              {user ? (
                <div className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg text-center font-medium">Current Plan</div>
              ) : (
                <Link to="/register" className="block w-full py-3 px-6 bg-gray-900 text-white rounded-lg text-center font-medium hover:bg-black transition">Get Started</Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold">POPULAR</div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">UGX 15,000</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">For students and teachers who want more</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>All free features</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Advanced learning features</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Student & teacher tools</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Priority support</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Detailed analytics</span></li>
              </ul>
              <button onClick={() => handleSubscribe('monthly_premium')} disabled={loading === 'monthly_premium'} className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {loading === 'monthly_premium' ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">School Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">UGX 500,000</span>
                <span className="text-gray-600">/year</span>
              </div>
              <p className="text-gray-600 mb-6">For entire schools and institutions</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>All Premium features</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>School-wide access</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Multi-teacher management</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Student bulk registration</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Custom reporting</span></li>
                <li className="flex items-start gap-2"><span className='text-green-500 mt-1'>?</span><span className='text-gray-700'>Dedicated support</span></li>
              </ul>
              <button onClick={() => handleSubscribe('school')} disabled={loading === 'school'} className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg text-center font-medium hover:bg-indigo-700 transition disabled:opacity-50">
                {loading === 'school' ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Payments are processed securely via Flutterwave. NovaLabs verifies all payments on the backend.</p>
        </div>
      </div>
    </div>
  );
}
