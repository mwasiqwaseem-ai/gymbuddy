'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { User, Edit2, Save, Crown, Clock, Flame, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

const goals = ['Build Muscle', 'Lose Weight', 'Stay Fit', 'Increase Strength', 'Improve Endurance'];

export default function ProfilePage() {
  const { user, userData, updateUserData, loading } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    height: '',
    weight: '',
    age: '',
    goal: 'Build Muscle',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (userData) {
      setForm({
        displayName: user?.displayName || '',
        height: userData.height || '',
        weight: userData.weight || '',
        age: userData.age || '',
        goal: userData.goal || 'Build Muscle',
      });
    }
  }, [user, userData, loading, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserData({
        height: form.height,
        weight: form.weight,
        age: form.age,
        goal: form.goal,
      });
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || !userData) {
    return (
      <div className="min-h-screen pt-16 bg-gym-black">
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  const trialDaysLeft = userData.trialEndDate
    ? Math.max(0, Math.ceil((userData.trialEndDate.getTime() - Date.now()) / (1000*60*60*24)))
    : 0;

  const subStatusLabel = () => {
    if (userData.subscriptionStatus === 'active') return { label: 'Premium Active', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (userData.subscriptionStatus === 'trial') return { label: `Free Trial — ${trialDaysLeft} days left`, color: 'text-neon-green', bg: 'bg-neon-green/10' };
    return { label: 'Trial Expired', color: 'text-red-400', bg: 'bg-red-400/10' };
  };
  const status = subStatusLabel();

  return (
    <div className="min-h-screen pt-16 bg-gym-black page-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Profile Card */}
        <div className="neon-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black">My Profile</h1>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                editing ? 'btn-neon' : 'border border-gym-border hover:border-gray-500 text-gray-300'
              }`}
            >
              {editing ? (
                <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</>
              ) : (
                <><Edit2 className="w-4 h-4" /> Edit</>
              )}
            </button>
          </div>

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-20 h-20 rounded-2xl border-2 border-gym-border object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-neon-green/20 border-2 border-neon-green/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-neon-green" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.displayName || 'Athlete'}</h2>
              <p className="text-sm text-gray-500">{user.email || user.phoneNumber}</p>
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mt-1.5 ${status.bg} ${status.color}`}>
                {userData.subscriptionStatus === 'active' && <Crown className="w-3 h-3" />}
                {status.label}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Flame, label: 'Streak', value: `${userData.streak || 0} 🔥`, color: 'text-orange-400' },
              { icon: Dumbbell, label: 'Goal', value: userData.goal || '—', color: 'text-neon-green' },
              { icon: Clock, label: 'Member Since', value: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—', color: 'text-blue-400' },
            ].map((s, i) => (
              <div key={i} className="bg-gym-dark rounded-xl p-3 text-center">
                <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                <p className="text-sm font-semibold truncate">{s.value}</p>
                <p className="text-xs text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175' },
              { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 80' },
              { label: 'Age', key: 'age', placeholder: 'e.g. 25' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs text-gray-500 mb-1.5">{field.label}</label>
                <input
                  type="number"
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  disabled={!editing}
                  className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Fitness Goal</label>
              <select
                value={form.goal}
                onChange={e => setForm(prev => ({ ...prev, goal: e.target.value }))}
                disabled={!editing}
                className="w-full bg-gym-dark border border-gym-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {goals.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="neon-card rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Subscription</h2>

          <div className="flex items-center justify-between p-4 bg-gym-dark rounded-xl mb-4">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className={`text-sm ${status.color} font-semibold`}>{status.label}</p>
            </div>
            {userData.subscriptionStatus !== 'active' && (
              <Link href="/pricing" className="btn-neon px-4 py-2 rounded-lg text-sm font-bold">
                Upgrade
              </Link>
            )}
          </div>

          {userData.subscriptionStatus === 'active' && (
            <button
              onClick={async () => {
                const res = await fetch('/api/customer-portal', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: user.uid }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
              className="w-full py-3 rounded-xl border border-gym-border text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm"
            >
              Manage Subscription / Cancel / Download Invoice
            </button>
          )}

          <div className="mt-4 text-xs text-gray-600 text-center">
            Payments secured by Stripe · PKR 3,000/month after trial
          </div>
        </div>
      </div>
    </div>
  );
}
