import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, lat, lng } = await req.json();

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress || '';
    const name = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Anonymous';

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        role,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      },
      create: {
        clerkId: userId,
        email,
        name,
        role,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      },
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error('Error in /api/users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    return NextResponse.json(dbUser || null);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
