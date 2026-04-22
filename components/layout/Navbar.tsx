'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/lang-context';
import { Menu, X, Dumbbell, ChevronDown, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en' as const, label: 'EN', flag: '🇺🇸', name: 'English' },
  { code: 'ur' as const, label: 'UR', flag: '🇵🇰', name: 'اردو' },
  { code: 'ja' as const, label: 'JA', flag: '🇯🇵', name: '日本語' },
];

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const isActive = (path: string) => pathname === path;
  const handleLogout = async () => { await logout(); toast.success('Logged out'); router.push('/'); };
  const navLinks = [
    { href: '/exercises', label: t.nav.exercises },
    { href: '/plans', label: t.nav.plans },
    { href: '/pricing', label: t.nav.pricing },
  ];
  const activeLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gym-border bg-gym-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Dumbbell className="w-7 h-7 text-neon-green group-hover:drop-shadow-[0_0_8px_#39FF14] transition-all" />
            <span className="text-xl font-bold tracking-tight">Gym<span className="text-neon-green">Buddy</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.href) ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gym-border bg-gym-card hover:border-neon-green/40 transition-all text-sm">
                <span>{activeLang.flag}</span>
                <span className="text-gray-300">{activeLang.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gym-border bg-gym-card shadow-xl overflow-hidden z-50">
                  {LANGUAGES.map((l) => (
                    <button key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); toast.success(`${l.name}`); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-all ${lang === l.code ? 'text-neon-green' : 'text-gray-300'}`}>
                      <span className="text-lg">{l.flag}</span>
                      <span>{l.name}</span>
                      {lang === l.code && <span className="ml-auto text-neon-green text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <>
                <Link href="/dashboard" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  <LayoutDashboard className="w-4 h-4" />{t.nav.dashboard}
                </Link>
                <div className="relative">
                  <button onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }} className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-all">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-gym-border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center border border-neon-green/30">
                        <User className="w-4 h-4 text-neon-green" />
                      </div>
                    )}
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gym-border bg-gym-card shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gym-border">
                        <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-all">
                        <User className="w-4 h-4" />{t.nav.profile}
                      </Link>
                      {userData?.isAdmin && (
                        <Link href="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-all">
                          <Settings className="w-4 h-4" />{t.nav.admin}
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-all">
                        <LogOut className="w-4 h-4" />{t.nav.logout}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">{t.nav.login}</Link>
                <Link href="/signup" className="btn-neon px-4 py-2 rounded-lg text-sm font-semibold">{t.nav.signup}</Link>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-gym-border bg-gym-dark">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">{link.label}</Link>
            ))}
            {user && <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">{t.nav.dashboard}</Link>}
            {!user && <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">{t.nav.login}</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}
