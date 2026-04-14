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

    if (!id) {
      return NextResponse.json({ error: 'Missing donation ID in route' }, { status: 400 });
    }

    const body = await req.json();
    const { pin } = body;

    if (!pin) return NextResponse.json({ error: 'PIN is required' }, { status: 400 });

    const donation = await prisma.donation.findUnique({ where: { id: String(id) } });
    if (!donation) return NextResponse.json({ error: 'Donation listing not found' }, { status: 404 });
    
    // Only the donor can verify the pickup
    if (donation.donorId !== userId) return NextResponse.json({ error: 'Unauthorized: Only the donor can verify' }, { status: 403 });
    if (donation.status !== 'CLAIMED') return NextResponse.json({ error: 'This item is not in the "CLAIMED" state' }, { status: 400 });

    // @ts-ignore: Prisma hot-reload gap
    if (donation.pickupPin !== pin) {
      return NextResponse.json({ error: 'Incorrect PIN provided' }, { status: 400 });
    }

    const updated = await prisma.donation.update({
      where: { id: String(id) },
      data: {
        status: 'COMPLETED',
        // @ts-ignore: Prisma hot-reload gap
        completedAt: new Date()
      }
    });

    // Notify receiver internally
    if (donation.claimerId) {
      try {
        await prisma.notification.create({
          data: {
            userId: donation.claimerId,
            message: `Your pickup of "${donation.title}" was successfully verified. Thank you for using FoodMatch!`,
            type: 'SYSTEM',
          }
        });
      } catch (e) {
        console.error('Failed to create notification:', e);
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
