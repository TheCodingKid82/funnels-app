'use client';

import { useEditor, Element } from '@craftjs/core';
import { Hero, Features, Testimonials, Pricing, FAQ, CTA } from '../blocks';

const blocks = [
  { name: 'Hero', icon: '🎯', component: Hero, description: 'Eye-catching header section' },
  { name: 'Features', icon: '✨', component: Features, description: 'Highlight key benefits' },
  { name: 'Testimonials', icon: '💬', component: Testimonials, description: 'Social proof section' },
  { name: 'Pricing', icon: '💰', component: Pricing, description: 'Pricing tiers display' },
  { name: 'FAQ', icon: '❓', component: FAQ, description: 'Common questions answered' },
  { name: 'CTA', icon: '🚀', component: CTA, description: 'Call-to-action section' },
];

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Drag Blocks
      </h3>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.name}
            ref={(ref) => {
              if (ref) {
                connectors.create(ref, <Element is={block.component} canvas />);
              }
            }}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-indigo-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">{block.icon}</span>
            <div>
              <p className="font-medium text-gray-900">{block.name}</p>
              <p className="text-xs text-gray-500">{block.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
