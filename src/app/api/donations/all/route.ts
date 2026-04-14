import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const donations = await prisma.donation.findMany({
      where: { 
        status: 'AVAILABLE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: { donor: { select: { id: true, name: true, clerkId: true } } },
      orderBy: { createdAt: 'desc' }
    });

    // Attach trust scores — safe try/catch prevents crashes if Prisma client is stale
    const donorIds = [...new Set(donations.map(d => d.donor.clerkId))].filter(Boolean) as string[];
    let ratingsMap: Record<string, { avg: string | number; count: number }> = {};
    if (donorIds.length > 0) {
      try {
        const ratingsData = await (prisma.donation.groupBy as any)({
          by: ['donorId'],
          where: { donorId: { in: donorIds }, rating: { not: null } },
          _avg: { rating: true },
          _count: { rating: true }
        });
        ratingsMap = ratingsData.reduce((acc: any, curr: any) => {
          acc[curr.donorId] = { avg: curr._avg.rating?.toFixed(1) || 0, count: curr._count.rating || 0 };
          return acc;
        }, {});
      } catch (ratingErr) {
        console.warn('Trust score skipped (Prisma client needs regeneration):', ratingErr);
      }
    }

    const processed = donations.map(d => ({
      ...d,
      donor: {
        ...d.donor,
        trustScore: ratingsMap[d.donor.clerkId] || { avg: 0, count: 0 }
      }
    }));

    return NextResponse.json(processed);
  } catch (error) {
    console.error('Error fetching all donations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
