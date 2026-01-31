'use client';

import { useNode } from '@craftjs/core';

interface CTAProps {
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonUrl: string;
  style: 'default' | 'urgent' | 'minimal';
}

export const CTA = ({
  headline = 'Ready to Get Started?',
  subheadline = 'Join thousands of creators already using Funnels App',
  buttonText = 'Start Building Now',
  buttonUrl = '#',
  style = 'default',
}: Partial<CTAProps>) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const styles = {
    default: 'bg-indigo-600',
    urgent: 'bg-gradient-to-r from-red-500 to-orange-500',
    minimal: 'bg-gray-900',
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`py-20 px-6 ${styles[style]} ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          {headline}
        </h2>
        <p className="text-xl text-white/80 mb-8">
          {subheadline}
        </p>
        <a
          href={buttonUrl}
          className="inline-block px-10 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

const CTASettings = () => {
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
          onChange={(e) => setProp((props: CTAProps) => (props.headline = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subheadline</label>
        <input
          type="text"
          value={props.subheadline || ''}
          onChange={(e) => setProp((props: CTAProps) => (props.subheadline = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={props.buttonText || ''}
          onChange={(e) => setProp((props: CTAProps) => (props.buttonText = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Button URL (Whop checkout link)</label>
        <input
          type="text"
          value={props.buttonUrl || ''}
          onChange={(e) => setProp((props: CTAProps) => (props.buttonUrl = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="https://whop.com/checkout/..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Style</label>
        <select
          value={props.style || 'default'}
          onChange={(e) => setProp((props: CTAProps) => (props.style = e.target.value as CTAProps['style']))}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="default">Default (Indigo)</option>
          <option value="urgent">Urgent (Red/Orange)</option>
          <option value="minimal">Minimal (Dark)</option>
        </select>
      </div>
    </div>
  );
};

CTA.craft = {
  displayName: 'CTA',
  props: {
    headline: 'Ready to Get Started?',
    subheadline: 'Join thousands of creators already using Funnels App',
    buttonText: 'Start Building Now',
    buttonUrl: '#',
    style: 'default',
  },
  related: {
    settings: CTASettings,
  },
};
