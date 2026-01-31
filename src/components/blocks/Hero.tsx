'use client';

import { useNode } from '@craftjs/core';
import { useState } from 'react';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  backgroundStyle: 'gradient' | 'solid' | 'image';
  backgroundColor: string;
}

export const Hero = ({
  headline = 'Transform Your Business Today',
  subheadline = 'The all-in-one platform to grow your audience and revenue',
  ctaText = 'Get Started',
  ctaUrl = '#',
  backgroundStyle = 'gradient',
  backgroundColor = '#6366f1',
}: Partial<HeroProps>) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const bgClass = backgroundStyle === 'gradient' 
    ? 'bg-gradient-to-br from-indigo-600 to-purple-700'
    : '';

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`relative py-24 px-6 ${bgClass} ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={backgroundStyle === 'solid' ? { backgroundColor } : undefined}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          {headline}
        </h1>
        <p className="text-xl text-white/80 mb-8">
          {subheadline}
        </p>
        <a
          href={ctaUrl}
          className="inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

// Craft.js settings panel
const HeroSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Headline</label>
        <input
          type="text"
          value={props.headline || ''}
          onChange={(e) => setProp((props: HeroProps) => (props.headline = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheadline</label>
        <textarea
          value={props.subheadline || ''}
          onChange={(e) => setProp((props: HeroProps) => (props.subheadline = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">CTA Text</label>
        <input
          type="text"
          value={props.ctaText || ''}
          onChange={(e) => setProp((props: HeroProps) => (props.ctaText = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">CTA URL (Whop checkout link)</label>
        <input
          type="text"
          value={props.ctaUrl || ''}
          onChange={(e) => setProp((props: HeroProps) => (props.ctaUrl = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="https://whop.com/checkout/..."
        />
      </div>
    </div>
  );
};

Hero.craft = {
  displayName: 'Hero',
  props: {
    headline: 'Transform Your Business Today',
    subheadline: 'The all-in-one platform to grow your audience and revenue',
    ctaText: 'Get Started',
    ctaUrl: '#',
    backgroundStyle: 'gradient',
    backgroundColor: '#6366f1',
  },
  related: {
    settings: HeroSettings,
  },
};
