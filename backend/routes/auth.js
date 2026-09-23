const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { read, write } = require('../db');
const { JWT_SECRET, JWT_EXPIRES } = require('../config');
const { requireAuth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rate-limiter');
const { validateBody } = require('../middleware/validator');

// Strict Schemas
const loginSchema = {
  email: { type: 'string', required: true, format: 'email', minLength: 5, maxLength: 254 },
  password: { type: 'string', required: true, minLength: 1, maxLength: 128 }
};

const changePasswordSchema = {
  currentPassword: { type: 'string', required: true, minLength: 1, maxLength: 128 },
  newPassword: { type: 'string', required: true, minLength: 8, maxLength: 128 }
};

// POST /api/auth/login
router.post('/login', authRateLimiter, validateBody(loginSchema), (req, res) => {
  const { email, password } = req.body;

  const user = read('users').find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    if (req.recordAuthFailure) req.recordAuthFailure(email);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Clear backoff tracking on successful authentication
  if (req.recordAuthSuccess) req.recordAuthSuccess(user.email);

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

// POST /api/auth/change-password
router.post('/change-password', requireAuth, authRateLimiter, validateBody(changePasswordSchema), (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const users = read('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
    if (req.recordAuthFailure) req.recordAuthFailure(req.user?.email);
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  if (req.recordAuthSuccess) req.recordAuthSuccess(user.email);

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  write('users', users);
  res.json({ ok: true });
});

module.exports = router;
