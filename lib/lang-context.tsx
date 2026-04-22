'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'ur' | 'ja';

const translations = {
  en: {
    nav: { home: 'Home', exercises: 'Exercises', plans: 'Plans', dashboard: 'Dashboard', profile: 'Profile', pricing: 'Pricing', login: 'Login', signup: 'Get Started', logout: 'Logout', admin: 'Admin' },
    hero: { badge: "Pakistan's #1 Gym App", title: 'Train Smarter.', titleAccent: 'Get Stronger.', subtitle: 'Your AI-powered gym companion. Video guides, workout plans, and multilingual support — all in your pocket.', cta: 'Start Free Trial', ctaSub: '7 Days Free • No Credit Card Required' },
    exercises: { title: 'Exercise Library', subtitle: 'Master every movement with HD video guidance', search: 'Search exercises...', all: 'All', save: 'Save', saved: 'Saved', watchVideo: 'Watch Video', instructions: 'Instructions' },
    plans: { title: 'Workout Plans', subtitle: 'Expert-designed programs for every goal', startPlan: 'Start This Plan', exercises: 'exercises' },
    pricing: { title: 'Simple Pricing', subtitle: 'One plan. Everything included.', trial: '7-Day Free Trial', monthly: 'PKR 3,000', monthlyPer: 'per month', cta: 'Start Free Trial', cancel: 'Cancel anytime' },
    dashboard: { title: 'Your Dashboard', greeting: 'Good morning', streak: 'Day Streak', todayWorkout: "Today's Workout", totalWorkouts: 'Total Workouts', calories: 'Calories Burned', favorites: 'Saved Exercises', startWorkout: 'Start Workout', upgrade: 'Upgrade Now' },
    profile: { title: 'My Profile', editProfile: 'Edit Profile', height: 'Height (cm)', weight: 'Weight (kg)', age: 'Age', goal: 'Fitness Goal', save: 'Save Changes', subscription: 'Subscription', manageSub: 'Manage Subscription' },
    auth: { loginTitle: 'Welcome Back', loginSub: 'Login to continue your fitness journey', signupTitle: 'Join GymBuddy', signupSub: 'Start your 7-day free trial today', googleLogin: 'Continue with Google', phoneLogin: 'Continue with Phone', noAccount: "Don't have an account?", hasAccount: 'Already have an account?', signupLink: 'Sign up', loginLink: 'Login' },
    footer: { tagline: 'Your digital gym trainer', rights: 'All rights reserved' },
  },
  ur: {
    nav: { home: 'ہوم', exercises: 'ورزشیں', plans: 'پلانز', dashboard: 'ڈیش بورڈ', profile: 'پروفائل', pricing: 'قیمت', login: 'لاگ ان', signup: 'شروع کریں', logout: 'لاگ آؤٹ', admin: 'ایڈمن' },
    hero: { badge: 'پاکستان کی نمبر 1 جم ایپ', title: 'سمارٹ ٹرین کریں۔', titleAccent: 'مضبوط بنیں۔', subtitle: 'آپ کا AI پاور جم ساتھی۔ ویڈیو گائیڈز، ورک آؤٹ پلانز — سب آپ کی جیب میں۔', cta: 'مفت ٹرائل شروع کریں', ctaSub: '7 دن مفت • کریڈٹ کارڈ ضرورت نہیں' },
    exercises: { title: 'ورزش لائبریری', subtitle: 'ویڈیو گائیڈنس کے ساتھ ہر حرکت میں مہارت حاصل کریں', search: 'ورزشیں تلاش کریں...', all: 'سب', save: 'محفوظ کریں', saved: 'محفوظ', watchVideo: 'ویڈیو دیکھیں', instructions: 'ہدایات' },
    plans: { title: 'ورک آؤٹ پلانز', subtitle: 'ہر مقصد کے لیے ماہرانہ پروگرام', startPlan: 'یہ پلان شروع کریں', exercises: 'ورزشیں' },
    pricing: { title: 'سادہ قیمت', subtitle: 'ایک پلان۔ سب کچھ شامل۔', trial: '7 دن مفت ٹرائل', monthly: 'PKR 3,000', monthlyPer: 'فی مہینہ', cta: 'مفت ٹرائل شروع کریں', cancel: 'کسی بھی وقت منسوخ کریں' },
    dashboard: { title: 'آپ کا ڈیش بورڈ', greeting: 'صبح بخیر', streak: 'دن کی اسٹریک', todayWorkout: 'آج کی ورزش', totalWorkouts: 'کل ورزشیں', calories: 'کیلوریز جلائیں', favorites: 'محفوظ ورزشیں', startWorkout: 'ورزش شروع کریں', upgrade: 'ابھی اپگریڈ کریں' },
    profile: { title: 'میری پروفائل', editProfile: 'پروفائل ترمیم کریں', height: 'قد (سینٹی میٹر)', weight: 'وزن (کلو گرام)', age: 'عمر', goal: 'فٹنس مقصد', save: 'تبدیلیاں محفوظ کریں', subscription: 'سبسکرپشن', manageSub: 'سبسکرپشن منظم کریں' },
    auth: { loginTitle: 'واپس خوش آمدید', loginSub: 'اپنا فٹنس سفر جاری رکھنے کے لیے لاگ ان کریں', signupTitle: 'جم بڈی میں شامل ہوں', signupSub: 'آج اپنا 7 دن مفت ٹرائل شروع کریں', googleLogin: 'گوگل سے جاری رکھیں', phoneLogin: 'فون سے جاری رکھیں', noAccount: 'اکاؤنٹ نہیں ہے؟', hasAccount: 'پہلے سے اکاؤنٹ ہے؟', signupLink: 'سائن اپ', loginLink: 'لاگ ان' },
    footer: { tagline: 'آپ کا ڈیجیٹل جم ٹرینر', rights: 'تمام حقوق محفوظ ہیں' },
  },
  ja: {
    nav: { home: 'ホーム', exercises: 'エクササイズ', plans: 'プラン', dashboard: 'ダッシュボード', profile: 'プロフィール', pricing: '料金', login: 'ログイン', signup: '始める', logout: 'ログアウト', admin: '管理者' },
    hero: { badge: 'パキスタン No.1 ジムアプリ', title: 'スマートにトレーニング。', titleAccent: 'より強くなろう。', subtitle: 'AIパワードジムコンパニオン。動画ガイド、ワークアウトプラン — すべてポケットに。', cta: '無料トライアル開始', ctaSub: '7日間無料・クレジットカード不要' },
    exercises: { title: 'エクササイズライブラリ', subtitle: '動画ガイダンスですべての動きをマスター', search: 'エクササイズを検索...', all: 'すべて', save: '保存', saved: '保存済み', watchVideo: '動画を見る', instructions: '説明' },
    plans: { title: 'ワークアウトプラン', subtitle: 'あらゆる目標のための専門家設計プログラム', startPlan: 'このプランを始める', exercises: 'エクササイズ' },
    pricing: { title: 'シンプルな料金', subtitle: '1プラン。すべて含む。', trial: '7日間無料トライアル', monthly: 'PKR 3,000', monthlyPer: '月額', cta: '無料トライアル開始', cancel: 'いつでもキャンセル可能' },
    dashboard: { title: 'ダッシュボード', greeting: 'おはようございます', streak: '日連続', todayWorkout: '今日のワークアウト', totalWorkouts: '合計ワークアウト', calories: '消費カロリー', favorites: '保存済みエクササイズ', startWorkout: 'ワークアウト開始', upgrade: '今すぐアップグレード' },
    profile: { title: 'マイプロフィール', editProfile: 'プロフィール編集', height: '身長 (cm)', weight: '体重 (kg)', age: '年齢', goal: 'フィットネス目標', save: '変更を保存', subscription: 'サブスクリプション', manageSub: 'サブスクリプション管理' },
    auth: { loginTitle: 'おかえりなさい', loginSub: 'フィットネスの旅を続けるためにログイン', signupTitle: 'Gym Buddyに参加', signupSub: '今日7日間の無料トライアルを始めよう', googleLogin: 'Googleで続ける', phoneLogin: '電話番号で続ける', noAccount: 'アカウントをお持ちでない方は？', hasAccount: 'すでにアカウントをお持ちの方は？', signupLink: 'サインアップ', loginLink: 'ログイン' },
    footer: { tagline: 'あなたのデジタルジムトレーナー', rights: '全著作権所有' },
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.en;
  dir: 'ltr' | 'rtl';
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
  dir: 'ltr',
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];
  const dir = lang === 'ur' ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
