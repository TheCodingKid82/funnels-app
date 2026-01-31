'use client';

import { useNode } from '@craftjs/core';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  highlighted: boolean;
}

interface PricingProps {
  sectionTitle: string;
  tiers: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    features: ['1 Funnel', 'Basic Analytics', 'Email Support'],
    ctaText: 'Start Free Trial',
    ctaUrl: '#',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    features: ['Unlimited Funnels', 'Advanced Analytics', 'AI Copywriting', 'Priority Support'],
    ctaText: 'Get Started',
    ctaUrl: '#',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    features: ['Everything in Pro', 'Custom Domains', 'White Label', 'Dedicated Account Manager'],
    ctaText: 'Contact Sales',
    ctaUrl: '#',
    highlighted: false,
  },
];

export const Pricing = ({
  sectionTitle = 'Simple, Transparent Pricing',
  tiers = defaultTiers,
}: Partial<PricingProps>) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`py-20 px-6 bg-white ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {sectionTitle}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl ${
                tier.highlighted
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 scale-105'
                  : 'bg-gray-50 text-gray-900'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className={tier.highlighted ? 'text-indigo-200' : 'text-gray-500'}>
                  {tier.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaUrl}
                className={`block w-full py-3 text-center rounded-lg font-semibold transition-colors ${
                  tier.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-gray-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {tier.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Section Title</label>
        <input
          type="text"
          value={props.sectionTitle || ''}
          onChange={(e) => setProp((props: PricingProps) => (props.sectionTitle = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <p className="text-sm text-gray-500">💡 Connect Whop plans to auto-populate pricing tiers</p>
    </div>
  );
};

Pricing.craft = {
  displayName: 'Pricing',
  props: {
    sectionTitle: 'Simple, Transparent Pricing',
    tiers: defaultTiers,
  },
  related: {
    settings: PricingSettings,
  },
};
