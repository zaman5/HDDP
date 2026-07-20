# HDDP Consultants — Website (Angular + Node.js)

A full rebuild of **hddpconsultants.com** with an Angular 17 frontend, a Node.js/Express backend, a new **Q&A page**, a site-wide **chatbot**, and a complete **Admin panel** at `/Admin`.

---

## Project structure

```
hddp-website/
├── backend/          # Node.js + Express API (port 4000)
│   ├── server.js     # Entry point — also serves the built Angular app
│   ├── config.js     # Port, JWT secret, default admin credentials
│   ├── seed.js       # Seeds admin user, blogs, Q&A on first run
│   ├── knowledge.js  # Chatbot knowledge base (edit answers here)
│   ├── routes/       # auth, blogs, qa, chatbot, contact, careers
│   └── data/         # JSON file storage (auto-created)
└── frontend/         # Angular 17 app
    ├── src/app/pages/      # home, who-we-are, solutions, industries,
    │                       # how-we-work, contact, apply-now, blogs, qa, admin
    ├── src/app/components/ # header, footer, chatbot widget
    └── dist/               # Pre-built production bundle (already included)
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

A production build is already included in `frontend/dist/`, so you can simply run:
```bash
cd backend
npm install
npm start
```
and open **http://localhost:4000** — the backend serves the built Angular site and the API together.

To rebuild the frontend after making changes:
```bash
cd frontend
npx ng build --configuration production
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

## Chatbot

The floating chat widget (bottom-right on every public page) is **rule-based** —
no external AI service or API key needed. All answers live in
`backend/knowledge.js`; edit that file to add or refine responses, then restart
the backend. Every conversation is logged and visible in Admin → Chat logs.

## Images

`frontend/src/assets/img/` is intentionally left for your real photos and logo.
The site renders gracefully without them (gradient fallbacks), but for the full
look, copy your images from the current site into that folder using these names:
`industry-healthcare.jpg`, `industry-it.jpg`, `industry-banking.jpg`,
`industry-retail.jpg`, `industry-travel.jpg`, `industry-other.jpg`,
`blog-1.jpg`, `blog-2.jpg`, and replace `src/favicon.ico`. Then rebuild.

## Swapping the database later

Storage is plain JSON files in `backend/data/` via the tiny helper in
`backend/db.js`. To move to MongoDB/PostgreSQL, reimplement the three functions
in `db.js` — no route code needs to change.

## Deployment notes

- Any Node host works (VPS, Render, Railway, etc.): deploy the whole folder,
  run `npm install && npm start` inside `backend/`.
- Set env vars in production: `PORT`, `JWT_SECRET`.
- Put it behind HTTPS (e.g., Nginx + Let's Encrypt or your host's TLS).
