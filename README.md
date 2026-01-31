# Funnels App 🚀

AI-powered funnel builder for Whop creators. Build high-converting landing pages with drag-and-drop simplicity and AI-assisted copywriting.

## Features

### 🎨 Drag-and-Drop Editor
- **6 Block Types:** Hero, Features, Testimonials, Pricing, FAQ, CTA
- Visual editor powered by Craft.js
- Real-time preview
- Settings panel for each block

### 🤖 AI Copywriting
- **Improve Mode:** Refine existing copy with 5 tones (Punchier, Urgent, Professional, Casual, Friendly)
- **Generate Mode:** Create complete block content from product description
- **Smart Defaults:** AI-generated content when adding new blocks
- Powered by GPT-4o-mini

### 🔗 Whop Integration
- OAuth authentication with Whop accounts
- Import products and plans automatically
- Checkout links via `purchase_url` field
- Webhook support for conversion tracking

### 💾 Full Persistence
- Auto-save drafts (30-second debounce)
- Version history on publish
- Rollback capability
- SQLite for dev, PostgreSQL for production

### 📊 Analytics
- Track views, clicks, and conversions
- Webhook integration for payment events
- Per-funnel statistics dashboard

## Tech Stack

- **Framework:** Next.js 14
- **UI:** React 18, Tailwind CSS 3
- **Editor:** Craft.js
- **Database:** Prisma 5 (SQLite/PostgreSQL)
- **AI:** OpenAI GPT-4o-mini
- **Auth:** Whop OAuth 2.1 + PKCE

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/TheCodingKid82/funnels-app.git
cd funnels-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

```env
# Database (SQLite for dev, Postgres for prod)
DATABASE_URL="file:./prisma/dev.db"

# Whop OAuth
NEXT_PUBLIC_WHOP_CLIENT_ID=your_client_id
WHOP_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_WHOP_REDIRECT_URI=http://localhost:3000/api/auth/whop/callback

# Whop Webhooks
WHOP_WEBHOOK_SECRET=your_webhook_secret

# OpenAI
OPENAI_API_KEY=your_openai_key
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ai/          # AI endpoints
│   │   ├── auth/        # Whop OAuth
│   │   ├── funnels/     # CRUD + analytics
│   │   └── webhooks/    # Whop webhooks
│   ├── dashboard/       # User dashboard
│   └── editor/          # Drag-drop editor
├── components/
│   ├── blocks/          # Funnel blocks
│   └── editor/          # Editor UI
├── hooks/               # React hooks
└── lib/                 # Core utilities
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/funnels` | GET | List user's funnels |
| `/api/funnels` | POST | Create funnel |
| `/api/funnels/[id]` | GET | Get funnel |
| `/api/funnels/[id]` | PATCH | Update funnel |
| `/api/funnels/[id]` | DELETE | Delete funnel |
| `/api/funnels/[id]/publish` | POST | Publish version |
| `/api/funnels/[id]/track` | POST | Track event |
| `/api/funnels/[id]/analytics` | GET | Get stats |
| `/api/ai/improve` | POST | Improve copy |
| `/api/ai/generate` | POST | Generate content |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

For production, use a PostgreSQL database:
- [Neon](https://neon.tech) (recommended)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

## Team

Built by **Spark Studio** - AI-powered holding company

- **Callisto** 🐻 - Engineer
- **Artemis** 🏹 - Product (Head of Funnels)

## License

MIT
