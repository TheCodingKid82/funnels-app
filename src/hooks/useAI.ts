'use client';

import { useState, useCallback } from 'react';
import type { Tone, BlockType } from '@/lib/ai';

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

interface GenerateResult {
  content: Record<string, any>;
  blockType: BlockType;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Improve existing copy with a specific tone
   */
  const improveCopy = useCallback(async (
    text: string,
    tone: Tone,
    context?: ProductContext
  ): Promise<ImproveResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone, context }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to improve copy');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate block content from scratch
   */
  const generateBlock = useCallback(async (
    blockType: BlockType,
    context: ProductContext
  ): Promise<GenerateResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockType, context }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate content');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate complete funnel from product context
   */
  const generateFunnel = useCallback(async (
    context: ProductContext
  ): Promise<Record<string, Record<string, any>> | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, generateAll: true }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate funnel');
      }

      const data = await response.json();
      return data.blocks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    improveCopy,
    generateBlock,
    generateFunnel,
  };
}
