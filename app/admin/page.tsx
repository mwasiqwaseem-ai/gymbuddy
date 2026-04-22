'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { exercises as defaultExercises } from '@/lib/exercises';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Dumbbell, CreditCard, TrendingUp, Plus, Edit2, Trash2, Save, X, Shield, BarChart2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'users' | 'exercises' | 'plans';

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  subscriptionStatus: string;
  createdAt: any;
  streak: number;
}

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, revenue: 0 });
  const [dataLoading, setDataLoading] = useState(true);
  const [addExModal, setAddExModal] = useState(false);
  const [newEx, setNewEx] = useState({ name: '', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: '', youtubeId: '', sets: '3', reps: '10-12', calories: '100', description: '' });

  useEffect(() => {
    if (!loading && (!user || !userData?.isAdmin)) {
      toast.error('Admin access required');
      router.push('/');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (userData?.isAdmin) fetchData();
  }, [userData]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData: AdminUser[] = [];
      let active = 0, trial = 0;

      usersSnap.forEach(doc => {
        const d = doc.data();
        usersData.push({ id: doc.id, email: d.email || '', displayName: d.displayName || 'User', subscriptionStatus: d.subscriptionStatus || 'trial', createdAt: d.createdAt, streak: d.streak || 0 });
        if (d.subscriptionStatus === 'active') active++;
        if (d.subscriptionStatus === 'trial') trial++;
      });

      setUsers(usersData);
      setStats({ total: usersData.length, active, trial, revenue: active * 3000 });
    } catch {
      toast.error('Failed to load data');
    } finally {
      setDataLoading(false);
    }
  };

  const blockUser = async (uid: string, blocked: boolean) => {
    await updateDoc(doc(db, 'users', uid), { blocked: !blocked });
    toast.success(`User ${blocked ? 'unblocked' : 'blocked'}`);
    fetchData();
  };

  if (loading || !userData?.isAdmin) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gym-black">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">Checking admin access...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
  ] as const;

  return (
    <div className="min-h-screen pt-16 bg-gym-black">
      {/* Admin Header */}
      <div className="border-b border-gym-border bg-gym-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Admin Panel</h1>
              <p className="text-xs text-gray-500">Logged in as {user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-neon-green text-black' : 'text-gray-400 hover:bg-white/5'
                }`}>
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Total Users', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { icon: TrendingUp, label: 'Active Subs', value: stats.active, color: 'text-neon-green', bg: 'bg-neon-green/10' },
                { icon: Eye, label: 'On Trial', value: stats.trial, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { icon: CreditCard, label: 'Monthly Revenue', value: `PKR ${stats.revenue.toLocaleString()}`, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              ].map((s, i) => (
                <div key={i} className="neon-card rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="text-2xl font-black mb-1">{s.value}</div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent users */}
            <div className="neon-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b border-gym-border">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Streak</th>
                      <th className="pb-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gym-border">
                    {users.slice(0, 10).map(u => (
                      <tr key={u.id}>
                        <td className="py-3 pr-4">
                          <p className="font-medium truncate max-w-xs">{u.displayName}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            u.subscriptionStatus === 'active' ? 'bg-neon-green/10 text-neon-green' :
                            u.subscriptionStatus === 'trial' ? 'bg-yellow-400/10 text-yellow-400' :
                            'bg-red-400/10 text-red-400'
                          }`}>
                            {u.subscriptionStatus}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-orange-400">{u.streak} 🔥</td>
                        <td className="py-3 text-gray-500 text-xs">
                          {u.createdAt?.toDate?.()?.toLocaleDateString() || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="neon-card rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gym-border flex items-center justify-between">
              <h2 className="text-xl font-bold">All Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gym-border bg-gym-dark">
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Subscription</th>
                    <th className="px-5 py-3">Streak</th>
                    <th className="px-5 py-3">Joined</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gym-border">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium">{u.displayName}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.subscriptionStatus === 'active' ? 'bg-neon-green/10 text-neon-green' :
                          u.subscriptionStatus === 'trial' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-red-400/10 text-red-400'
                        }`}>
                          {u.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-orange-400">{u.streak} 🔥</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {u.createdAt?.toDate?.()?.toLocaleDateString() || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateDoc(doc(db, 'users', u.id), { subscriptionStatus: 'active' }).then(() => { toast.success('Activated'); fetchData(); })}
                            className="text-xs px-2 py-1 rounded bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors"
                          >
                            Activate
                          </button>
                          <button
                            onClick={() => updateDoc(doc(db, 'users', u.id), { subscriptionStatus: 'expired' }).then(() => { toast.success('Revoked'); fetchData(); })}
                            className="text-xs px-2 py-1 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXERCISES TAB */}
        {tab === 'exercises' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Exercises ({defaultExercises.length})</h2>
              <button
                onClick={() => setAddExModal(true)}
                className="btn-neon px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Exercise
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultExercises.map(ex => (
                <div key={ex.id} className="neon-card rounded-xl overflow-hidden">
                  <img src={ex.thumbnail} alt={ex.name} className="w-full h-32 object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x128/1A1A1A/39FF14?text=GB'; }} />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{ex.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{ex.muscleGroup} · {ex.difficulty} · {ex.equipment}</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://youtube.com/watch?v=${ex.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-xs text-center py-1.5 rounded border border-gym-border text-gray-400 hover:text-white transition-colors"
                      >
                        View Video
                      </a>
                      <button className="p-1.5 rounded border border-red-400/20 text-red-400 hover:bg-red-400/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Exercise Modal */}
      {addExModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gym-dark border border-gym-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gym-border">
              <h2 className="text-xl font-black">Add New Exercise</h2>
              <button onClick={() => setAddExModal(false)} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Exercise Name', key: 'name', placeholder: 'e.g. Bench Press' },
                { label: 'YouTube Video ID', key: 'youtubeId', placeholder: 'e.g. rT7DgCr-3pg' },
                { label: 'Equipment', key: 'equipment', placeholder: 'e.g. Barbell' },
                { label: 'Sets', key: 'sets', placeholder: '3' },
                { label: 'Reps', key: 'reps', placeholder: '10-12' },
                { label: 'Calories', key: 'calories', placeholder: '100' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    value={newEx[field.key as keyof typeof newEx]}
                    onChange={e => setNewEx(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-gym-card border border-gym-border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/40 text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Muscle Group</label>
                <select value={newEx.muscleGroup} onChange={e => setNewEx(prev => ({ ...prev, muscleGroup: e.target.value }))}
                  className="w-full bg-gym-card border border-gym-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none">
                  {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Difficulty</label>
                <select value={newEx.difficulty} onChange={e => setNewEx(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full bg-gym-card border border-gym-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none">
                  {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Description</label>
                <textarea value={newEx.description} onChange={e => setNewEx(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief exercise description..."
                  rows={3}
                  className="w-full bg-gym-card border border-gym-border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/40 text-sm resize-none" />
              </div>

              <button
                onClick={() => {
                  if (!newEx.name || !newEx.youtubeId) return toast.error('Name and YouTube ID required');
                  toast.success(`Exercise "${newEx.name}" added! (Add to exercises.ts to persist)`);
                  setAddExModal(false);
                  setNewEx({ name: '', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: '', youtubeId: '', sets: '3', reps: '10-12', calories: '100', description: '' });
                }}
                className="btn-neon w-full py-3 rounded-xl font-bold"
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
