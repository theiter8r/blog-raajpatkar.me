# Blog Backend

Production-ready Node.js blogging backend with newsletter system. Designed for Railway deployment.

## Architecture

```
┌──────────────────────────────────┐
│         Express API Server       │
│   (Routes, Controllers, Auth)    │
│         POST /admin/posts        │
│      POST /admin/posts/:id       │
│      GET /posts, GET /posts/:slug│
│      POST /subscribe             │
│      GET /confirm/:token         │
│      POST /unsubscribe/:token    │
└────────────┬─────────────────────┘
             │ Publishes job
             ▼
┌──────────────────────────────────┐
│           Redis (BullMQ)         │
│        Newsletter Queue          │
└────────────┬─────────────────────┘
             │ Consumes job
             ▼
┌──────────────────────────────────┐
│        BullMQ Worker             │
│   Fetches subscribers (batches)  │
│   Sends emails via Resend        │
│   Logs success/failure           │
└──────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│         PostgreSQL               │
│  admins │ posts │ subscribers    │
│        newsletter_logs           │
└──────────────────────────────────┘
```

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Database:** PostgreSQL
- **Queue:** Redis + BullMQ
- **Email:** Resend
- **Auth:** JWT (bcrypt hashed passwords)
- **Markdown:** marked + DOMPurify

## Folder Structure

```
src/
├── config/
│   ├── database.js       # PostgreSQL pool
│   ├── env.js            # Environment config
│   ├── redis.js          # Redis connection factory
│   └── resend.js         # Resend client
├── controllers/
│   ├── authController.js
│   ├── postController.js
│   └── subscriberController.js
├── db/
│   ├── migrate.js        # Run SQL migration
│   ├── schema.sql        # Full database schema
│   └── seed.js           # Seed admin user
├── middleware/
│   ├── auth.js           # JWT verification
│   ├── errorHandler.js   # Error handling
│   └── rateLimiter.js    # Rate limiting
├── queue/
│   └── newsletterQueue.js
├── routes/
│   ├── admin.js
│   ├── index.js
│   ├── posts.js
│   └── subscribers.js
├── services/
│   ├── authService.js
│   ├── emailTemplate.js
│   ├── markdown.js
│   ├── newsletterService.js
│   ├── postService.js
│   └── subscriberService.js
├── worker/
│   └── newsletterWorker.js
├── server.js             # Web process entry
└── worker.js             # Worker process entry
```

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- Redis running locally

### Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your local credentials

# Run database migration
npm run migrate

# Seed admin user (optional)
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npm run seed

# Start web server (with hot reload)
npm run dev

# Start worker (separate terminal, with hot reload)
npm run worker:dev
```

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/posts` | List published posts (paginated) |
| GET | `/posts/:slug` | Get post by slug |
| POST | `/subscribe` | Subscribe to newsletter |
| GET | `/confirm/:token` | Confirm subscription |
| POST | `/unsubscribe/:token` | Unsubscribe |

### Admin (requires `Authorization: Bearer <token>`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/admin/login` | Get JWT token |
| POST | `/admin/posts` | Create draft post |
| PUT | `/admin/posts/:id` | Update post |
| POST | `/admin/posts/:id/publish` | Publish post → triggers newsletter |

### Example Requests

```bash
# Login
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "changeme123"}'

# Create post
curl -X POST http://localhost:3000/admin/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "content": "# Hello\n\nThis is my first post.", "excerpt": "My first blog post"}'

# Publish post
curl -X POST http://localhost:3000/admin/posts/POST_ID/publish \
  -H "Authorization: Bearer YOUR_TOKEN"

# Subscribe
curl -X POST http://localhost:3000/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "reader@example.com"}'

# List posts
curl http://localhost:3000/posts?page=1&limit=10
```

## Railway Deployment

### 1. Create Services on Railway

You need **four services** in your Railway project:

1. **PostgreSQL** — Add from Railway's database templates
2. **Redis** — Add from Railway's database templates
3. **Web Server** — Deploy from your repo
4. **Worker** — Deploy from your repo (same repo, different start command)

### 2. Environment Variables

Set these on **both** the Web and Worker services:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Railway reference) |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` (Railway reference) |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` |
| `RESEND_API_KEY` | Your Resend API key |
| `APP_URL` | Your Railway web service URL (e.g., `https://your-app.up.railway.app`) |
| `BLOG_NAME` | Your blog name |
| `FROM_EMAIL` | Your verified Resend sender email |
| `NODE_ENV` | `production` |

### 3. Service Configuration

**Web Service:**
- Start command: `npm start`
- Or use the `railway.json` config (auto-detected)

**Worker Service:**
- Start command: `npm run worker`

### 4. Run Migration

After deploying, run the migration via Railway CLI:

```bash
railway run npm run migrate
railway run npm run seed
```

### 5. Procfile

The included `Procfile` tells Railway about both processes:

```
web: node src/server.js
worker: node src/worker.js
```

## Database Schema

See [src/db/schema.sql](src/db/schema.sql) for the complete schema. Tables:

- **admins** — Admin users with bcrypt-hashed passwords
- **posts** — Blog posts with markdown content, slugs, and status
- **subscribers** — Newsletter subscribers with confirmation/unsubscribe tokens
- **newsletter_logs** — Per-subscriber send logs with status tracking

## Security

- JWT authentication for admin routes
- bcrypt password hashing (12 rounds)
- Rate limiting on subscribe (5/15min) and login (10/15min) endpoints
- Global rate limit (100 req/min)
- Helmet security headers
- DOMPurify sanitization on markdown HTML output
- SQL parameterized queries (no injection)
- CORS restricted in production
