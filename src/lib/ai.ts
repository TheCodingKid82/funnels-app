/**
 * AI Copywriting Integration
 * 
 * Features:
 * 1. Improve Mode - refine existing copy with different tones
 * 2. Generate from Scratch - create complete block content
 * 3. Smart Defaults - AI-powered block initialization
 */

import OpenAI from 'openai';

// Lazy-load OpenAI client to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Use GPT-4o-mini for speed and cost efficiency
const MODEL = 'gpt-4o-mini';

export type Tone = 'punchier' | 'urgent' | 'professional' | 'casual' | 'friendly';

export type BlockType = 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'cta';

interface ProductContext {
  name: string;
  description: string;
  targetAudience?: string;
  benefits?: string[];
}

interface ImproveResult {
  variations: string[];
  tone: Tone;
}

interface GenerateBlockResult {
  content: Record<string, any>;
  blockType: BlockType;
}

// System prompts tuned per block type
const BLOCK_PROMPTS: Record<BlockType, string> = {
  hero: `You are a conversion copywriter specializing in hero sections. 
Create compelling headlines and subheadlines that:
- Grab attention immediately
- Communicate the core value proposition
- Create urgency or curiosity
- Speak directly to the target audience's pain points`,

  features: `You are a product marketing expert. 
Create feature descriptions that:
- Focus on benefits, not just features
- Use concrete, specific language
- Include emotional hooks
- Are scannable and concise`,

  testimonials: `You are creating realistic, believable testimonials.
Create testimonials that:
- Sound authentic and specific
- Include concrete results or outcomes
- Vary in length and style
- Feel like real customer voices`,

  pricing: `You are a pricing page copywriter.
Create pricing copy that:
- Clearly communicates value at each tier
- Uses benefit-focused feature descriptions
- Creates natural upgrade paths
- Reduces purchase anxiety`,

  faq: `You are a customer support expert turned copywriter.
Create FAQ content that:
- Addresses real objections and concerns
- Builds trust and credibility
- Is clear and jargon-free
- Guides toward purchase`,

  cta: `You are a direct response copywriter.
Create CTA sections that:
- Create urgency without being pushy
- Reinforce the value proposition
- Reduce friction and anxiety
- Use action-oriented language`,
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  punchier: 'Make it shorter, more impactful, with stronger verbs and sharper language.',
  urgent: 'Add time-sensitivity and scarcity. Create FOMO without being sleazy.',
  professional: 'Use polished, business-appropriate language. Confident but not salesy.',
  casual: 'Make it conversational and relaxed. Like talking to a friend.',
  friendly: 'Warm, approachable, and encouraging. Supportive tone.',
};

/**
 * Improve existing copy with different tones
 */
export async function improveCopy(
  text: string,
  tone: Tone,
  context?: ProductContext
): Promise<ImproveResult> {
  const contextInfo = context
    ? `\n\nProduct context:\n- Name: ${context.name}\n- Description: ${context.description}`
    : '';

  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an expert copywriter. Your job is to improve marketing copy.
${TONE_INSTRUCTIONS[tone]}
Return exactly 3 variations, one per line. No numbering, no explanations.${contextInfo}`,
      },
      {
        role: 'user',
        content: `Improve this copy:\n\n"${text}"`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content || '';
  const variations = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 3);

  return { variations, tone };
}

/**
 * Generate complete block content from scratch
 */
export async function generateBlock(
  blockType: BlockType,
  context: ProductContext
): Promise<GenerateBlockResult> {
  const schemas: Record<BlockType, string> = {
    hero: `{
  "headline": "main headline (8-12 words)",
  "subheadline": "supporting text (15-25 words)",
  "ctaText": "button text (2-4 words)"
}`,
    features: `{
  "sectionTitle": "section heading",
  "features": [
    { "icon": "emoji", "title": "feature name", "description": "benefit-focused description (10-15 words)" },
    { "icon": "emoji", "title": "feature name", "description": "benefit-focused description (10-15 words)" },
    { "icon": "emoji", "title": "feature name", "description": "benefit-focused description (10-15 words)" },
    { "icon": "emoji", "title": "feature name", "description": "benefit-focused description (10-15 words)" }
  ]
}`,
    testimonials: `{
  "sectionTitle": "section heading",
  "testimonials": [
    { "quote": "realistic testimonial with specific results", "author": "Full Name", "role": "Role/Title", "avatar": "emoji" },
    { "quote": "realistic testimonial with specific results", "author": "Full Name", "role": "Role/Title", "avatar": "emoji" },
    { "quote": "realistic testimonial with specific results", "author": "Full Name", "role": "Role/Title", "avatar": "emoji" }
  ]
}`,
    pricing: `{
  "sectionTitle": "section heading"
}`,
    faq: `{
  "sectionTitle": "section heading",
  "items": [
    { "question": "common question", "answer": "helpful answer" },
    { "question": "common question", "answer": "helpful answer" },
    { "question": "common question", "answer": "helpful answer" },
    { "question": "common question", "answer": "helpful answer" }
  ]
}`,
    cta: `{
  "headline": "compelling call to action headline",
  "subheadline": "supporting urgency text",
  "buttonText": "action button text"
}`,
  };

  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `${BLOCK_PROMPTS[blockType]}

Product: ${context.name}
Description: ${context.description}
${context.targetAudience ? `Target Audience: ${context.targetAudience}` : ''}
${context.benefits ? `Key Benefits: ${context.benefits.join(', ')}` : ''}

Generate content for a ${blockType} block. Return ONLY valid JSON matching this schema:
${schemas[blockType]}`,
      },
      {
        role: 'user',
        content: `Generate ${blockType} block content for this product.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  
  try {
    const parsed = JSON.parse(content);
    return { content: parsed, blockType };
  } catch {
    throw new Error('Failed to parse AI response');
  }
}

/**
 * Generate smart defaults for a new block
 */
export async function generateSmartDefaults(
  blockType: BlockType,
  context?: ProductContext
): Promise<Record<string, any>> {
  if (!context) {
    // Return empty/placeholder defaults if no context
    return {};
  }

  const result = await generateBlock(blockType, context);
  return result.content;
}

/**
 * Generate a complete funnel from product context
 */
export async function generateCompleteFunnel(
  context: ProductContext
): Promise<Record<BlockType, Record<string, any>>> {
  const blocks: BlockType[] = ['hero', 'features', 'testimonials', 'faq', 'cta'];
  
  const results = await Promise.all(
    blocks.map((blockType) => generateBlock(blockType, context))
  );

  return results.reduce((acc, result) => {
    acc[result.blockType] = result.content;
    return acc;
  }, {} as Record<BlockType, Record<string, any>>);
}
