# Blog Client — Next.js 14+ Frontend

Production-ready Next.js 14 (App Router) frontend for the personal blogging platform.

## Tech Stack

- **Next.js 14+** — App Router, SSR, ISR
- **TypeScript** — Strict mode
- **Tailwind CSS** — Neumorphic design system
- **Axios** — API communication
- **React Markdown** — Post rendering
- **Framer Motion** — Smooth animations
- **React Hot Toast** — Notifications
- **Poppins** — via `next/font/google` (400, 500, 600, 700)

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Backend running on `http://localhost:3000`

### Install & Run

```bash
cd blog-client

# Install dependencies
npm install

# Start dev server (port 3001 by default)
npm run dev -- -p 3001
```

### Environment Variables

Copy `.env.local` and adjust:

| Variable                       | Default                         |
| ------------------------------ | ------------------------------- |
| `NEXT_PUBLIC_API_URL`          | `http://localhost:3000`         |
| `NEXT_PUBLIC_SITE_URL`         | `http://localhost:3001`         |
| `NEXT_PUBLIC_SITE_NAME`        | `Raaj's Blog`                  |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Thoughts on engineering, ...   |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Poppins + providers)
│   ├── page.tsx                # Homepage (posts list)
│   ├── loading.tsx             # Home loading skeleton
│   ├── not-found.tsx           # 404 page
│   ├── global-error.tsx        # Error boundary
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── robots.ts               # Robots.txt
│   ├── rss.xml/route.ts        # RSS feed
│   ├── about/                  # About page
│   ├── posts/[slug]/           # Post page (SSG + ISR)
│   └── admin/
│       ├── login/              # Admin login
│       └── dashboard/          # Admin dashboard (create/edit/publish)
├── components/
│   ├── Navbar.tsx              # Minimal navbar
│   ├── Footer.tsx              # Footer
│   ├── PostCard.tsx            # Neumorphic post card
│   ├── SubscribeCard.tsx       # Newsletter subscription
│   ├── MarkdownRenderer.tsx    # Markdown → React
│   ├── ThemeToggle.tsx         # Dark/light toggle
│   ├── ThemeProvider.tsx       # Theme context
│   ├── Button.tsx              # Neumorphic button
│   └── Skeletons.tsx           # Loading skeletons
├── lib/
│   ├── api.ts                  # Axios API client
│   ├── types.ts                # TypeScript interfaces
│   ├── constants.ts            # Site config
│   └── utils.ts                # Utilities (dates, reading time, etc.)
└── styles/
    └── globals.css             # Tailwind + neumorphic styles
```

## Features

### Public
- Homepage with neumorphic post cards
- Post page with Markdown rendering (`/posts/[slug]`)
- Newsletter subscription with validation + toast
- About page
- 404 page with animations

### Admin
- Login page (`/admin/login`)
- Dashboard (`/admin/dashboard`) — create, edit, publish posts
- JWT auth with localStorage

### SEO
- Dynamic `<title>` and `<meta>` per page
- OpenGraph tags
- RSS feed at `/rss.xml`
- Sitemap at `/sitemap.xml`
- Robots.txt

### Design
- Neumorphic UI (soft depth, dual shadows)
- Light/dark mode with system preference detection
- Poppins typography with comfortable line-height (1.7+)
- Framer Motion animations (fade-in, slide-up, hover elevation)
- Loading skeletons
- Accessibility-compliant contrast

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in your Vercel dashboard for `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, etc.

## API Endpoints Used

| Method | Endpoint                    | Auth | Purpose                      |
| ------ | --------------------------- | ---- | ---------------------------- |
| GET    | `/posts`                    | No   | List published posts         |
| GET    | `/posts/:slug`              | No   | Single post by slug          |
| POST   | `/subscribe`                | No   | Newsletter subscribe         |
| POST   | `/admin/login`              | No   | Admin authentication         |
| POST   | `/admin/posts`              | JWT  | Create draft post            |
| PUT    | `/admin/posts/:id`          | JWT  | Update post                  |
| POST   | `/admin/posts/:id/publish`  | JWT  | Publish post + newsletter    |
