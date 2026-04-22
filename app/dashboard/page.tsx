'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { exercises, workoutPlans } from '@/lib/exercises';
import { Flame, Dumbbell, TrendingUp, Heart, ChevronRight, Play, Zap, AlertTriangle, Crown } from 'lucide-react';

function SkeletonCard() {
  return <div className="skeleton rounded-2xl h-28" />;
}

export default function DashboardPage() {
  const { user, userData, isSubscribed, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen pt-16 bg-gym-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="skeleton h-10 w-64 rounded-xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const trialDaysLeft = userData?.trialEndDate
    ? Math.max(0, Math.ceil((userData.trialEndDate.getTime() - Date.now()) / (1000*60*60*24)))
    : 0;

  const subscribed = isSubscribed();
  const todayExercises = exercises.slice(0, 4);
  const favoriteExercises = exercises.filter(e => userData?.favorites?.includes(e.id)).slice(0, 4);
  const firstName = user.displayName?.split(' ')[0] || 'Athlete';

  const stats = [
    { icon: Flame, label: 'Day Streak', value: userData?.streak || 0, color: 'text-orange-400', bg: 'bg-orange-400/10', suffix: '🔥' },
    { icon: Dumbbell, label: 'Total Workouts', value: 0, color: 'text-neon-green', bg: 'bg-neon-green/10' },
    { icon: TrendingUp, label: 'Calories Burned', value: 0, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: Heart, label: 'Saved Exercises', value: userData?.favorites?.length || 0, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gym-black page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Trial/Subscription Banner */}
        {!subscribed && userData?.subscriptionStatus === 'expired' && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Your trial has expired. Upgrade to continue training.</span>
            </div>
            <Link href="/pricing" className="btn-neon px-4 py-2 rounded-lg text-sm font-bold">
              Upgrade Now
            </Link>
          </div>
        )}

        {userData?.subscriptionStatus === 'trial' && trialDaysLeft <= 3 && trialDaysLeft > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-medium">
                Your free trial ends in {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''}!
              </span>
            </div>
            <Link href="/pricing" className="btn-neon px-4 py-2 rounded-lg text-sm font-bold">
              Upgrade Now
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Good morning,</p>
            <h1 className="text-4xl font-black">
              {firstName} <span className="text-neon-green">💪</span>
            </h1>
            {userData?.subscriptionStatus === 'trial' && (
              <p className="text-gray-500 text-sm mt-1">
                Free trial: <span className="text-neon-green font-medium">{trialDaysLeft} days left</span>
              </p>
            )}
            {userData?.subscriptionStatus === 'active' && (
              <div className="flex items-center gap-2 mt-1">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Premium Member</span>
              </div>
            )}
          </div>
          <Link href="/exercises" className="btn-neon px-6 py-3 rounded-xl font-bold flex items-center gap-2 self-start">
            <Play className="w-4 h-4" /> Start Workout
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="neon-card rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">{stat.value}</span>
                {stat.suffix && <span className={`text-lg ${i === 0 ? 'streak-pop inline-block' : ''}`}>{stat.suffix}</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Workout */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Today's Workout</h2>
              <Link href="/exercises" className="text-neon-green text-sm hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {todayExercises.map((ex) => (
                <div key={ex.id} className="neon-card rounded-xl p-4 flex items-center gap-4 group hover:border-neon-green/20 transition-all">
                  <img
                    src={ex.thumbnail}
                    alt={ex.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/1A1A1A/39FF14?text=GB'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-0.5 truncate">{ex.name}</h3>
                    <p className="text-xs text-gray-500">{ex.muscleGroup} · {ex.sets} sets · {ex.reps} reps</p>
                    <div className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium badge-${ex.difficulty.toLowerCase()}`}>
                      {ex.difficulty}
                    </div>
                  </div>
                  <Link href="/exercises" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-neon-green" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workout Plans */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Plans</h2>
                <Link href="/plans" className="text-neon-green text-sm hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {workoutPlans.slice(0, 2).map((plan) => (
                  <div key={plan.id} className="neon-card rounded-xl p-4">
                    <h3 className="font-semibold text-sm mb-1">{plan.name}</h3>
                    <p className="text-xs text-gray-500">{plan.frequency} · {plan.duration}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded badge-${plan.difficulty.toLowerCase()}`}>{plan.difficulty}</span>
                      <Link href="/plans" className="text-xs text-neon-green hover:underline">Start →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Exercises */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Saved</h2>
                <Link href="/exercises" className="text-neon-green text-sm hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {favoriteExercises.length > 0 ? (
                <div className="space-y-2">
                  {favoriteExercises.map(ex => (
                    <div key={ex.id} className="neon-card rounded-lg p-3 flex items-center gap-3">
                      <img src={ex.thumbnail} alt={ex.name} className="w-10 h-10 rounded object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1A1A1A/39FF14?text=GB'; }} />
                      <span className="text-sm font-medium truncate">{ex.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="neon-card rounded-xl p-6 text-center">
                  <Heart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No saved exercises yet</p>
                  <Link href="/exercises" className="text-neon-green text-xs hover:underline mt-1 inline-block">Browse exercises →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
