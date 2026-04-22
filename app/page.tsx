'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Dumbbell, Play, Star, Check, Zap, Globe, Video, TrendingUp, Shield, ChevronRight, Users, Target, Flame } from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '30+', label: 'Exercises' },
  { value: '4', label: 'Expert Plans' },
  { value: '3', label: 'Languages' },
];

const features = [
  { icon: Video, title: 'HD Video Guides', desc: 'Crystal clear exercise demonstrations with proper form cues for every movement' },
  { icon: Globe, title: 'Multilingual', desc: 'Full support in English, Urdu اردو and Japanese 日本語' },
  { icon: Target, title: 'Workout Plans', desc: 'Expert-designed programs for beginners to advanced athletes' },
  { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track streaks, workouts and body measurements over time' },
  { icon: Flame, title: 'Daily Streaks', desc: 'Stay motivated with streak counters and achievement badges' },
  { icon: Shield, title: 'Affordable', desc: 'Just PKR 3,000/month — less than a single PT session' },
];

const testimonials = [
  { name: 'Ahmed Khan', location: 'Lahore', rating: 5, text: 'GymBuddy ne meri training completely badal di. Urdu mein guides sun ke bohot asaan ho gaya hai.' },
  { name: 'Fatima Ali', location: 'Karachi', rating: 5, text: 'Best investment for anyone serious about fitness. The video quality is amazing and instructions are crystal clear.' },
  { name: 'Hamza Sheikh', location: 'Islamabad', rating: 5, text: 'Personal trainer se bhi behtar app hai. Sab kuch detail mein samjhata hai. Highly recommend!' },
];

const pricingFeatures = [
  '30+ HD Exercise Videos',
  '4 Expert Workout Plans',
  'Progress & Streak Tracking',
  'English, Urdu & Japanese',
  'Personalized Dashboard',
  'New Content Monthly',
  'Cancel Anytime',
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-50" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full border border-neon-green/5 blur-sm" />
        <div className="absolute top-40 right-20 w-64 h-64 rounded-full border border-neon-green/10" />
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full border border-orange-500/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Pakistan's #1 Smart Gym App
            </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
              <span className="block text-white">Train Smarter.</span>
              <span className="block text-neon-green" style={{ textShadow: '0 0 40px rgba(57,255,20,0.3)' }}>
                Get Stronger.
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
              Your complete digital gym trainer. HD exercise videos, multilingual voice guidance,
              and expert workout plans — all for less than one PT session.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="/signup"
                className="btn-neon px-8 py-4 rounded-xl text-lg font-bold text-center flex items-center justify-center gap-2 group">
                Start Free Trial
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/exercises"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gym-border bg-gym-card hover:border-gray-600 text-white font-semibold transition-all group">
                <Play className="w-5 h-5 text-neon-green" />
                Browse Exercises
              </Link>
            </div>

            {/* Sub-text */}
            <p className="text-sm text-gray-600">
              ✓ 7 Days Free Trial &nbsp;&nbsp; ✓ No Credit Card Required &nbsp;&nbsp; ✓ Cancel Anytime
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 max-w-3xl">
            {stats.map((stat) => (
              <div key={stat.label} className="neon-card rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-neon-green mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Everything You Need to
              <span className="text-neon-green"> Dominate</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built specifically for Pakistani gym goers who want real results without spending a fortune
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="neon-card rounded-2xl p-6 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mb-4 group-hover:bg-neon-green/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gym-dark border-t border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-neon-green/50 to-neon-green/50" />

            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your account with Google or phone number. Get 7 days full access instantly.' },
              { step: '02', title: 'Choose Your Plan', desc: 'Pick a workout plan that matches your goals. Beginner to advanced options available.' },
              { step: '03', title: 'Train & Track', desc: 'Follow video guides, track your progress, and build your streak day by day.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 rounded-full border-2 border-neon-green bg-gym-black flex items-center justify-center mx-auto mb-6 text-neon-green font-black text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 border-t border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-lg">One plan. Everything included. No surprises.</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="neon-card rounded-3xl p-8 border border-neon-green/20 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-bold mb-6">
                <Flame className="w-3 h-3" /> MOST POPULAR
              </div>

              {/* Trial badge */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Start with</div>
                  <div className="text-2xl font-black text-neon-green">7 Days FREE</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Then only</div>
                  <div className="text-2xl font-black">PKR 3,000<span className="text-sm font-normal text-gray-500">/mo</span></div>
                </div>
              </div>

              <div className="h-px bg-gym-border mb-6" />

              <div className="space-y-3 mb-8">
                {pricingFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/signup" className="btn-neon w-full py-4 rounded-xl font-bold text-center block text-lg">
                Start Free Trial
              </Link>
              <p className="text-center text-xs text-gray-600 mt-3">No credit card required for trial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gym-dark border-t border-gym-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">What Members Say</h2>
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              <span className="text-gray-400 text-sm ml-2">4.9/5 from 500+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`neon-card rounded-2xl p-6 transition-all ${i === currentTestimonial ? 'border-neon-green/30 shadow-neon-green/10' : ''}`}>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 border-t border-gym-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-transparent to-orange-500/5" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Dumbbell className="w-16 h-16 text-neon-green mx-auto mb-6 drop-shadow-[0_0_20px_rgba(57,255,20,0.5)]" />
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Ready to Transform?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join 10,000+ members already training smarter with GymBuddy
          </p>
          <Link href="/signup" className="btn-neon px-10 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2">
            Start Your Free Trial <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-600 text-sm mt-4">7 days free • No credit card • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gym-border bg-gym-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-neon-green" />
              <span className="font-bold text-lg">Gym<span className="text-neon-green">Buddy</span></span>
              <span className="text-gray-600 text-sm ml-2">— Your digital gym trainer</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <p className="text-gray-600 text-sm">© 2025 GymBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
