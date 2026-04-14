import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalDonations = await prisma.donation.count();
    const successfulPickups = await prisma.donation.count({
      where: {
        OR: [
          { status: 'CLAIMED' },
          { status: 'COMPLETED' }
        ]
      }
    });

    // Let's assume an average food donation saves about 2.5 lbs of food 
    // from a landfill, which equates to roughly 6.5 lbs of CO2 emissions prevented.
    const lbsFoodSaved = successfulPickups * 2.5;
    const co2Offset = successfulPickups * 6.5;

    return NextResponse.json({
      totalDonations,
      successfulPickups,
      lbsFoodSaved,
      co2Offset
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
