'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Check, Zap, Crown, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  '30+ HD Exercise Videos',
  '4 Expert Workout Plans',
  'Progress & Streak Tracking',
  'English, Urdu & Japanese',
  'Personalized Dashboard',
  'Save Favourite Exercises',
  'New Content Every Month',
  'Cancel Anytime',
];

export default function PricingPage() {
  const { user, userData, isSubscribed } = useAuth();
  const [loading, setLoading] = useState(false);
  const subscribed = isSubscribed();

  const handleCheckout = async () => {
    if (!user) return toast.error('Please login first');
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Checkout failed. Please try again.');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gym-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            Simple <span className="text-neon-green">Pricing</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-xl mx-auto">
            One plan. Everything included. Less than a single PT session.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="relative neon-card rounded-3xl p-8 border border-neon-green/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />

            {/* Badges */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-bold">
                <Zap className="w-3 h-3" /> MOST POPULAR
              </span>
              {subscribed && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold">
                  <Crown className="w-3 h-3" /> CURRENT PLAN
                </span>
              )}
            </div>

            {/* Price display */}
            <div className="flex items-end gap-4 mb-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Start with</p>
                <p className="text-3xl font-black text-neon-green">7 Days FREE</p>
              </div>
              <div className="mb-1 text-gray-600 font-bold text-xl">→</div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Then only</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">PKR 3,000</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-8">No credit card required for trial period</p>

            <div className="h-px bg-gym-border mb-6" />

            {/* Features */}
            <p className="text-sm text-gray-400 mb-4 font-medium">Everything included:</p>
            <div className="space-y-3 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-neon-green" />
                  </div>
                  <span className="text-sm text-gray-300">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {!user ? (
              <Link href="/signup" className="btn-neon w-full py-4 rounded-xl font-bold text-center block text-lg">
                Start 7-Day Free Trial
              </Link>
            ) : subscribed ? (
              <div className="space-y-3">
                <div className="w-full py-3 rounded-xl border border-neon-green/30 text-neon-green text-center font-semibold">
                  ✓ You're all set — Premium Active
                </div>
                <button
                  onClick={handlePortal}
                  disabled={loading}
                  className="w-full py-3 rounded-xl border border-gym-border text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm"
                >
                  {loading ? 'Loading...' : 'Manage Subscription / Cancel'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-neon w-full py-4 rounded-xl font-bold text-lg disabled:opacity-50"
              >
                {loading ? 'Redirecting...' : 'Start Free Trial → Upgrade'}
              </button>
            )}

            <p className="text-center text-xs text-gray-600 mt-3">
              <Shield className="w-3 h-3 inline mr-1" />
              Secure payment via Stripe · Cancel anytime
            </p>
          </div>

          {/* FAQ */}
          <div className="mt-12 space-y-4">
            <h3 className="text-xl font-bold text-center mb-6">Common Questions</h3>
            {[
              { q: 'Do I need a credit card for the trial?', a: 'No! Start your 7-day free trial with just Google or phone login. No payment info needed.' },
              { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime from your profile or the Stripe customer portal. No questions asked.' },
              { q: 'What happens after my trial ends?', a: 'After 7 days, your account will be restricted. Enter payment details to continue with full access.' },
              { q: 'Is my payment secure?', a: 'All payments are processed by Stripe, the world\'s most trusted payment platform. We never store your card details.' },
            ].map((faq, i) => (
              <div key={i} className="neon-card rounded-xl p-5">
                <h4 className="font-semibold text-sm mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
