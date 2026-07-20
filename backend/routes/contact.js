const router = require('express').Router();
const { read, write, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');

// POST /api/contact — public contact form
router.post('/', (req, res) => {
  const { name, email, phone = '', subject = '', message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });
  const messages = read('messages');
  const item = { id: nextId(messages), name, email, phone, subject, message, read: false, createdAt: new Date().toISOString() };
  messages.push(item);
  write('messages', messages);
  res.status(201).json({ ok: true });
});

// Admin: list / mark read / delete
router.get('/', requireAuth, (req, res) => {
  res.json(read('messages').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});
router.put('/:id/read', requireAuth, (req, res) => {
  const messages = read('messages');
  const m = messages.find(x => x.id === Number(req.params.id));
  if (!m) return res.status(404).json({ error: 'Message not found' });
  m.read = true; write('messages', messages); res.json(m);
});
router.delete('/:id', requireAuth, (req, res) => {
  write('messages', read('messages').filter(m => m.id !== Number(req.params.id)));
  res.json({ ok: true });
});

module.exports = router;
