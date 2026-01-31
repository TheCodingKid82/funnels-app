'use client';

import { useEditor } from '@craftjs/core';

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state) => {
    const currentNodeId = state.events.selected.values().next().value;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId]?.data?.displayName || state.nodes[currentNodeId]?.data?.name,
        settings: state.nodes[currentNodeId]?.related?.settings,
        isDeletable: state.nodes[currentNodeId]?.data?.name !== 'Canvas',
      };
    }

    return { selected };
  });

  return (
    <div className="p-4">
      {selected ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {selected.name}
            </h3>
            {selected.isDeletable && (
              <button
                onClick={() => actions.delete(selected.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            )}
          </div>
          {selected.settings && <selected.settings />}
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">Click on a block to edit its settings</p>
        </div>
      )}
    </div>
  );
};
