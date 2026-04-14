import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { sendClaimEmail } from '@/lib/email';

export async function POST(
  req: Request, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Explicitly await params from context
    const params = await context.params;
    const id = params?.id;

    console.log('DEBUG: Claiming Donation ID:', id);

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing ID', 
        details: 'The donation ID was not found in route parameters.' 
      }, { status: 400 });
    }

    // 1. Check if user exists in our DB
    const receiver = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!receiver) {
      return NextResponse.json({ error: 'User profile not found in database.' }, { status: 404 });
    }

    // 2. Find the donation
    const donation = await prisma.donation.findUnique({ 
      where: { id }, 
      include: { donor: true } 
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found.' }, { status: 404 });
    }

    // 3. Security: Prevent self-claiming
    if (donation.donorId === userId) {
      return NextResponse.json({ error: 'You cannot claim your own donation!' }, { status: 400 });
    }

    // 4. Status Check
    if (donation.status !== 'AVAILABLE') {
      return NextResponse.json({ error: `This item is already ${donation.status.toLowerCase()}.` }, { status: 400 });
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    // 5. Atomic Update
    const updated = await prisma.donation.update({
      where: { id: String(id) },
      data: {
        status: 'CLAIMED',
        pickupPin: pin,
        claimer: {
          connect: { clerkId: userId }
        }
      }
    });

    // 6. Notifications
    try {
      await prisma.notification.create({
        data: {
          userId: donation.donorId,
          message: `Your donation "${donation.title}" was claimed by ${receiver.name || 'someone'}! They need your PIN to pick it up.`,
          type: 'SYSTEM',
        }
      });

      if (donation.donor?.email) {
        await sendClaimEmail(
          donation.donor.email, 
          donation.donor.name || 'Local Donor', 
          receiver.name || 'A local resident', 
          donation.title
        ).catch(e => console.error('Email failed:', e));
      }
    } catch (notifError) {
      console.error('Non-critical notification error:', notifError);
    }

    return NextResponse.json({ ...updated, pin });
  } catch (error: any) {
    console.error('Claim error details:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message || 'Unknown error',
      stack: error.stack
    }, { status: 500 });
  }
}
