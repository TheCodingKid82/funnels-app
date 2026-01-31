import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET || '';

/**
 * POST /api/webhooks/whop
 * Handles Whop webhooks for conversion tracking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Validate webhook signature (Standard Webhooks spec)
    const signature = request.headers.get('webhook-signature');
    const timestamp = request.headers.get('webhook-timestamp');
    const webhookId = request.headers.get('webhook-id');
    
    if (!signature || !timestamp || !webhookId) {
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
    }
    
    // Verify signature
    const signedContent = `${webhookId}.${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(signedContent)
      .digest('base64');
    
    // Compare signatures (timing-safe)
    const sigParts = signature.split(',');
    const isValid = sigParts.some(sig => {
      const [version, hash] = sig.split(',');
      return crypto.timingSafeEqual(
        Buffer.from(hash || ''),
        Buffer.from(expectedSignature)
      );
    });
    
    if (!isValid && WEBHOOK_SECRET) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const event = JSON.parse(body);
    
    // Handle different event types
    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;
        
      case 'membership.activated':
        await handleMembershipActivated(event.data);
        break;
        
      case 'membership.deactivated':
        await handleMembershipDeactivated(event.data);
        break;
        
      default:
        console.log('Unhandled webhook event:', event.type);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

/**
 * Handle successful payment - track conversion
 */
async function handlePaymentSucceeded(data: any) {
  console.log('💰 Payment succeeded:', {
    paymentId: data.id,
    productId: data.product?.id,
    planId: data.plan?.id,
    userId: data.user?.id,
    amount: data.total,
    currency: data.currency,
  });
  
  // TODO: Match to funnel and increment conversion count
  // - Look up funnel by product_id or plan_id
  // - Increment funnel.analytics.conversions
  // - Store conversion record for detailed analytics
}

/**
 * Handle membership activation
 */
async function handleMembershipActivated(data: any) {
  console.log('🎉 Membership activated:', {
    membershipId: data.id,
    productId: data.product?.id,
    userId: data.user?.id,
  });
  
  // TODO: Track for engagement analytics
}

/**
 * Handle membership deactivation
 */
async function handleMembershipDeactivated(data: any) {
  console.log('👋 Membership deactivated:', {
    membershipId: data.id,
    productId: data.product?.id,
    userId: data.user?.id,
  });
  
  // TODO: Track for churn analytics
}
