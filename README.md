# GymBuddy 🏋️ — Pakistan's #1 Smart Gym App

A complete Next.js 15 web application with Firebase auth, Stripe payments, multilingual support (English/Urdu/Japanese), and 30+ real exercise videos.

---

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** — Dark gym theme with neon green
- **Firebase** — Auth (Google + Phone) + Firestore + Storage
- **Stripe** — Subscriptions, webhooks, customer portal
- **Framer Motion** — Animations
- **React Hot Toast** — Notifications

---

## Setup Guide (Step by Step)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Firebase Setup

1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new project called "gym-buddy"
3. Enable **Authentication** → Sign-in methods:
   - Google ✓
   - Phone ✓
4. Enable **Firestore Database** (Start in production mode)
5. Copy your Firebase config from Project Settings

### Step 3: Stripe Setup

1. Go to [stripe.com](https://stripe.com) → Create account
2. Dashboard → Products → Add product:
   - Name: **GymBuddy Premium**
   - Price: **PKR 3,000** / month (recurring)
3. Copy the **Price ID** (starts with `price_`)
4. Get your **Publishable key** and **Secret key**
5. Set up webhook:
   - Endpoint: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`

### Step 4: Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual keys.

### Step 5: Set Admin Email

In `.env.local`, set:
```
NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com
```

The first time you login with this email, you'll get admin access.

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add all environment variables in Vercel dashboard
5. Deploy!

After deploying, update `NEXT_PUBLIC_APP_URL` to your Vercel URL.

---

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Hero, features, pricing, testimonials |
| Login | `/login` | Google + Phone login |
| Signup | `/signup` | New account + 7-day trial |
| Dashboard | `/dashboard` | User stats, streak, today's workout |
| Exercises | `/exercises` | 30+ exercises with video modals |
| Plans | `/plans` | 4 workout programs |
| Pricing | `/pricing` | Stripe checkout |
| Profile | `/profile` | User settings + subscription |
| Admin | `/admin` | Full admin panel (admin only) |
| Success | `/success` | Payment confirmation |

---

## Admin Panel

Login with the email set in `NEXT_PUBLIC_ADMIN_EMAIL` to access `/admin`.

Features:
- User overview (total, active subs, revenue)
- Manage all users (activate/revoke subscription)
- View all exercises
- Add new exercises

---

## Project Structure

```
gymbuddy/
├── app/
│   ├── page.tsx           # Landing page
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── exercises/page.tsx
│   ├── plans/page.tsx
│   ├── pricing/page.tsx
│   ├── profile/page.tsx
│   ├── admin/page.tsx
│   ├── success/page.tsx
│   └── api/
│       ├── create-checkout/route.ts
│       ├── customer-portal/route.ts
│       └── webhook/route.ts
├── components/
│   └── layout/Navbar.tsx
├── lib/
│   ├── firebase.ts
│   ├── auth-context.tsx
│   └── exercises.ts      # 30 exercises with YouTube IDs
├── messages/
│   ├── en.json           # English
│   ├── ur.json           # Urdu
│   └── ja.json           # Japanese
├── .env.example
├── firestore.rules
└── tailwind.config.js
```

---

## Subscription Flow

1. User signs up → 7-day free trial starts automatically
2. Trial ends → content locked with upgrade prompt
3. User goes to `/pricing` → Stripe checkout
4. Payment success → webhook fires → Firestore updated → Premium activated
5. User can manage/cancel via Stripe Customer Portal

---

## Adding New Exercises

Edit `lib/exercises.ts` — add a new object following the same format. YouTube ID can be found in the video URL after `?v=`.

---

## Support

For any questions about setup, ask in chat!
