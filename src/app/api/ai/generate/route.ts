import { NextRequest, NextResponse } from 'next/server';
import { generateBlock, generateCompleteFunnel, BlockType } from '@/lib/ai';

/**
 * POST /api/ai/generate
 * Generate block content or complete funnel from scratch
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blockType, context, generateAll } = body;

    if (!context?.name || !context?.description) {
      return NextResponse.json(
        { error: 'Missing required context: name, description' },
        { status: 400 }
      );
    }

    // Generate complete funnel
    if (generateAll) {
      const result = await generateCompleteFunnel(context);
      return NextResponse.json({ blocks: result });
    }

    // Generate single block
    const validBlocks: BlockType[] = ['hero', 'features', 'testimonials', 'pricing', 'faq', 'cta'];
    if (!blockType || !validBlocks.includes(blockType)) {
      return NextResponse.json(
        { error: `Invalid blockType. Must be one of: ${validBlocks.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await generateBlock(blockType, context);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
