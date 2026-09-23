const express = require('express');
const cors = require('cors');
const path = require('path');
const seed = require('./seed');
const { requireAuth } = require('./middleware/auth');
const { read } = require('./db');
const {
  publicLimiter,
  interactiveLimiter,
  authenticatedLimiter
} = require('./middleware/rate-limiter');

seed();

const app = express();
app.use(cors());

// Parse JSON with payload size limit & guard against malformed JSON stack dumps
app.use(express.json({ limit: '5mb' }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(`[Bad Request - JSON Syntax Error] ${req.method} ${req.originalUrl}:`, err.message);
    return res.status(400).json({ error: 'Invalid or malformed JSON payload' });
  }
  next(err);
});

// 1. Auth routes (with dedicated per-IP & per-Account exponential backoff rate limiter)
app.use('/api/auth', require('./routes/auth'));

// 2. Interactive public endpoints (Chatbot & Contact form submissions)
app.use('/api/chatbot', interactiveLimiter, require('./routes/chatbot'));
app.use('/api/contact', require('./routes/contact')); // contact router handles POST (interactive) & GET/PUT/DELETE (admin)

// 3. General public & content endpoints (Blogs, QA, Careers)
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/qa', require('./routes/qa'));
app.use('/api/careers', require('./routes/careers'));

// 4. Admin routes: chatbot logs + dashboard stats (with looser authenticated rate limits)
app.get('/api/admin/chatlogs', requireAuth, authenticatedLimiter, (req, res) => {
  res.json(read('chatlogs').slice(-200).reverse());
});

app.get('/api/admin/stats', requireAuth, authenticatedLimiter, (req, res) => {
  res.json({
    blogs: read('blogs').length,
    qa: read('qa').length,
    jobs: read('jobs').filter(j => j.open).length,
    messages: read('messages').length,
    unreadMessages: read('messages').filter(m => !m.read).length,
    applications: read('applications').length,
    chats: read('chatlogs').length
  });
});

// Health check with public limiter
app.get('/api/health', publicLimiter, (req, res) => res.json({ ok: true, service: 'HDDP API' }));

// Dynamic XML Sitemap for SEO Crawlers
app.get('/sitemap.xml', publicLimiter, (req, res) => {
  const domain = 'https://hddpconsultants.com';
  const now = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/who-we-are', priority: '0.8', changefreq: 'monthly' },
    { url: '/how-we-work', priority: '0.8', changefreq: 'monthly' },
    { url: '/get-in-touch', priority: '0.8', changefreq: 'monthly' },
    { url: '/careers', priority: '0.9', changefreq: 'daily' },
    { url: '/apply-now', priority: '0.9', changefreq: 'daily' },
    { url: '/qa', priority: '0.7', changefreq: 'weekly' },
    { url: '/recruitment-placement-services', priority: '0.9', changefreq: 'monthly' },
    { url: '/organizational-restructuring', priority: '0.9', changefreq: 'monthly' },
    { url: '/corporate-training-solutions', priority: '0.9', changefreq: 'monthly' },
    { url: '/hr-managed-services', priority: '0.9', changefreq: 'monthly' },
    { url: '/healthcare', priority: '0.85', changefreq: 'monthly' },
    { url: '/information-technology', priority: '0.85', changefreq: 'monthly' },
    { url: '/banking-financial-services', priority: '0.85', changefreq: 'monthly' },
    { url: '/consumer-goods-retail', priority: '0.85', changefreq: 'monthly' },
    { url: '/travel-transportation', priority: '0.85', changefreq: 'monthly' },
    { url: '/industries-we-serve', priority: '0.85', changefreq: 'monthly' },
    { url: '/blogs', priority: '0.8', changefreq: 'weekly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  for (const r of staticRoutes) {
    xml += `  <url>\n    <loc>${domain}${r.url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
  }

  // Add all published blog posts dynamically
  const blogs = read('blogs', []);
  for (const b of blogs) {
    if (b.published) {
      const lastmod = b.updatedAt ? b.updatedAt.split('T')[0] : (b.createdAt ? b.createdAt.split('T')[0] : now);
      xml += `  <url>\n    <loc>${domain}/blogs/${encodeURIComponent(b.slug || b.id)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.75</priority>\n  </url>\n`;
    }
  }

  xml += `</urlset>\n`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Handle unhandled API routes with clean JSON response
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Centralized Global Error Handler
// Ensures users never see stack traces, internal paths, or raw DB errors
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`, {
    message: err.message,
    stack: err.stack
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = typeof err.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500;
  const clientMessage = statusCode < 500 ? (err.message || 'Bad Request') : 'An unexpected error occurred. Please try again later.';

  res.status(statusCode).json({ error: clientMessage });
});

// Serve Angular build directly when running as a standalone Node server
if (!process.env.VERCEL) {
  const distDir = path.join(__dirname, '..', 'frontend', 'dist', 'hddp-frontend', 'browser');
  app.use(express.static(distDir));
  app.get(/^(?!\/api).*/, (req, res, next) => {
    res.sendFile(path.join(distDir, 'index.html'), err => { if (err) next(); });
  });
}

module.exports = app;
