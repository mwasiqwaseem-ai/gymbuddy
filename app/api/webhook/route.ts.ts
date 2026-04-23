import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.CheckoutSession;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        if (userId) {
          const subEnd = new Date();
          subEnd.setMonth(subEnd.getMonth() + 1);
          await updateDoc(doc(db, 'users', userId), {
            subscriptionStatus: 'active',
            stripeCustomerId: customerId,
            subscriptionEndDate: subEnd,
          });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const q = query(collection(db, 'users'), where('stripeCustomerId', '==', customerId));
        const snap = await getDocs(q);
        snap.forEach(async (docSnap) => {
          const subEnd = new Date();
          subEnd.setMonth(subEnd.getMonth() + 1);
          await updateDoc(doc(db, 'users', docSnap.id), {
            subscriptionStatus: 'active',
            subscriptionEndDate: subEnd,
          });
        });
        break;
      }
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object as any;
        const customerId = obj.customer as string;
        const q = query(collection(db, 'users'), where('stripeCustomerId', '==', customerId));
        const snap = await getDocs(q);
        snap.forEach(async (docSnap) => {
          await updateDoc(doc(db, 'users', docSnap.id), { subscriptionStatus: 'expired' });
        });
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
