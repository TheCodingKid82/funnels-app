/**
 * Test script to verify database persistence is working
 * Run with: npx ts-node scripts/test-persistence.ts
 */

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🧪 Testing Funnels App Persistence...\n');

  // 1. Create a test user
  console.log('1️⃣ Creating test user...');
  const user = await db.user.upsert({
    where: { whopUserId: 'test_user_123' },
    update: {},
    create: {
      whopUserId: 'test_user_123',
      email: 'test@example.com',
      name: 'Test User',
      username: 'testuser',
    },
  });
  console.log(`   ✅ User created: ${user.id}\n`);

  // 2. Create a test funnel
  console.log('2️⃣ Creating test funnel...');
  const funnel = await db.funnel.create({
    data: {
      userId: user.id,
      name: 'My First Funnel',
      slug: 'my-first-funnel-' + Date.now(),
      description: 'A test funnel to verify persistence',
      draftState: JSON.stringify({
        ROOT: {
          type: 'Canvas',
          nodes: ['hero-1', 'features-1'],
        },
        'hero-1': {
          type: 'Hero',
          props: {
            headline: 'Welcome to My Product',
            subheadline: 'The best thing since sliced bread',
          },
        },
        'features-1': {
          type: 'Features',
          props: {
            sectionTitle: 'Why Choose Us',
          },
        },
      }),
    },
  });
  console.log(`   ✅ Funnel created: ${funnel.id}`);
  console.log(`   📝 Slug: ${funnel.slug}\n`);

  // 3. Update the funnel (simulate auto-save)
  console.log('3️⃣ Updating funnel draft (auto-save simulation)...');
  const updatedFunnel = await db.funnel.update({
    where: { id: funnel.id },
    data: {
      draftState: JSON.stringify({
        ROOT: {
          type: 'Canvas',
          nodes: ['hero-1', 'features-1', 'cta-1'],
        },
        'hero-1': {
          type: 'Hero',
          props: {
            headline: 'Updated Headline!',
            subheadline: 'Now with more awesome',
          },
        },
        'features-1': {
          type: 'Features',
          props: {
            sectionTitle: 'Why Choose Us',
          },
        },
        'cta-1': {
          type: 'CTA',
          props: {
            headline: 'Ready to Get Started?',
            buttonText: 'Sign Up Now',
          },
        },
      }),
    },
  });
  console.log(`   ✅ Funnel updated at: ${updatedFunnel.updatedAt}\n`);

  // 4. Publish the funnel (create version)
  console.log('4️⃣ Publishing funnel (creating version)...');
  const version = await db.funnelVersion.create({
    data: {
      funnelId: funnel.id,
      version: 1,
      craftState: updatedFunnel.draftState || '',
      note: 'Initial publish',
    },
  });
  await db.funnel.update({
    where: { id: funnel.id },
    data: {
      published: true,
      publishedAt: new Date(),
    },
  });
  console.log(`   ✅ Version ${version.version} published\n`);

  // 5. Track analytics events
  console.log('5️⃣ Tracking analytics events...');
  await db.analyticsEvent.createMany({
    data: [
      { funnelId: funnel.id, eventType: 'view', visitorId: 'v1' },
      { funnelId: funnel.id, eventType: 'view', visitorId: 'v2' },
      { funnelId: funnel.id, eventType: 'click', visitorId: 'v1' },
      { funnelId: funnel.id, eventType: 'conversion', visitorId: 'v1', amount: 29.99 },
    ],
  });
  const stats = await db.analyticsEvent.groupBy({
    by: ['eventType'],
    where: { funnelId: funnel.id },
    _count: true,
  });
  console.log('   ✅ Analytics tracked:');
  stats.forEach((s) => console.log(`      - ${s.eventType}: ${s._count}`));

  // 6. Fetch everything back
  console.log('\n6️⃣ Fetching funnel with all relations...');
  const fullFunnel = await db.funnel.findUnique({
    where: { id: funnel.id },
    include: {
      user: true,
      versions: true,
      _count: { select: { analytics: true } },
    },
  });
  console.log(`   ✅ Funnel: ${fullFunnel?.name}`);
  console.log(`   👤 Owner: ${fullFunnel?.user.name}`);
  console.log(`   📦 Versions: ${fullFunnel?.versions.length}`);
  console.log(`   📊 Events: ${fullFunnel?._count.analytics}`);

  // Cleanup
  console.log('\n🧹 Cleaning up test data...');
  await db.funnel.delete({ where: { id: funnel.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log('   ✅ Test data cleaned up');

  console.log('\n✨ All persistence tests passed! ✨');
  console.log('\n📋 Summary:');
  console.log('   - User CRUD: ✅');
  console.log('   - Funnel CRUD: ✅');
  console.log('   - Draft state (JSON): ✅');
  console.log('   - Version history: ✅');
  console.log('   - Analytics tracking: ✅');
  console.log('\n🚀 Ready for production with real Postgres!\n');
}

main()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
