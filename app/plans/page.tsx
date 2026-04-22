'use client';
import { useState } from 'react';
import Link from 'next/link';
import { workoutPlans, exercises } from '@/lib/exercises';
import { useAuth } from '@/lib/auth-context';
import { Clock, Dumbbell, Flame, ChevronRight, Play, X, Lock } from 'lucide-react';

export default function PlansPage() {
  const { isSubscribed } = useAuth();
  const [selected, setSelected] = useState<typeof workoutPlans[0] | null>(null);
  const subscribed = isSubscribed();

  const diffColor = (d: string) => {
    if (d === 'Beginner') return 'badge-beginner';
    if (d === 'Intermediate') return 'badge-intermediate';
    return 'badge-advanced';
  };

  return (
    <div className="min-h-screen pt-16 bg-gym-black">
      <div className="border-b border-gym-border bg-gym-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            Workout <span className="text-neon-green">Plans</span>
          </h1>
          <p className="text-gray-500">Expert-designed programs for every goal and level</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!subscribed && (
          <div className="mb-8 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-neon-green" />
              <span className="text-sm font-medium">Start your free trial to access all workout plans</span>
            </div>
            <Link href="/pricing" className="btn-neon px-4 py-2 rounded-lg text-sm font-bold">
              Start Free Trial
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {workoutPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan)}
              className="neon-card rounded-2xl overflow-hidden cursor-pointer group hover:border-neon-green/30 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x192/1A1A1A/39FF14?text=GymBuddy'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${diffColor(plan.difficulty)} mb-2 inline-block`}>
                    {plan.difficulty}
                  </span>
                  <h2 className="text-xl font-black text-white">{plan.name}</h2>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{plan.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{plan.duration}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5" />{plan.exercises.length} exercises</span>
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" />{plan.calories} cal/session</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{plan.frequency}</span>
                  <div className="flex items-center gap-1.5 text-neon-green text-sm font-semibold">
                    <Play className="w-4 h-4" /> View Plan
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="bg-gym-dark border border-gym-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between p-5 border-b border-gym-border">
              <div>
                <h2 className="text-xl font-black">{selected.name}</h2>
                <p className="text-sm text-gray-500">{selected.nameUrdu}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-48 object-cover rounded-xl mb-5"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x192/1A1A1A/39FF14?text=GymBuddy'; }}
              />

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Duration', value: selected.duration },
                  { label: 'Frequency', value: selected.frequency },
                  { label: 'Difficulty', value: selected.difficulty },
                ].map(s => (
                  <div key={s.label} className="bg-gym-card rounded-xl p-3 text-center">
                    <div className="text-neon-green font-bold text-sm">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">{selected.description}</p>

              <h3 className="font-bold mb-3">Exercises in this plan</h3>
              <div className="space-y-2 mb-6">
                {selected.exercises.map((exId, i) => {
                  const ex = exercises.find(e => e.id === exId);
                  if (!ex) return null;
                  return (
                    <div key={exId} className="flex items-center gap-3 bg-gym-card rounded-xl p-3">
                      <span className="w-6 h-6 rounded-full bg-neon-green/20 text-neon-green text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <img src={ex.thumbnail} alt={ex.name} className="w-10 h-10 rounded object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1A1A1A/39FF14?text=GB'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{ex.name}</p>
                        <p className="text-xs text-gray-500">{ex.sets} sets · {ex.reps} reps</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${diffColor(ex.difficulty)}`}>{ex.difficulty}</span>
                    </div>
                  );
                })}
              </div>

              {subscribed ? (
                <button className="btn-neon w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Start This Plan
                </button>
              ) : (
                <Link href="/pricing" className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 border border-neon-green/30 text-neon-green hover:bg-neon-green/5 transition-all">
                  <Lock className="w-4 h-4" /> Unlock This Plan — Start Free Trial
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
