'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Funnel {
  id: string;
  name: string;
  productId?: string;
  views: number;
  clicks: number;
  conversions: number;
  updatedAt: string;
}

// Mock data for now
const mockFunnels: Funnel[] = [
  {
    id: '1',
    name: 'Course Launch Funnel',
    productId: 'prod_xxx',
    views: 1234,
    clicks: 456,
    conversions: 23,
    updatedAt: '2024-01-30',
  },
];

export default function DashboardPage() {
  const [funnels, setFunnels] = useState<Funnel[]>(mockFunnels);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from cookie
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('whop_user='));
    
    if (userCookie) {
      try {
        setUser(JSON.parse(decodeURIComponent(userCookie.split('=')[1])));
      } catch (e) {
        console.error('Failed to parse user cookie');
      }
    }
  }, []);

  const conversionRate = (funnel: Funnel) => {
    if (funnel.views === 0) return '0%';
    return ((funnel.conversions / funnel.views) * 100).toFixed(1) + '%';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Funnels App</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="text-gray-600">
                Welcome, {user.name || user.preferred_username || 'User'}
              </span>
            ) : (
              <Link
                href="/api/auth/whop"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Connect Whop
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Views" value="1,234" icon="👁️" />
          <StatCard title="Total Clicks" value="456" icon="👆" />
          <StatCard title="Conversions" value="23" icon="💰" />
          <StatCard title="Conversion Rate" value="1.9%" icon="📊" />
        </div>

        {/* Funnels List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Funnels</h2>
            <Link
              href="/editor"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + New Funnel
            </Link>
          </div>

          {funnels.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {funnels.map((funnel) => (
                <div
                  key={funnel.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{funnel.name}</h3>
                    <p className="text-sm text-gray-500">
                      Updated {funnel.updatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Views</p>
                      <p className="font-semibold">{funnel.views.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Conversions</p>
                      <p className="font-semibold">{funnel.conversions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Rate</p>
                      <p className="font-semibold text-green-600">{conversionRate(funnel)}</p>
                    </div>
                    <Link
                      href={`/editor?id=${funnel.id}`}
                      className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-md"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-4">No funnels yet. Create your first one!</p>
              <Link
                href="/editor"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Funnel
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
