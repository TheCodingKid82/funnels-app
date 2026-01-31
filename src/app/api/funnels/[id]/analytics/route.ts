import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/funnels/[id]/analytics
 * Get analytics data for a funnel
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('whop_user');
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whopUser = JSON.parse(userCookie.value);
    
    const user = await db.user.findUnique({
      where: { whopUserId: whopUser.sub },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify ownership
    const funnel = await db.funnel.findFirst({
      where: { id, userId: user.id },
    });

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
    }

    // Get query params for date range
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate stats
    const [views, clicks, conversions, recentEvents] = await Promise.all([
      db.analyticsEvent.count({
        where: {
          funnelId: id,
          eventType: 'view',
          createdAt: { gte: startDate },
        },
      }),
      db.analyticsEvent.count({
        where: {
          funnelId: id,
          eventType: 'click',
          createdAt: { gte: startDate },
        },
      }),
      db.analyticsEvent.count({
        where: {
          funnelId: id,
          eventType: 'conversion',
          createdAt: { gte: startDate },
        },
      }),
      db.analyticsEvent.findMany({
        where: {
          funnelId: id,
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          eventType: true,
          metadata: true,
          createdAt: true,
          ipCountry: true,
          referrer: true,
        },
      }),
    ]);

    // Calculate conversion rate
    const conversionRate = views > 0 ? ((conversions / views) * 100).toFixed(2) : '0.00';
    const clickRate = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00';

    // Group by day for chart
    const dailyStats = await db.analyticsEvent.groupBy({
      by: ['eventType'],
      where: {
        funnelId: id,
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    return NextResponse.json({
      summary: {
        views,
        clicks,
        conversions,
        conversionRate: parseFloat(conversionRate),
        clickRate: parseFloat(clickRate),
      },
      dailyStats,
      recentEvents,
      period: { days, startDate: startDate.toISOString() },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
