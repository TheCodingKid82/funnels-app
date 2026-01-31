import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Funnels App</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white/80 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/api/auth/whop"
              className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Connect Whop
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Build High-Converting Funnels for Your Whop Products
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Drag-and-drop builder. AI-powered copywriting. Seamless Whop integration.
            Everything you need to grow your revenue.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/api/auth/whop"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/editor"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Try the Editor
            </Link>
          </div>
        </div>
      </main>

      {/* Features Preview */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Convert
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎨"
              title="Drag & Drop Builder"
              description="Build beautiful landing pages with pre-designed blocks. No coding required."
            />
            <FeatureCard
              icon="🤖"
              title="AI Copywriting"
              description="Let AI write compelling headlines, CTAs, and descriptions tailored to your audience."
            />
            <FeatureCard
              icon="📊"
              title="Built-in Analytics"
              description="Track views, clicks, and conversions. Know exactly what's working."
            />
            <FeatureCard
              icon="🔗"
              title="Whop Integration"
              description="Connect your products with one click. Checkout links auto-populate."
            />
            <FeatureCard
              icon="⚡"
              title="Instant Publishing"
              description="Go live in seconds with our hosted subdomain. No setup hassle."
            />
            <FeatureCard
              icon="🎯"
              title="Conversion Optimized"
              description="Templates designed by conversion experts. Maximize your revenue."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Grow Your Whop Revenue?
          </h3>
          <p className="text-xl text-gray-400 mb-8">
            Join creators already using Funnels App to convert more customers.
          </p>
          <Link
            href="/api/auth/whop"
            className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-lg"
          >
            Start Building for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© 2024 Funnels App by Spark Studio. Built for Whop creators.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <span className="text-4xl mb-4 block">{icon}</span>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
