import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import { LangProvider } from '@/lib/lang-context';
import Navbar from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Gym Buddy — Pakistan\'s #1 Smart Gym App',
  description: 'Video-guided workouts, multilingual support, and personalized plans. Train smarter with Gym Buddy.',
  keywords: ['gym', 'workout', 'fitness', 'pakistan', 'urdu', 'exercise', 'training'],
  openGraph: {
    title: 'Gym Buddy — Train Smarter. Get Stronger.',
    description: 'Your AI-powered gym companion with video guides and multilingual support.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body bg-gym-black text-white min-h-screen`}>
        <AuthProvider>
          <LangProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid #2A2A2A',
              },
              success: { iconTheme: { primary: '#39FF14', secondary: '#000' } },
              error: { iconTheme: { primary: '#FF4444', secondary: '#fff' } },
            }}
          />
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
