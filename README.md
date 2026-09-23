# HDDP Consultants — Website (Angular + Node.js)

A full rebuild of **hddpconsultants.com** with an Angular 17 frontend, a Node.js/Express backend, a new **Q&A page**, a site-wide **chatbot**, multi-tier **rate limiting with exponential backoff**, and a complete **Admin panel** at `/admin`.

---

## Project structure

```
hddp-website/
├── backend/          # Node.js + Express API (port 4000)
│   ├── server.js     # Entry point — also serves the built Angular app
│   ├── config.js     # Port, JWT secret, default admin credentials, rate limits
│   ├── seed.js       # Seeds admin user, blogs, Q&A on first run
│   ├── knowledge.js  # Chatbot knowledge base (edit answers here)
│   ├── middleware/   # auth.js, rate-limiter.js (multi-tier + backoff)
│   ├── routes/       # auth, blogs, qa, chatbot, contact, careers
│   └── data/         # JSON file storage (auto-created)
└── frontend/         # Angular 17 app
    ├── src/app/pages/      # home, who-we-are, solutions, industries,
    │                       # how-we-work, contact, apply-now, blogs, qa, admin
    ├── src/app/components/ # header, footer, chatbot widget, page-qa
    └── dist/               # Pre-built production bundle
```

## Quick start (development)

**1. Backend** (terminal 1):
```bash
cd backend
npm install
npm start          # → http://localhost:4000
```
On first run it seeds the database (default admin, 2 blogs, 8 Q&A items).

**2. Frontend** (terminal 2):
```bash
cd frontend
npm install
npm start          # → http://localhost:4200 (API proxied to :4000)
```

## Quick start (production / single server)

A production build is included in `frontend/dist/`, so you can simply run:
```bash
cd backend
npm install
npm start
```
and open **http://localhost:4000** — the backend serves the built Angular site and the API together.

To rebuild the frontend after making changes:
```bash
cd frontend
npm run build
```

## Admin panel

- URL: **`/admin`** or **`/Admin`**
- Default login: `admin@hddpconsultants.com` / `Admin@123`

> ⚠️ **Change the password immediately** (Admin → Settings) and set a strong
> `JWT_SECRET` in `backend/config.js` (or via the `JWT_SECRET` env variable)
> before deploying publicly.

Admin features:
- **Dashboard** — live counts of blogs, Q&A, messages, applications, chats
- **Blogs** — create / edit / delete articles with a rich-text editor
  (headings, bold/italic/underline, lists, links, images) + publish toggle
- **Q&A** — manage the questions shown on the public Q&A page, by category
- **Messages** — read and manage contact-form submissions
- **Applications** — review job applications and set status
  (new / shortlisted / interview / hired / rejected)
- **Chat logs** — see what visitors asked the chatbot
- **Settings** — change the admin password

## Rate Limiting & Security

Multi-tiered rate limiting is enforced with configurable thresholds via environment variables:

| Tier | Endpoints | Default Limit | Strategy |
| :--- | :--- | :--- | :--- |
| **Authentication** | `/api/auth/login`, `/api/auth/change-password` | 20 req / 15m (IP), 10 req / 15m (Account) | **Per-IP + Per-Account with Exponential Backoff** (2s, 4s, 8s, 16s...) after 3 free attempts |
| **Public Read** | `/api/blogs`, `/api/qa`, `/api/careers/*`, `/api/health` | 120 req / min | Sliding window per IP |
| **Public Interactive** | `/api/chatbot`, `/api/contact`, `/api/careers/apply` | 30 req / min | Sliding window per IP |
| **Authenticated User** | `/api/admin/*`, admin CRUD actions | 400 req / min | Sliding window per user / IP |

### Configurable Environment Variables

```env
# Auth tier
RATE_LIMIT_AUTH_WINDOW_MS=900000     # 15 min
RATE_LIMIT_AUTH_MAX_IP=20
RATE_LIMIT_AUTH_MAX_ACCOUNT=10
RATE_LIMIT_AUTH_FREE_ATTEMPTS=3     # Free attempts before backoff
RATE_LIMIT_AUTH_BASE_DELAY_SEC=2    # Initial delay in seconds
RATE_LIMIT_AUTH_MAX_DELAY_SEC=900   # Maximum delay in seconds

# Public read tier
RATE_LIMIT_PUBLIC_WINDOW_MS=60000   # 1 min
RATE_LIMIT_PUBLIC_MAX=120

# Public interactive tier (chatbot / contact)
RATE_LIMIT_INTERACTIVE_WINDOW_MS=60000
RATE_LIMIT_INTERACTIVE_MAX=30

# Authenticated tier
RATE_LIMIT_AUTHED_WINDOW_MS=60000
RATE_LIMIT_AUTHED_MAX=400
```

## Chatbot

The floating chat widget (bottom-right on every public page) is **rule-based** —
no external AI service or API key needed. All answers live in
`backend/knowledge.js`; edit that file to add or refine responses, then restart
the backend. Every conversation is logged and visible in Admin → Chat logs.

## Deployment notes

- Any Node host works (VPS, Render, Railway, etc.): deploy the whole folder,
  run `npm install && npm start` inside `backend/`.
- Set env vars in production: `PORT`, `JWT_SECRET`, and any custom `RATE_LIMIT_*` thresholds.
- Put it behind HTTPS (e.g., Nginx + Let's Encrypt or your host's TLS).
