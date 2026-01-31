'use client';

import { useState, useCallback } from 'react';

interface Funnel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  published: boolean;
  publishedAt?: string;
  draftState?: any;
  whopProductId?: string;
  whopProductName?: string;
  createdAt: string;
  updatedAt: string;
  versions?: Array<{
    id: string;
    version: number;
    note?: string;
    createdAt: string;
  }>;
  stats?: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

interface CreateFunnelInput {
  name: string;
  description?: string;
  whopProductId?: string;
  whopProductName?: string;
}

/**
 * Hook for funnel CRUD operations
 */
export function useFunnel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * List all user's funnels
   */
  const listFunnels = useCallback(async (): Promise<Funnel[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/funnels');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please connect your Whop account');
        }
        throw new Error('Failed to load funnels');
      }

      const data = await response.json();
      return data.funnels;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single funnel by ID
   */
  const getFunnel = useCallback(async (id: string): Promise<Funnel | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/funnels/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Funnel not found');
        }
        throw new Error('Failed to load funnel');
      }

      const data = await response.json();
      return data.funnel;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new funnel
   */
  const createFunnel = useCallback(async (input: CreateFunnelInput): Promise<Funnel | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/funnels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create funnel');
      }

      const data = await response.json();
      return data.funnel;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a funnel
   */
  const updateFunnel = useCallback(async (
    id: string,
    updates: Partial<Pick<Funnel, 'name' | 'description' | 'draftState'>>
  ): Promise<Funnel | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/funnels/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update funnel');
      }

      const data = await response.json();
      return data.funnel;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a funnel
   */
  const deleteFunnel = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/funnels/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete funnel');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Publish a funnel
   */
  const publishFunnel = useCallback(async (id: string, note?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/funnels/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to publish funnel');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    listFunnels,
    getFunnel,
    createFunnel,
    updateFunnel,
    deleteFunnel,
    publishFunnel,
  };
}
