import { NextResponse } from 'next/server';
import { getWhopAuthUrl } from '@/lib/whop';
import { cookies } from 'next/headers';

/**
 * GET /api/auth/whop
 * Initiates Whop OAuth flow
 */
export async function GET() {
  try {
    const { url, pkce } = await getWhopAuthUrl();
    
    // Store PKCE values in a secure, httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('whop_pkce', JSON.stringify(pkce), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
    });
    
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('OAuth init error:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}
