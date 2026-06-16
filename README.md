# RealEstate Platform — Fullstack Technical Assignment

A scalable real-estate listing platform inspired by 99acres and NoBroker, built with Next.js, Express, and PostgreSQL.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **API Docs:** Swagger / OpenAPI (`/api-docs`)
- **Validation:** Joi (backend), Zod + react-hook-form (frontend)

## Project Structure

```
real-estate-platform/
├── backend/
│   └── src/
│       ├── config/db.js          # PostgreSQL connection pool
│       ├── middleware/           # auth guard, centralized error handler
│       ├── modules/
│       │   ├── auth/             # routes, controller, service (3-layer)
│       │   ├── properties/
│       │   └── leads/
│       └── utils/swagger.js
└── frontend/
    └── src/
        ├── app/                 # App Router pages
        ├── components/          # layout / properties / leads / ui
        ├── context/AuthContext.tsx
        ├── hooks/
        ├── lib/api.ts           # axios instance + interceptors
        └── types/
```

## Architecture Decisions

### 1. Authentication — Token Strategy

Dual-token JWT strategy:
- **Access token** — 15 minute expiry, used on every protected request
- **Refresh token** — 7 day expiry, used only to mint a new access token

Rationale: short-lived access tokens limit the damage if one is leaked (e.g. via XSS), while the longer-lived refresh token avoids forcing users to log in every 15 minutes. The frontend axios interceptor (`lib/api.ts`) automatically retries a failed request once after silently refreshing the token, so the user never notices an expiry mid-session.

Middleware (`middleware/auth.js`) is a single reusable guard applied per-route, keeping authorization logic out of controllers entirely.

### 2. Property Module — Ownership & Validation

Every property row stores `user_id`. Update/delete operations first fetch the row and compare `user_id` against the authenticated `req.user.userId` before mutating — ownership is enforced at the service layer, not just hidden in the UI, so the API itself is safe even if called directly.

Validation is layered: Joi schemas reject malformed requests before they reach the database, and Postgres constraints (`NOT NULL`, foreign keys) are a second line of defense.

**Image handling:** the schema stores an `images TEXT[]` array of URLs rather than handling file uploads directly. For this assignment's scope, this keeps the backend stateless and avoids needing object storage (S3 etc.) infrastructure; in production this would be swapped for pre-signed upload URLs to a CDN/object store, with only the resulting URLs persisted here.

### 3. Search, Filtering & Scaling to 50,000+ Records

This was the most scale-sensitive requirement, addressed at three levels:

- **Indexing:** B-tree indexes on `city`, `price`, `property_type`, `bedrooms`, and `user_id`. Without these, every filtered query becomes a full table scan; with 50k+ rows that's the difference between a sub-10ms lookup and a multi-second query.
- **Query construction:** Filters are built dynamically (`property.service.js`) using parameterized queries (`$1, $2...`), never string concatenation — this also closes off SQL injection. An explicit whitelist (`allowedSortColumns`) prevents injection through the `ORDER BY` clause specifically, since column names can't be parameterized normally.
- **Pagination:** Server-side `LIMIT`/`OFFSET`, never sending the full dataset to the client. The count query and data query run concurrently via `Promise.all` to minimize round-trip latency.

Known tradeoff: `OFFSET` pagination degrades on very deep pages (page 5,000+) because Postgres still has to skip all prior rows. At true production scale, this would be replaced with cursor-based (keyset) pagination using the indexed sort column as the cursor — noted here as a conscious scope decision for the assignment timeframe.

### 4. Similar Properties — Similarity Algorithm

Similarity is computed with a rule-based query rather than ML, appropriate for structured listing data:

```
same city AND same property_type AND price within ±30% of the target
ORDER BY closeness of bedroom count, then closeness of price
LIMIT 4
```

This reuses the existing `city` and `property_type` indexes, so the lookup stays cheap even as the table grows — no separate precomputation or background job needed for this assignment's scale.

### 5. Lead/Inquiry Module — Spam & Duplicate Prevention

Three layers of protection:
- **Duplicate inquiries:** a `UNIQUE(property_id, sender_id)` database constraint is the source of truth, backed by an explicit pre-check in the service for a clean error message rather than a raw DB error leaking through.
- **Self-inquiry block:** an owner cannot message themselves about their own listing.
- **Rate limiting:** capped at 5 inquiries per hour per user, enforced with a `COUNT(*) ... WHERE created_at > NOW() - INTERVAL '1 hour'` check. This is layered on top of the global `express-rate-limit` middleware (100 requests / 15 min / IP) already applied to all `/api` routes — one guards against general API abuse, the other specifically against lead spam.

### 6. SEO — Rendering Strategy

The property detail page (`app/properties/[id]/page.tsx`) is a Server Component using **Incremental Static Regeneration** (`revalidate: 60`):

- Pure SSG was rejected — with potentially 50k+ listings that change frequently (price edits, availability), build-time generation doesn't scale and goes stale immediately.
- Pure SSR (no caching) was rejected — re-querying Postgres on every single request doesn't hold up under real traffic.
- ISR was chosen as the middle ground: pages are cached and served instantly, but automatically regenerate in the background at most every 60 seconds, so listings stay reasonably fresh without per-request database load.

`generateMetadata()` runs server-side per property, producing a unique `<title>` and `<meta description>` per listing (rather than one static title site-wide) — verified by checking page source directly rather than the rendered DOM, since dynamic metadata only matters if it's actually present before any client-side JavaScript runs.

### 7. API Documentation

Swagger is generated from JSDoc-style comments directly above each route definition (`swagger-jsdoc`), so the documentation lives next to the code it describes and can't drift out of sync as easily as a hand-maintained separate spec. Available at `/api-docs`.

## Setup

### Backend
```bash
cd backend
npm install
# create .env with DB credentials, JWT secrets (see .env.example pattern in code)
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:3000`, API docs at `http://localhost:5000/api-docs`.

## Known Limitations / Future Improvements

- Dashboard "my listings" currently filters client-side; a dedicated `GET /api/properties/my` endpoint using the existing `user_id` index would be the production-correct approach.
- Deep pagination (`OFFSET`-based) should move to cursor-based pagination at true 50k+ scale.
- Image upload is URL-based rather than direct file upload; would integrate with S3/Cloudinary pre-signed URLs in production.
- No automated test suite was included given the assignment's time constraint; route-level integration tests (Jest + Supertest) would be the next addition.