/**
 * Whop OAuth & API Integration
 * 
 * Based on Whop API docs: https://docs.whop.com
 */

const WHOP_API_BASE = 'https://api.whop.com/api/v1';
const WHOP_OAUTH_BASE = 'https://api.whop.com/oauth';

// Environment variables (set in .env.local)
const CLIENT_ID = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID || '';
const CLIENT_SECRET = process.env.WHOP_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_WHOP_REDIRECT_URI || 'http://localhost:3000/api/auth/whop/callback';

/**
 * Generate PKCE code verifier and challenge
 */
function generatePKCE() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = base64url(array);
  
  return {
    codeVerifier,
    state: base64url(crypto.getRandomValues(new Uint8Array(16))),
    nonce: base64url(crypto.getRandomValues(new Uint8Array(16))),
  };
}

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64url(new Uint8Array(hash));
}

/**
 * Start OAuth flow - returns URL to redirect user to
 */
export async function getWhopAuthUrl(companyId?: string): Promise<{ url: string; pkce: { codeVerifier: string; state: string; nonce: string } }> {
  const pkce = generatePKCE();
  const codeChallenge = await sha256(pkce.codeVerifier);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'openid profile email',
    state: pkce.state,
    nonce: pkce.nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  
  if (companyId) {
    params.set('company_id', companyId);
  }
  
  return {
    url: `${WHOP_OAUTH_BASE}/authorize?${params}`,
    pkce,
  };
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string, codeVerifier: string) {
  const response = await fetch(`${WHOP_OAUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Token exchange failed');
  }
  
  return response.json();
}

/**
 * Refresh access token
 */
export async function refreshTokens(refreshToken: string) {
  const response = await fetch(`${WHOP_OAUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  return response.json();
}

/**
 * Get user info
 */
export async function getUserInfo(accessToken: string) {
  const response = await fetch(`${WHOP_OAUTH_BASE}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  
  return response.json();
}

/**
 * Fetch user's products
 */
export async function getProducts(accessToken: string) {
  const response = await fetch(`${WHOP_API_BASE}/products`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

/**
 * Fetch plans for a product (includes purchase_url!)
 */
export async function getPlans(accessToken: string, productId?: string) {
  const params = productId ? `?product_id=${productId}` : '';
  const response = await fetch(`${WHOP_API_BASE}/plans${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch plans');
  }
  
  return response.json();
}

/**
 * Types
 */
export interface WhopProduct {
  id: string;
  title: string;
  headline?: string;
  visibility: string;
  member_count: number;
  route: string;
  created_at: string;
}

export interface WhopPlan {
  id: string;
  title: string;
  description?: string;
  product: { id: string; title: string };
  purchase_url: string; // This is the checkout link!
  initial_price: number;
  renewal_price: number;
  currency: string;
  billing_period: number;
  plan_type: 'one_time' | 'renewal';
}

export interface WhopTokens {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
}
