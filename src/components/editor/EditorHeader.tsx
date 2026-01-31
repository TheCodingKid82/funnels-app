'use client';

import { useEditor } from '@craftjs/core';
import { useState } from 'react';

interface EditorHeaderProps {
  funnelName: string;
  onSave?: (json: string) => void;
}

export const EditorHeader = ({ funnelName, onSave }: EditorHeaderProps) => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));
  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const json = query.serialize();
    
    // TODO: Save to database
    console.log('Saving funnel:', json);
    onSave?.(json);
    
    setTimeout(() => setSaving(false), 500);
  };

  const handlePreview = () => {
    const json = query.serialize();
    // Open preview in new tab
    const previewWindow = window.open('/preview', '_blank');
    if (previewWindow) {
      previewWindow.sessionStorage.setItem('funnelPreview', json);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <a href="/dashboard" className="text-indigo-600 font-semibold">
          ← Back
        </a>
        <span className="text-gray-300">|</span>
        <h1 className="font-medium text-gray-900">{funnelName}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
          title="Undo"
        >
          ↩️
        </button>
        <button
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
          title="Redo"
        >
          ↪️
        </button>
        
        <span className="text-gray-300 mx-2">|</span>
        
        <button
          onClick={handlePreview}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Preview
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </header>
  );
};
