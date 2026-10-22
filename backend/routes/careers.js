const router = require('express').Router();
const { read, write, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { ACCELEREC_JOBS_URL, ACCELEREC_API_KEY } = require('../config');
const { publicLimiter, interactiveLimiter, authenticatedLimiter } = require('../middleware/rate-limiter');
const { validateBody, validateParams, idParamSchema } = require('../middleware/validator');

// Strict Schemas
const applySchema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
  email: { type: 'string', required: true, format: 'email', minLength: 5, maxLength: 254 },
  phone: { type: 'string', required: false, maxLength: 30 },
  position: { type: 'string', required: false, maxLength: 120 },
  linkedin: { type: 'string', required: false, format: 'url', maxLength: 300 },
  coverNote: { type: 'string', required: false, maxLength: 3000 }
};

const jobCreateSchema = {
  title: { type: 'string', required: true, minLength: 3, maxLength: 150 },
  department: { type: 'string', required: false, maxLength: 100 },
  location: { type: 'string', required: false, maxLength: 100 },
  type: { type: 'string', required: false, maxLength: 60 },
  description: { type: 'string', required: false, maxLength: 10000 },
  open: { type: 'boolean', required: false }
};

const jobUpdateSchema = {
  title: { type: 'string', required: false, minLength: 3, maxLength: 150 },
  department: { type: 'string', required: false, maxLength: 100 },
  location: { type: 'string', required: false, maxLength: 100 },
  type: { type: 'string', required: false, maxLength: 60 },
  description: { type: 'string', required: false, maxLength: 10000 },
  open: { type: 'boolean', required: false }
};

const appStatusSchema = {
  status: { type: 'string', required: true, enum: ['new', 'shortlisted', 'interview', 'hired', 'rejected'] }
};

const fs = require('fs');
const path = require('path');
const CACHE_FILE = path.join(__dirname, '../data/jobs_cache.json');

// Public: live job openings, proxied from the Accelerec careers portal
let liveJobsCache = { data: null, ts: 0 };
const LIVE_JOBS_TTL = 60 * 1000;

try {
  if (fs.existsSync(CACHE_FILE)) {
    liveJobsCache.data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    liveJobsCache.ts = Date.now();
  }
} catch (e) {}

async function fetchAccelerecJobs() {
  if (liveJobsCache.data && Date.now() - liveJobsCache.ts < LIVE_JOBS_TTL) {
    return liveJobsCache.data;
  }
  const key = ACCELEREC_API_KEY;
  if (!key || key === 'SECRET_API_KEY' || key === 'YOUR_API_KEY') {
    return liveJobsCache.data || null;
  }
  const url = ACCELEREC_JOBS_URL || 'https://portal.accelerec.com/api/v1/organization/jobs';
  try {
    const r = await fetch(url, { headers: { 'x-api-key': key } });
    const body = await r.json();
    if (!r.ok || !body.success) {
      throw new Error(body?.message || `Accelerec HTTP ${r.status}`);
    }
    liveJobsCache = { data: body.data, ts: Date.now() };
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(body.data, null, 2));
    } catch (e) {}
    return body.data;
  } catch (err) {
    if (liveJobsCache.data) {
      console.warn('[Accelerec API Warning] Using cached jobs due to fetch failure:', err.message);
      return liveJobsCache.data;
    }
    throw err;
  }
}

router.get('/live-jobs', publicLimiter, async (req, res) => {
  const key = ACCELEREC_API_KEY;
  const isKeyPending = !key || key === 'SECRET_API_KEY' || key === 'YOUR_API_KEY';
  if (isKeyPending) {
    return res.json({
      success: true,
      pendingKey: true,
      message: 'Contact support to get your API key and enable API access. Please use the embedded iFrame option.',
      data: []
    });
  }
  try {
    const data = await fetchAccelerecJobs();
    res.json(data);
  } catch (err) {
    console.error('[Accelerec API Error]', err.message);
    if (liveJobsCache.data) {
      return res.json(liveJobsCache.data);
    }
    res.status(502).json({ error: 'Could not load live job openings from Accelerec at this time.' });
  }
});

// Public: list open jobs (returns Accelerec live jobs by default, or internal fallback)
router.get('/jobs', publicLimiter, async (req, res) => {
  if (req.query.internal === '1' || req.query.all === '1') {
    const all = read('jobs');
    const items = (req.query.all === '1' ? all : all.filter(j => j.open))
      .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    return res.json(items);
  }
  try {
    const live = await fetchAccelerecJobs();
    if (live && live.length) {
      return res.json(live);
    }
  } catch (err) {
    console.error('[Jobs Endpoint Error]', err.message);
  }
  const all = read('jobs');
  const items = all.filter(j => j.open).sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  res.json(items);
});

// Admin: create job
router.post('/jobs', requireAuth, authenticatedLimiter, validateBody(jobCreateSchema), (req, res) => {
  const { title, department = '', location = '', type = 'Full-time', description = '', open = true } = req.body;
  const jobs = read('jobs');
  const job = {
    id: nextId(jobs),
    title: title.trim(),
    department: department ? department.trim() : '',
    location: location ? location.trim() : '',
    type: type ? type.trim() : 'Full-time',
    description: description ? description.trim() : '',
    open: Boolean(open),
    postedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  jobs.push(job);
  write('jobs', jobs);
  res.status(201).json(job);
});

// Admin: update job
router.put('/jobs/:id', requireAuth, authenticatedLimiter, validateParams(idParamSchema), validateBody(jobUpdateSchema), (req, res) => {
  const jobs = read('jobs');
  const job = jobs.find(j => j.id === Number(req.params.id));
  if (!job) return res.status(404).json({ error: 'Job not found' });

  ['title', 'department', 'location', 'type', 'description'].forEach(k => {
    if (req.body[k] !== undefined) job[k] = typeof req.body[k] === 'string' ? req.body[k].trim() : req.body[k];
  });
  if (req.body.open !== undefined) job.open = Boolean(req.body.open);
  job.updatedAt = new Date().toISOString();
  write('jobs', jobs);
  res.json(job);
});

// Admin: delete job
router.delete('/jobs/:id', requireAuth, authenticatedLimiter, validateParams(idParamSchema), (req, res) => {
  let jobs = read('jobs');
  const before = jobs.length;
  jobs = jobs.filter(j => j.id !== Number(req.params.id));
  if (jobs.length === before) return res.status(404).json({ error: 'Job not found' });
  write('jobs', jobs);
  res.json({ ok: true });
});

// POST /api/careers/apply — public application form (interactive rate limiter + strict validation)
router.post('/apply', interactiveLimiter, validateBody(applySchema), (req, res) => {
  const { name, email, phone = '', position = '', linkedin = '', coverNote = '' } = req.body;
  const apps = read('applications');
  const item = {
    id: nextId(apps),
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    position: position ? position.trim() : '',
    linkedin: linkedin ? linkedin.trim() : '',
    coverNote: coverNote ? coverNote.trim() : '',
    status: 'new',
    createdAt: new Date().toISOString()
  };
  apps.push(item);
  write('applications', apps);
  res.status(201).json({ ok: true });
});

// Admin: list applications
router.get('/', requireAuth, authenticatedLimiter, (req, res) => {
  res.json(read('applications').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Admin: update application status
router.put('/:id/status', requireAuth, authenticatedLimiter, validateParams(idParamSchema), validateBody(appStatusSchema), (req, res) => {
  const apps = read('applications');
  const a = apps.find(x => x.id === Number(req.params.id));
  if (!a) return res.status(404).json({ error: 'Application not found' });
  a.status = req.body.status;
  write('applications', apps);
  res.json(a);
});

// Admin: delete application
router.delete('/:id', requireAuth, authenticatedLimiter, validateParams(idParamSchema), (req, res) => {
  write('applications', read('applications').filter(a => a.id !== Number(req.params.id)));
  res.json({ ok: true });
});

router.getLiveJobsCount = async () => {
  try {
    const list = await fetchAccelerecJobs();
    return Array.isArray(list) ? list.length : 0;
  } catch (e) {
    return liveJobsCache.data?.length || 0;
  }
};

module.exports = router;
