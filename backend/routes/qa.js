const router = require('express').Router();
const { read, write, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { publicLimiter, authenticatedLimiter } = require('../middleware/rate-limiter');
const { validateBody, validateParams, idParamSchema } = require('../middleware/validator');

// Strict Schemas
const qaCreateSchema = {
  question: { type: 'string', required: true, minLength: 5, maxLength: 300 },
  answer: { type: 'string', required: true, minLength: 5, maxLength: 5000 },
  category: { type: 'string', required: false, minLength: 1, maxLength: 60 },
  published: { type: 'boolean', required: false },
  order: { type: 'integer', required: false, min: 0, max: 9999 }
};

const qaUpdateSchema = {
  question: { type: 'string', required: false, minLength: 5, maxLength: 300 },
  answer: { type: 'string', required: false, minLength: 5, maxLength: 5000 },
  category: { type: 'string', required: false, minLength: 1, maxLength: 60 },
  published: { type: 'boolean', required: false },
  order: { type: 'integer', required: false, min: 0, max: 9999 }
};

// Public: published Q&A
router.get('/', publicLimiter, (req, res) => {
  const all = read('qa');
  const items = (req.query.all === '1' ? all : all.filter(q => q.published))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(items);
});

// Admin: create
router.post('/', requireAuth, authenticatedLimiter, validateBody(qaCreateSchema), (req, res) => {
  const { question, answer, category = 'General', published = true, order = 0 } = req.body;
  const qa = read('qa');
  const item = {
    id: nextId(qa),
    question: question.trim(),
    answer: answer.trim(),
    category: category ? category.trim() : 'General',
    published: Boolean(published),
    order: Number(order) || qa.length + 1
  };
  qa.push(item);
  write('qa', qa);
  res.status(201).json(item);
});

// Admin: update
router.put('/:id', requireAuth, authenticatedLimiter, validateParams(idParamSchema), validateBody(qaUpdateSchema), (req, res) => {
  const qa = read('qa');
  const item = qa.find(q => q.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Q&A item not found' });

  const { question, answer, category, published, order } = req.body;
  if (question !== undefined) item.question = question.trim();
  if (answer !== undefined) item.answer = answer.trim();
  if (category !== undefined) item.category = category.trim();
  if (published !== undefined) item.published = Boolean(published);
  if (order !== undefined) item.order = Number(order);

  write('qa', qa);
  res.json(item);
});

// Admin: delete
router.delete('/:id', requireAuth, authenticatedLimiter, validateParams(idParamSchema), (req, res) => {
  let qa = read('qa');
  const before = qa.length;
  qa = qa.filter(q => q.id !== Number(req.params.id));
  if (qa.length === before) return res.status(404).json({ error: 'Q&A item not found' });
  write('qa', qa);
  res.json({ ok: true });
});

module.exports = router;
