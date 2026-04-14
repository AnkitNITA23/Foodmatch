import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getDistanceFromLatLonInKm } from '@/lib/haversine';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = parseFloat(searchParams.get('radius') || '20'); // default 20km radius

    const users = await prisma.user.findMany({
      where: { role: 'DONOR' },
      select: {
        id: true,
        name: true,
        lat: true,
        lng: true,
        donations: {
          select: { id: true, status: true }
        }
      }
    });

    let filtered = users;

    // If lat/lng provided, filter to donors within the radius
    if (!isNaN(lat) && !isNaN(lng)) {
      filtered = users.filter(user => {
        if (!user.lat || !user.lng) return false;
        const dist = getDistanceFromLatLonInKm(lat, lng, user.lat, user.lng);
        return dist <= radius;
      });
    }

    const leaderboard = filtered.map(user => {
      const totalListings = user.donations.length;
      const completedListings = user.donations.filter(d => d.status === 'COMPLETED').length;
      const claimedListings = user.donations.filter(d => d.status === 'CLAIMED').length;
      const impactScore = (completedListings * 10) + (claimedListings * 5) + totalListings;

      return {
        id: user.id,
        name: user.name || 'Anonymous Donor',
        totalListings,
        completedListings,
        impactScore,
      };
    });

    leaderboard.sort((a, b) => b.impactScore - a.impactScore);

    return NextResponse.json({
      leaders: leaderboard.slice(0, 50),
      radius,
      isLocal: !isNaN(lat) && !isNaN(lng),
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
