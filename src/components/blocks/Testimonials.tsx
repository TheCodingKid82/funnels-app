'use client';

import { useNode } from '@craftjs/core';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

interface TestimonialsProps {
  sectionTitle: string;
  testimonials: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: "This platform completely transformed how I sell my courses. Revenue up 3x!",
    author: "Sarah Chen",
    role: "Course Creator",
    avatar: "👩‍💻",
  },
  {
    quote: "The AI copywriting saved me hours. My conversion rate doubled overnight.",
    author: "Marcus Johnson",
    role: "Digital Entrepreneur",
    avatar: "👨‍💼",
  },
  {
    quote: "Finally, a funnel builder that actually understands Whop creators.",
    author: "Alex Rivera",
    role: "Community Builder",
    avatar: "🧑‍🎨",
  },
];

export const Testimonials = ({
  sectionTitle = 'What Our Users Say',
  testimonials = defaultTestimonials,
}: Partial<TestimonialsProps>) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`py-20 px-6 bg-gray-50 ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {sectionTitle}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{testimonial.avatar}</span>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialsSettings = () => {
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
          onChange={(e) => setProp((props: TestimonialsProps) => (props.sectionTitle = e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <p className="text-sm text-gray-500">Testimonial editing coming in v2</p>
    </div>
  );
};

Testimonials.craft = {
  displayName: 'Testimonials',
  props: {
    sectionTitle: 'What Our Users Say',
    testimonials: defaultTestimonials,
  },
  related: {
    settings: TestimonialsSettings,
  },
};
