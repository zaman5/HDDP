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

// Public: live job openings, proxied from the Accelerec careers portal
let liveJobsCache = { data: null, ts: 0 };
const LIVE_JOBS_TTL = 60 * 1000;

router.get('/live-jobs', publicLimiter, async (req, res) => {
  if (liveJobsCache.data && Date.now() - liveJobsCache.ts < LIVE_JOBS_TTL) {
    return res.json(liveJobsCache.data);
  }
  if (!ACCELEREC_API_KEY) {
    return res.json([]);
  }
  try {
    const r = await fetch(ACCELEREC_JOBS_URL, { headers: { 'x-api-key': ACCELEREC_API_KEY } });
    const body = await r.json();
    if (!r.ok || !body.success) {
      console.error('[Accelerec API Error]', body?.message || r.statusText);
      return res.status(502).json({ error: 'Could not load live job openings at this time.' });
    }
    liveJobsCache = { data: body.data, ts: Date.now() };
    res.json(body.data);
  } catch (err) {
    console.error('[Careers Provider Error]', err);
    res.status(502).json({ error: 'Could not reach careers provider at this time.' });
  }
});

// Public: list open jobs (or all, for admin, with ?all=1)
router.get('/jobs', publicLimiter, (req, res) => {
  const all = read('jobs');
  const items = (req.query.all === '1' ? all : all.filter(j => j.open))
    .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
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

module.exports = router;
