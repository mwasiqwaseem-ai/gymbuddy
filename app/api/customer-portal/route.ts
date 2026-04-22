import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-10-28.acacia' });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const stripeCustomerId = userSnap.data().stripeCustomerId;

    if (!stripeCustomerId) return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
