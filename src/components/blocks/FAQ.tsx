'use client';

import { useNode } from '@craftjs/core';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  sectionTitle: string;
  items: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
  {
    question: 'How does the free trial work?',
    answer: 'You get 14 days of full access to all features. No credit card required to start.',
  },
  {
    question: 'Can I connect my existing Whop products?',
    answer: 'Yes! Simply connect your Whop account and we\'ll import all your products automatically.',
  },
  {
    question: 'Do I need coding skills?',
    answer: 'Not at all. Our drag-and-drop builder is designed for everyone, regardless of technical background.',
  },
  {
    question: 'How does the AI copywriting work?',
    answer: 'Just describe your product and target audience, and our AI will generate compelling headlines, descriptions, and CTAs tailored to your brand.',
  },
];

export const FAQ = ({
  sectionTitle = 'Frequently Asked Questions',
  items = defaultFAQs,
}: Partial<FAQProps>) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`py-20 px-6 bg-gray-50 ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {sectionTitle}
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                <span className="text-2xl text-gray-400">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQSettings = () => {
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
          onChange={(e) => setProp((props: FAQProps) => (props.sectionTitle = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <p className="text-sm text-gray-500">FAQ editing coming in v2</p>
    </div>
  );
};

FAQ.craft = {
  displayName: 'FAQ',
  props: {
    sectionTitle: 'Frequently Asked Questions',
    items: defaultFAQs,
  },
  related: {
    settings: FAQSettings,
  },
};
