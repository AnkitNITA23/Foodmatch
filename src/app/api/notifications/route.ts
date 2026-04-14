import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Delete old notifications asynchronously (housekeeping)
    prisma.notification.deleteMany({
      where: { userId, createdAt: { lt: twentyFourHoursAgo } }
    }).catch(console.error);

    const notifications = await prisma.notification.findMany({
      where: { 
        userId,
        createdAt: { gte: twentyFourHoursAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Mark all as read
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
