import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  req: Request, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Missing donation ID in route' }, { status: 400 });

    const body = await req.json();
    const { rating, feedback } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'A valid rating between 1 and 5 is required' }, { status: 400 });
    }

    const donation = await prisma.donation.findUnique({ where: { id: String(id) } });
    if (!donation) return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    
    // Only the claimer can rate the donation
    if (donation.claimerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Only the receiver can leave a rating' }, { status: 403 });
    }

    if (donation.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'You can only rate completed donations' }, { status: 400 });
    }

    // @ts-ignore - rating field added via migration, client cache may lag
    if ((donation as any).rating) {
      return NextResponse.json({ error: 'You have already rated this donation' }, { status: 400 });
    }

    const updated = await (prisma.donation.update as any)({
      where: { id: String(id) },
      data: {
        rating: Math.round(Number(rating)),
        feedback: feedback ? String(feedback).trim() : null
      }
    });

    // Notify the donor internally
    try {
      await prisma.notification.create({
        data: {
          userId: donation.donorId,
          message: `Someone just left you a ${rating}-star rating! Thank you for being an amazing donor.`,
          type: 'SYSTEM',
        }
      });
    } catch (e) {
      console.error('Failed to create rating notification:', e);
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Rating error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
