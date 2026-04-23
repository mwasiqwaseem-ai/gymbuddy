import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  try {
    const Stripe = (await import('stripe')).default;
    const { initializeApp, getApps } = await import('firebase/app');
    const { getFirestore, doc, updateDoc, collection, query, where, getDocs } = await import('firebase/firestore');

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' as any });

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const customerId = session.customer;
        if (userId) {
          const subEnd = new Date();
          subEnd.setMonth(subEnd.getMonth() + 1);
          await updateDoc(doc(db, 'users', userId), { subscriptionStatus: 'active', stripeCustomerId: customerId, subscriptionEndDate: subEnd });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const q = query(collection(db, 'users'), where('stripeCustomerId', '==', invoice.customer));
        const snap = await getDocs(q);
        snap.forEach(async (d) => {
          const subEnd = new Date();
          subEnd.setMonth(subEnd.getMonth() + 1);
          await updateDoc(doc(db, 'users', d.id), { subscriptionStatus: 'active', subscriptionEndDate: subEnd });
        });
        break;
      }
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object;
        const q = query(collection(db, 'users'), where('stripeCustomerId', '==', obj.customer));
        const snap = await getDocs(q);
        snap.forEach(async (d) => { await updateDoc(doc(db, 'users', d.id), { subscriptionStatus: 'expired' }); });
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
