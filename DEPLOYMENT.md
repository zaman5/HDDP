# 🚀 HDDP Consultants Website — Deployment Guide

This guide covers all deployment methods for the HDDP Consultants website and backend API.

---

## Method 1: Vercel Deployment (Recommended / Fastest)

The project includes a ready-to-deploy [`vercel.json`](file:///c:/Users/zaman/Videos/HDDP-website/hddp-website/vercel.json) that automatically builds the Angular frontend and runs the Express API as Serverless Functions.

### Steps:
1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "Deploy HDDP Consultants"
   git push origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select your repository.
   - Set the Root Directory to `./` (root).
3. **Configure Environment Variables** in the Vercel Dashboard (*Settings → Environment Variables*):
   - `JWT_SECRET`: A long random secret string.
   - `ADMIN_EMAIL`: `admin@hddpconsultants.com` (or your preferred admin email).
   - `ADMIN_PASSWORD`: Your strong admin password.
   - `ACCELEREC_API_KEY`: (Optional) Your Accelerec API key once received from Accelerec Support. In the meantime, the Careers page displays live positions seamlessly via the embedded Accelerec iFrame (`https://careers.accelerec.com/career/HDDP-Consultants`).
4. Click **Deploy**.


---

## Method 2: cPanel / Apache / Shared Hosting (with `.htaccess`)

The project builds standard static SPA assets and includes an optimized [`.htaccess`](file:///c:/Users/zaman/Videos/HDDP-website/hddp-website/frontend/src/.htaccess) file with HTTPS redirection, Gzip compression, browser caching, and SPA HTML5 routing.

### Steps:
1. **Build the production bundle**:
   ```bash
   cd frontend
   npm run build
   ```
2. **Locate the build files**:
   - The compiled files (including `index.html`, `.htaccess`, `sitemap.xml`, `robots.txt`, and assets) are in:
     `frontend/dist/hddp-frontend/browser/`
3. **Upload to cPanel**:
   - Open cPanel **File Manager** and navigate to `public_html/` (or your subdomain directory).
   - Upload all contents from `frontend/dist/hddp-frontend/browser/` directly into `public_html/`.
   - Make sure hidden files (like `.htaccess`) are uploaded.
4. **Node.js API Setup in cPanel** (if running the backend in cPanel Node.js Selector):
   - Go to cPanel **Setup Node.js App**.
   - Create an application pointing to `backend/server.js`.
   - Set environment variables in the cPanel interface.

---

## Method 3: VPS / Ubuntu / Cloud VM (PM2 + Nginx / Apache)

For Ubuntu/Debian Linux VPS instances (DigitalOcean, Linode, AWS EC2, Hetzner, etc.):

### 1. Clone & Install:
```bash
git clone <your-repo-url>
cd HDDP-website/hddp-website

# Install backend dependencies
cd backend && npm ci --omit=dev && cd ..

# Build frontend
cd frontend && npm ci && npm run build && cd ..
```

### 2. Configure Environment:
```bash
cp .env.example .env
nano .env # update your JWT_SECRET and ADMIN_PASSWORD
```

### 3. Start with PM2:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy Config (`/etc/nginx/sites-available/hddp`):
```nginx
server {
    listen 80;
    server_name hddpconsultants.com www.hddpconsultants.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hddpconsultants.com www.hddpconsultants.com;

    ssl_certificate /etc/letsencrypt/live/hddpconsultants.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hddpconsultants.com/privkey.pem;

    root /var/www/hddp/frontend/dist/hddp-frontend/browser;
    index index.html;

    # API Proxy to Node.js Backend
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static SPA Routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Method 4: Docker Deployment

Deploy using Docker and Docker Compose on any container platform (Railway, Render, Fly.io, AWS ECS):

```bash
# Build and run container in detached mode
docker compose up -d --build

# View container logs
docker compose logs -f
```

The Docker container serves both the compiled Angular frontend and Express API on port `4000`.

---

## 🔒 Security Checklist Before Going Live

- [x] Change `JWT_SECRET` in `.env` to a strong, unpredictable value.
- [x] Update default `ADMIN_PASSWORD` via Admin Panel (*Settings tab*) or `.env`.
- [x] Verify SSL/TLS certificate is active.
- [x] Confirm `sitemap.xml` and `robots.txt` are reachable at `https://yourdomain.com/sitemap.xml`.
- [x] Ensure `.env` is never committed to git (ignored in `.gitignore`).
