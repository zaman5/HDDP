const router = require('express').Router();
const { read, write, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { interactiveLimiter, authenticatedLimiter } = require('../middleware/rate-limiter');
const { validateBody, validateParams, idParamSchema } = require('../middleware/validator');

const contactSchema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
  email: { type: 'string', required: true, format: 'email', minLength: 5, maxLength: 254 },
  phone: { type: 'string', required: false, format: 'phone', maxLength: 30 },
  subject: { type: 'string', required: false, maxLength: 150 },
  message: { type: 'string', required: true, minLength: 5, maxLength: 5000 }
};

// POST /api/contact — public contact form (interactive limiter + strict schema)
router.post('/', interactiveLimiter, validateBody(contactSchema), (req, res) => {
  const { name, email, phone = '', subject = '', message } = req.body;
  const messages = read('messages');
  const item = {
    id: nextId(messages),
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    subject: subject ? subject.trim() : '',
    message: message.trim(),
    read: false,
    createdAt: new Date().toISOString()
  };
  messages.push(item);
  write('messages', messages);
  res.status(201).json({ ok: true });
});

// Admin: list / mark read / delete (authenticated limiter + param validation)
router.get('/', requireAuth, authenticatedLimiter, (req, res) => {
  res.json(read('messages').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.put('/:id/read', requireAuth, authenticatedLimiter, validateParams(idParamSchema), (req, res) => {
  const messages = read('messages');
  const m = messages.find(x => x.id === Number(req.params.id));
  if (!m) return res.status(404).json({ error: 'Message not found' });
  m.read = true;
  write('messages', messages);
  res.json(m);
});

router.delete('/:id', requireAuth, authenticatedLimiter, validateParams(idParamSchema), (req, res) => {
  write('messages', read('messages').filter(m => m.id !== Number(req.params.id)));
  res.json({ ok: true });
});

module.exports = router;
