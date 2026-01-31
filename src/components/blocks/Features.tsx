'use client';

import { useNode } from '@craftjs/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  sectionTitle: string;
  features: Feature[];
}

const defaultFeatures: Feature[] = [
  { icon: '🚀', title: 'Fast Setup', description: 'Get started in minutes with our intuitive interface' },
  { icon: '💡', title: 'AI-Powered', description: 'Let AI help you write compelling copy' },
  { icon: '📊', title: 'Analytics', description: 'Track your funnel performance in real-time' },
  { icon: '🔗', title: 'Integrations', description: 'Connect with your favorite tools seamlessly' },
];

export const Features = ({
  sectionTitle = 'Why Choose Us',
  features = defaultFeatures,
}: Partial<FeaturesProps>) => {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturesSettings = () => {
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
          onChange={(e) => setProp((props: FeaturesProps) => (props.sectionTitle = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <p className="text-sm text-gray-500">Feature editing coming in v2</p>
    </div>
  );
};

Features.craft = {
  displayName: 'Features',
  props: {
    sectionTitle: 'Why Choose Us',
    features: defaultFeatures,
  },
  related: {
    settings: FeaturesSettings,
  },
};
