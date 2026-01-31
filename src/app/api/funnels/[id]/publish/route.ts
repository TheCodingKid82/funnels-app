import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/funnels/[id]/publish
 * Publish the current draft as a new version
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('whop_user');
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whopUser = JSON.parse(userCookie.value);
    const body = await request.json().catch(() => ({}));
    const { note } = body;

    const user = await db.user.findUnique({
      where: { whopUserId: whopUser.sub },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get funnel with current draft
    const funnel = await db.funnel.findFirst({
      where: { id, userId: user.id },
    });

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
    }

    if (!funnel.draftState) {
      return NextResponse.json({ error: 'No draft to publish' }, { status: 400 });
    }

    // Get next version number
    const lastVersion = await db.funnelVersion.findFirst({
      where: { funnelId: id },
      orderBy: { version: 'desc' },
    });

    const nextVersion = (lastVersion?.version ?? 0) + 1;

    // Create version and update funnel in transaction
    const [version, updatedFunnel] = await db.$transaction([
      db.funnelVersion.create({
        data: {
          funnelId: id,
          version: nextVersion,
          craftState: funnel.draftState,
          publishedBy: user.id,
          note,
        },
      }),
      db.funnel.update({
        where: { id },
        data: {
          published: true,
          publishedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      funnel: updatedFunnel,
      version: {
        id: version.id,
        version: version.version,
        note: version.note,
        createdAt: version.createdAt,
      },
    });
  } catch (error) {
    console.error('Error publishing funnel:', error);
    return NextResponse.json({ error: 'Failed to publish funnel' }, { status: 500 });
  }
}
