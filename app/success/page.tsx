'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { CheckCircle, Crown, ChevronRight, Dumbbell } from 'lucide-react';

export default function SuccessPage() {
  const { updateUserData } = useAuth();

  useEffect(() => {
    // The webhook will handle actual subscription activation
    // This page just shows confirmation
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gym-black flex items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-md w-full px-4 text-center">

        {/* Success animation */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6 border-2 border-neon-green/50 streak-pop">
            <CheckCircle className="w-12 h-12 text-neon-green" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-400 text-sm font-bold mb-4">
            <Crown className="w-4 h-4" /> Premium Activated
          </div>
          <h1 className="text-4xl font-black mb-3">Welcome to<br /><span className="text-neon-green">Premium!</span></h1>
          <p className="text-gray-400 text-lg">
            Your subscription is now active. Time to get to work! 💪
          </p>
        </div>

        <div className="neon-card rounded-2xl p-6 mb-6 text-left">
          <h3 className="font-bold mb-4">You now have access to:</h3>
          <div className="space-y-3">
            {[
              'All 30+ HD exercise videos',
              '4 expert workout plans',
              'Progress tracking & streaks',
              'English, Urdu & Japanese support',
              'New content added monthly',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-neon-green flex-shrink-0" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Link href="/dashboard"
          className="btn-neon w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mb-4">
          <Dumbbell className="w-5 h-5" />
          Start Training Now
          <ChevronRight className="w-5 h-5" />
        </Link>

        <Link href="/exercises" className="text-sm text-gray-500 hover:text-white transition-colors">
          Browse exercises →
        </Link>
      </div>
    </div>
  );
}
