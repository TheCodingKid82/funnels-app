import { NextRequest, NextResponse } from 'next/server';
import { improveCopy, Tone } from '@/lib/ai';

/**
 * POST /api/ai/improve
 * Improve existing copy with different tones
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, tone, context } = body;

    if (!text || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields: text, tone' },
        { status: 400 }
      );
    }

    const validTones: Tone[] = ['punchier', 'urgent', 'professional', 'casual', 'friendly'];
    if (!validTones.includes(tone)) {
      return NextResponse.json(
        { error: `Invalid tone. Must be one of: ${validTones.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await improveCopy(text, tone, context);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI improve error:', error);
    return NextResponse.json(
      { error: 'Failed to improve copy' },
      { status: 500 }
    );
  }
}
