const express = require('express');
const cors = require('cors');
const path = require('path');
const seed = require('./seed');
const { requireAuth } = require('./middleware/auth');
const { read } = require('./db');

seed();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/qa', require('./routes/qa'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/careers', require('./routes/careers'));

// Admin: chatbot logs + dashboard stats
app.get('/api/admin/chatlogs', requireAuth, (req, res) => res.json(read('chatlogs').slice(-200).reverse()));
app.get('/api/admin/stats', requireAuth, (req, res) => {
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

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'HDDP API' }));

// Serve Angular build directly when running as a standalone Node server (not on Vercel,
// where the built frontend is deployed as static output instead).
if (!process.env.VERCEL) {
  const distDir = path.join(__dirname, '..', 'frontend', 'dist', 'hddp-frontend', 'browser');
  app.use(express.static(distDir));
  app.get(/^(?!\/api).*/, (req, res, next) => {
    res.sendFile(path.join(distDir, 'index.html'), err => { if (err) next(); });
  });
}

module.exports = app;
