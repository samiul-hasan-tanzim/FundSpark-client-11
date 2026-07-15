# FundSpark – Client

Frontend for the FundSpark crowdfunding platform built with Next.js 16, Tailwind CSS v4, and Better Auth.

## Tech Stack

- **Framework:** Next.js 16 (App Router, JavaScript only)
- **Styling:** Tailwind CSS v4, CSS-based config
- **Auth:** Better Auth (email/password, Google OAuth, JWT session)
- **UI:** lucide-react icons, framer-motion animations, recharts charts, swiper sliders
- **Payments:** Stripe (client-side)
- **Image Upload:** imgBB API

## Features

- Role-based dashboards (Admin, Creator, Supporter)
- Campaign management (create, edit, delete with supporter refunds)
- Contribution system with pending/approved/rejected flow
- Credit system (purchase via Stripe, earn on registration)
- Withdrawal requests with multiple payment methods
- Admin analytics with charts and campaign/report management
- Notification system with real-time polling
- Fade-in scroll animations throughout
- Fully responsive design

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance
- imgBB API key
- Stripe account
- Google OAuth credentials (for social login)

### Environment Variables

Copy `.env` to the project root (already configured for local dev):

| Variable | Description |
|----------|-------------|
| `BETTER_AUTH_SECRET` | Secret for Better Auth JWT |
| `BETTER_AUTH_URL` | Client URL for auth redirects |
| `NEXT_PUBLIC_SERVER_URL` | Express backend URL |
| `MONGODB_URI` | MongoDB connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_IMGBB_KEY` | imgBB API key for image uploads |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |

### Install & Run

```bash
npm install
npm run dev        # http://localhost:3000
```

### Build

```bash
npm run build      # production build
npm run lint       # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (main)/          # Public pages (home, explore, details)
│   ├── (auth)/          # Login, Register
│   ├── (dashboard)/     # Role-based dashboards
│   │   ├── admin/       # manage-users, campaign-approvals, reports, etc.
│   │   ├── creator/     # add-campaign, my-campaigns, withdrawals, etc.
│   │   └── supporter/   # my-contributions, purchase-credits, etc.
│   └── api/auth/        # Better Auth catch-all route
├── components/          # Reusable UI components
└── lib/                 # Auth config, shared data
```

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

Set all environment variables in the Vercel project dashboard.
