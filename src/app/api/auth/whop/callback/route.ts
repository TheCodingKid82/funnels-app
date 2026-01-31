import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getUserInfo } from '@/lib/whop';
import { cookies } from 'next/headers';

/**
 * GET /api/auth/whop/callback
 * Handles OAuth callback from Whop
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    if (error) {
      const errorDesc = searchParams.get('error_description') || error;
      return NextResponse.redirect(new URL(`/auth/error?message=${encodeURIComponent(errorDesc)}`, request.url));
    }
    
    if (!code) {
      return NextResponse.redirect(new URL('/auth/error?message=No%20authorization%20code', request.url));
    }
    
    // Retrieve PKCE values from cookie
    const cookieStore = await cookies();
    const pkceCookie = cookieStore.get('whop_pkce');
    
    if (!pkceCookie) {
      return NextResponse.redirect(new URL('/auth/error?message=Session%20expired', request.url));
    }
    
    const pkce = JSON.parse(pkceCookie.value);
    
    // Validate state
    if (state !== pkce.state) {
      return NextResponse.redirect(new URL('/auth/error?message=Invalid%20state', request.url));
    }
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, pkce.codeVerifier);
    
    // Get user info
    const userInfo = await getUserInfo(tokens.access_token);
    
    // Store tokens securely (in production, use a database + encrypted session)
    cookieStore.set('whop_tokens', JSON.stringify({
      ...tokens,
      obtained_at: Date.now(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    cookieStore.set('whop_user', JSON.stringify(userInfo), {
      httpOnly: false, // Allow client access for UI
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
    
    // Clear PKCE cookie
    cookieStore.delete('whop_pkce');
    
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error?message=Authentication%20failed', request.url));
  }
}
