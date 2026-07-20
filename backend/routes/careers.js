const router = require('express').Router();
const { read, write, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { ACCELEREC_JOBS_URL, ACCELEREC_API_KEY } = require('../config');

// Public: live job openings, proxied from the Accelerec careers portal
// (keeps the API key server-side; cached briefly to avoid hammering the provider)
let liveJobsCache = { data: null, ts: 0 };
const LIVE_JOBS_TTL = 60 * 1000;

router.get('/live-jobs', async (req, res) => {
  if (liveJobsCache.data && Date.now() - liveJobsCache.ts < LIVE_JOBS_TTL) {
    return res.json(liveJobsCache.data);
  }
  try {
    const r = await fetch(ACCELEREC_JOBS_URL, { headers: { 'x-api-key': ACCELEREC_API_KEY } });
    const body = await r.json();
    if (!r.ok || !body.success) return res.status(502).json({ error: body.message || 'Could not load jobs' });
    liveJobsCache = { data: body.data, ts: Date.now() };
    res.json(body.data);
  } catch {
    res.status(502).json({ error: 'Could not reach careers provider' });
  }
});

// Public: list open jobs (or all, for admin, with ?all=1)
router.get('/jobs', (req, res) => {
  const all = read('jobs');
  const items = (req.query.all === '1' ? all : all.filter(j => j.open))
    .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  res.json(items);
});

// Admin: create job
router.post('/jobs', requireAuth, (req, res) => {
  const { title, department = '', location = '', type = 'Full-time', description = '', open = true } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const jobs = read('jobs');
  const job = {
    id: nextId(jobs), title, department, location, type, description, open: !!open,
    postedAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  jobs.push(job);
  write('jobs', jobs);
  res.status(201).json(job);
});

// Admin: update job
router.put('/jobs/:id', requireAuth, (req, res) => {
  const jobs = read('jobs');
  const job = jobs.find(j => j.id === Number(req.params.id));
  if (!job) return res.status(404).json({ error: 'Job not found' });
  ['title', 'department', 'location', 'type', 'description'].forEach(k => {
    if (req.body[k] !== undefined) job[k] = req.body[k];
  });
  if (req.body.open !== undefined) job.open = !!req.body.open;
  job.updatedAt = new Date().toISOString();
  write('jobs', jobs);
  res.json(job);
});

// Admin: delete job
router.delete('/jobs/:id', requireAuth, (req, res) => {
  let jobs = read('jobs');
  const before = jobs.length;
  jobs = jobs.filter(j => j.id !== Number(req.params.id));
  if (jobs.length === before) return res.status(404).json({ error: 'Job not found' });
  write('jobs', jobs);
  res.json({ ok: true });
});

// POST /api/careers/apply — public application form
router.post('/apply', (req, res) => {
  const { name, email, phone = '', position = '', linkedin = '', coverNote = '' } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  const apps = read('applications');
  const item = { id: nextId(apps), name, email, phone, position, linkedin, coverNote, status: 'new', createdAt: new Date().toISOString() };
  apps.push(item);
  write('applications', apps);
  res.status(201).json({ ok: true });
});

// Admin
router.get('/', requireAuth, (req, res) => {
  res.json(read('applications').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});
router.put('/:id/status', requireAuth, (req, res) => {
  const apps = read('applications');
  const a = apps.find(x => x.id === Number(req.params.id));
  if (!a) return res.status(404).json({ error: 'Application not found' });
  a.status = req.body.status || a.status;
  write('applications', apps);
  res.json(a);
});
router.delete('/:id', requireAuth, (req, res) => {
  write('applications', read('applications').filter(a => a.id !== Number(req.params.id)));
  res.json({ ok: true });
});

module.exports = router;
