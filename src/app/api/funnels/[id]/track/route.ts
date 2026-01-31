import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/funnels/[id]/track
 * Track analytics events (view, click, conversion)
 * This endpoint is public (for tracking from published funnels)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { eventType, metadata, visitorId, sessionId } = body;

    if (!eventType || !['view', 'click', 'conversion'].includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid eventType. Must be: view, click, or conversion' },
        { status: 400 }
      );
    }

    // Verify funnel exists and is published
    const funnel = await db.funnel.findUnique({
      where: { id },
      select: { id: true, published: true },
    });

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
    }

    // Get visitor info from headers
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;
    
    // Get country from Vercel/Cloudflare headers if available
    const ipCountry = 
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      undefined;

    // Create analytics event
    await db.analyticsEvent.create({
      data: {
        funnelId: id,
        eventType,
        metadata: metadata || undefined,
        visitorId,
        sessionId,
        userAgent,
        referrer,
        ipCountry,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
