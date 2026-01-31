'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions {
  funnelId: string;
  debounceMs?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Auto-save hook for funnel draft state
 * Debounces saves to avoid excessive API calls
 */
export function useAutoSave({
  funnelId,
  debounceMs = 30000, // 30 seconds default
  onSave,
  onError,
}: UseAutoSaveOptions) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<string | null>(null);

  /**
   * Save draft state to the server
   */
  const saveDraft = useCallback(async (draftState: string) => {
    setSaving(true);
    
    try {
      const response = await fetch(`/api/funnels/${funnelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftState: JSON.parse(draftState) }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onSave?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Save failed'));
    } finally {
      setSaving(false);
    }
  }, [funnelId, onSave, onError]);

  /**
   * Queue a save with debouncing
   */
  const queueSave = useCallback((draftState: string) => {
    pendingStateRef.current = draftState;
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (pendingStateRef.current) {
        saveDraft(pendingStateRef.current);
        pendingStateRef.current = null;
      }
    }, debounceMs);
  }, [debounceMs, saveDraft]);

  /**
   * Force immediate save (e.g., before navigation)
   */
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (pendingStateRef.current) {
      await saveDraft(pendingStateRef.current);
      pendingStateRef.current = null;
    }
  }, [saveDraft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Warn user about unsaved changes on navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    saving,
    lastSaved,
    hasUnsavedChanges,
    queueSave,
    saveNow,
  };
}
