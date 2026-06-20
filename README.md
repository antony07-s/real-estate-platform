# RealEstate Platform — Fullstack Technical Project

A real-estate listing platform inspired by 99acres and NoBroker. Built with Next.js, Express and PostgreSQL as part of a fullstack technical Project.

## Live Demo

- Frontend: https://real-estate-platform-uksv.vercel.app
- Backend API: https://real-estate-platform-y9vw.onrender.com
- API Docs: https://real-estate-platform-y9vw.onrender.com/api-docs

Backend is on Render's free plan, so it sleeps after some inactivity. First request might take 30-40 seconds to wake up, after that it's fast.

### Test login
| Email | Password |
|---|---|
| antony@gmail.com | antony1234 |
| arun@gmail.com | 123456 |
| james@gmail.com | 123456 |

You can also just register a new account on the site.

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Validation: Joi on backend, Zod + react-hook-form on frontend
- API docs: Swagger
- Deployed on Vercel (frontend) and Render (backend + db)

## Folder Structure

```
real-estate-platform/
├── backend/
│   ├── migrations/        
│   └── src/
│       ├── config/db.js
│       ├── middleware/
│       ├── modules/
│       │   ├── auth/
│       │   ├── properties/
│       │   └── leads/
│       └── utils/swagger.js
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── context/
        ├── hooks/
        ├── lib/
        └── types/
```

## Some decisions I made

**Auth** — using access token (15 min) + refresh token (7 days). Access token is short so if it leaks it doesn't matter much, refresh token keeps the user logged in without asking for password again and again. Axios interceptor handles refreshing automatically when a request fails with 401.

**Ownership check** — every property has a user_id. Before update/delete I check req.user.userId against the row's user_id in the service layer itself, not just hiding the edit button in UI. So even if someone calls the API directly they can't edit others' listings.

**Search & filters for 50k+ records** — added indexes on city, price, property_type, bedrooms, user_id since without them every filtered search becomes a full table scan. Queries are parameterized to avoid SQL injection, and sort column is whitelisted since you can't parameterize column names directly. Pagination is done with LIMIT/OFFSET on the backend so we're never sending all rows to frontend.

One thing I know is a tradeoff — OFFSET pagination gets slower on really deep pages since postgres still scans past rows. Cursor based pagination would be better at real 50k+ scale but went with OFFSET for now given the time I had.

**Similar properties** — instead of any ML, I just query same city + same property type + price within 30% range, sorted by closeness in bedrooms then price. Reuses existing indexes so it stays fast.

**Leads / spam prevention** — unique constraint on (property_id, sender_id) so someone can't send duplicate inquiries on the same property. Owner also can't send inquiry to their own listing. Added a rate limit of 5 inquiries per hour per user on top of the general express-rate-limit already on all /api routes.

**SEO** — property detail page is a server component using ISR with 60 sec revalidate. Went with this instead of pure SSG (too many listings, data changes often) or plain SSR (would hit the db every single request). generateMetadata() sets a unique title/description per property.

**Image handling** — supports both file upload (stored as blob in db) and image URL arrays for the seeded demo data. In a real production setup I'd switch this to pre-signed S3/Cloudinary upload URLs instead of storing blobs directly in postgres.

## Running locally

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend on localhost:5000, frontend on localhost:3000, swagger docs at localhost:5000/api-docs

## Deployment notes

Backend + Postgres are both on Render. Had to enable SSL on the db connection for production (Render requires it) — handled with a NODE_ENV check in db.js so local dev still connects without SSL.

Frontend is on Vercel, auto deploys whenever I push to main.

## Things I'd improve with more time

- Dashboard currently filters "my listings" on the client side. Should really have a GET /api/properties/my endpoint using the existing user_id index instead.
- Move pagination to cursor based for true 50k+ scale.
- No automated tests yet — would add Jest + Supertest for the routes next.