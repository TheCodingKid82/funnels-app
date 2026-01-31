import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/funnels/[id]
 * Get a single funnel with its draft state
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

    const funnel = await db.funnel.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 5,
          select: {
            id: true,
            version: true,
            note: true,
            createdAt: true,
          },
        },
      },
    });

    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
    }

    return NextResponse.json({ funnel });
  } catch (error) {
    console.error('Error fetching funnel:', error);
    return NextResponse.json({ error: 'Failed to fetch funnel' }, { status: 500 });
  }
}

/**
 * PATCH /api/funnels/[id]
 * Update funnel (name, description, draft state)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('whop_user');
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whopUser = JSON.parse(userCookie.value);
    const body = await request.json();
    const { name, description, draftState } = body;

    const user = await db.user.findUnique({
      where: { whopUserId: whopUser.sub },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify ownership
    const existing = await db.funnel.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
    }

    const funnel = await db.funnel.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(draftState !== undefined && { draftState }),
      },
    });

    return NextResponse.json({ funnel });
  } catch (error) {
    console.error('Error updating funnel:', error);
    return NextResponse.json({ error: 'Failed to update funnel' }, { status: 500 });
  }
}

/**
 * DELETE /api/funnels/[id]
 * Delete a funnel
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const existing = await db.funnel.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
    }

    await db.funnel.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting funnel:', error);
    return NextResponse.json({ error: 'Failed to delete funnel' }, { status: 500 });
  }
}
