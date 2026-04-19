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
    const email = user?.emailAddresses?.[0]?.emailAddress || '';
    const name = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Anonymous';

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (dbUser) {
      dbUser = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          role,
          lat: lat != null ? Number(lat) : null,
          lng: lng != null ? Number(lng) : null,
        },
      });
    } else {
      const existingByEmail = email ? await prisma.user.findUnique({ where: { email } }) : null;
      if (existingByEmail) {
        dbUser = await prisma.user.update({
          where: { email },
          data: {
            clerkId: userId,
            role,
            lat: lat != null ? Number(lat) : null,
            lng: lng != null ? Number(lng) : null,
            name,
          },
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: email || userId,
            name,
            role,
            lat: lat != null ? Number(lat) : null,
            lng: lng != null ? Number(lng) : null,
          },
        });
      }
    }

    return NextResponse.json(dbUser);
  } catch (error: any) {
    console.error('Error in /api/users:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error), stack: error?.stack }, { status: 500 });
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
