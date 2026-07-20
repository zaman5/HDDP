const router = require('express').Router();
const { read, write, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');

// Public: published Q&A
router.get('/', (req, res) => {
  const all = read('qa');
  const items = (req.query.all === '1' ? all : all.filter(q => q.published))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(items);
});

router.post('/', requireAuth, (req, res) => {
  const { question, answer, category = 'General', published = true, order = 0 } = req.body || {};
  if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });
  const qa = read('qa');
  const item = { id: nextId(qa), question, answer, category, published: !!published, order: Number(order) || qa.length + 1 };
  qa.push(item);
  write('qa', qa);
  res.status(201).json(item);
});

router.put('/:id', requireAuth, (req, res) => {
  const qa = read('qa');
  const item = qa.find(q => q.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Q&A item not found' });
  ['question', 'answer', 'category', 'published', 'order'].forEach(k => {
    if (req.body[k] !== undefined) item[k] = k === 'published' ? !!req.body[k] : req.body[k];
  });
  write('qa', qa);
  res.json(item);
});

router.delete('/:id', requireAuth, (req, res) => {
  let qa = read('qa');
  const before = qa.length;
  qa = qa.filter(q => q.id !== Number(req.params.id));
  if (qa.length === before) return res.status(404).json({ error: 'Q&A item not found' });
  write('qa', qa);
  res.json({ ok: true });
});

module.exports = router;
