import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getDistanceFromLatLonInKm } from '@/lib/haversine';
import { sendMatchEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const donor = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!donor || donor.role !== 'DONOR') {
      return NextResponse.json({ error: 'Only donors can create listings' }, { status: 403 });
    }

    const { title, description, lat, lng, expiresAt } = await req.json();

    const donation = await prisma.donation.create({
      data: {
        title,
        description,
        lat: lat ?? donor.lat,
        lng: lng ?? donor.lng,
        donorId: userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    // Auto-match: Find Receivers within 5km and create Notifications
    if (donation.lat && donation.lng) {
      const receivers = await prisma.user.findMany({ where: { role: 'RECEIVER' } });
      const matches = receivers.filter(r => {
        if (!r.lat || !r.lng) return false;
        const dist = getDistanceFromLatLonInKm(donation.lat, donation.lng, r.lat, r.lng);
        return dist <= 5;
      });

      if (matches.length > 0) {
        // Create in-app notifications
        await prisma.notification.createMany({
          data: matches.map(match => ({
            userId: match.clerkId,
            message: `New food available nearby! ${donor.name || 'A local restaurant'} just listed: ${title}`,
            type: 'MATCH',
          }))
        });

        // Fire match email alerts in parallel (non-blocking)
        matches.forEach(match => {
          if (match.email) {
            sendMatchEmail(match.email, match.name || '', donor.name || '', title).catch(console.error);
          }
        });
      }
    }

    return NextResponse.json(donation);
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Donors just see all their own donations
    if (user.role === 'DONOR') {
      const myDonations = await prisma.donation.findMany({
        where: { donorId: userId },
        include: { claimer: true },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(myDonations);
    }

    // ---- RECEIVER FLOW ----
    const activeDonations = await prisma.donation.findMany({
      where: { 
        status: 'AVAILABLE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: { donor: true }
    });

    // Filter by 5km only if the user has a saved location. Otherwise show all.
    let nearby: typeof activeDonations;
    if (user.lat && user.lng) {
      nearby = activeDonations.filter(d => {
        const dist = getDistanceFromLatLonInKm(user.lat!, user.lng!, d.lat, d.lng);
        return dist <= 5;
      });
    } else {
      // No location saved yet → show all available donations so user sees something
      nearby = activeDonations;
    }

    // Also fetch this receiver's own claimed / completed items (so they can see PIN / rate)
    const myClaims = await prisma.donation.findMany({
      where: { claimerId: userId },
      include: { donor: true }
    });

    // Merge and deduplicate (a claimed item might already be in `nearby`)
    const claimedIds = new Set(myClaims.map(d => d.id));
    const allItems = [...nearby.filter(d => !claimedIds.has(d.id)), ...myClaims];

    // Attach Trust Scores — wrapped in try/catch so a missing Prisma field never crashes the whole route
    const donorIds = [...new Set(allItems.map(d => d.donorId))];
    let ratingsMap: Record<string, { avg: number; count: number }> = {};
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
        console.warn('Trust score computation skipped (Prisma client needs regeneration):', ratingErr);
        // ratingsMap stays empty — all donors will show { avg: 0, count: 0 }
      }
    }

    const processedItems = allItems.map(d => ({
      ...d,
      donor: {
        ...d.donor,
        trustScore: ratingsMap[d.donorId] || { avg: 0, count: 0 }
      }
    }));

    return NextResponse.json(processedItems);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

