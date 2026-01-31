import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

/**
 * GET /api/funnels
 * List all funnels for the authenticated user
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('whop_user');
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whopUser = JSON.parse(userCookie.value);
    
    // Find or create user
    const user = await db.user.upsert({
      where: { whopUserId: whopUser.sub },
      update: {
        email: whopUser.email,
        name: whopUser.name,
        username: whopUser.preferred_username,
        avatarUrl: whopUser.picture,
      },
      create: {
        whopUserId: whopUser.sub,
        email: whopUser.email,
        name: whopUser.name,
        username: whopUser.preferred_username,
        avatarUrl: whopUser.picture,
      },
    });

    const funnels = await db.funnel.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        published: true,
        publishedAt: true,
        whopProductName: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            analytics: {
              where: { eventType: 'view' },
            },
          },
        },
      },
    });

    // Get analytics summary for each funnel
    const funnelsWithStats = await Promise.all(
      funnels.map(async (funnel) => {
        const [views, clicks, conversions] = await Promise.all([
          db.analyticsEvent.count({
            where: { funnelId: funnel.id, eventType: 'view' },
          }),
          db.analyticsEvent.count({
            where: { funnelId: funnel.id, eventType: 'click' },
          }),
          db.analyticsEvent.count({
            where: { funnelId: funnel.id, eventType: 'conversion' },
          }),
        ]);

        return {
          ...funnel,
          stats: { views, clicks, conversions },
        };
      })
    );

    return NextResponse.json({ funnels: funnelsWithStats });
  } catch (error) {
    console.error('Error fetching funnels:', error);
    return NextResponse.json({ error: 'Failed to fetch funnels' }, { status: 500 });
  }
}

/**
 * POST /api/funnels
 * Create a new funnel
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('whop_user');
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whopUser = JSON.parse(userCookie.value);
    const body = await request.json();
    const { name, description, whopProductId, whopProductName } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Find or create user
    const user = await db.user.upsert({
      where: { whopUserId: whopUser.sub },
      update: {},
      create: {
        whopUserId: whopUser.sub,
        email: whopUser.email,
        name: whopUser.name,
        username: whopUser.preferred_username,
        avatarUrl: whopUser.picture,
      },
    });

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await db.funnel.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const funnel = await db.funnel.create({
      data: {
        userId: user.id,
        name,
        slug,
        description,
        whopProductId,
        whopProductName,
      },
    });

    return NextResponse.json({ funnel }, { status: 201 });
  } catch (error) {
    console.error('Error creating funnel:', error);
    return NextResponse.json({ error: 'Failed to create funnel' }, { status: 500 });
  }
}
