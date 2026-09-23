const { RATE_LIMITS } = require('../config');

// In-memory state storage
const ipWindowStore = new Map();
const authBackoffStore = new Map();

/**
 * Extract client IP safely from request
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    if (ips.length > 0) return ips[0];
  }
  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
}

/**
 * Generic sliding window rate limiter
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60000;
  const max = options.max || 100;
  const keyGenerator = options.keyGenerator || (req => getClientIp(req));
  const message = options.message || 'Too many requests, please try again later.';

  return function rateLimiterMiddleware(req, res, next) {
    const key = `${options.prefix || 'rl'}:${keyGenerator(req)}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    let timestamps = ipWindowStore.get(key) || [];
    // Filter timestamps within the current window
    timestamps = timestamps.filter(t => t > windowStart);

    const remaining = Math.max(0, max - (timestamps.length + 1));
    const oldest = timestamps.length > 0 ? timestamps[0] : now;
    const resetTimeSec = Math.ceil((oldest + windowMs) / 1000);

    // Standard RateLimit HTTP headers (IETF draft standard)
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetTimeSec);

    if (timestamps.length >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: message,
        retryAfterSeconds: retryAfterSec,
        tier: options.tier || 'standard'
      });
    }

    timestamps.push(now);
    ipWindowStore.set(key, timestamps);
    next();
  };
}

/**
 * Authentication Rate Limiter with Per-IP, Per-Account limits and Exponential Backoff
 */
function authRateLimiter(req, res, next) {
  const cfg = RATE_LIMITS.AUTH;
  const now = Date.now();
  const windowStart = now - cfg.WINDOW_MS;
  const ip = getClientIp(req);

  // Extract account identifier if provided (e.g. from login body or token)
  const rawEmail = req.body?.email || req.user?.email;
  const account = rawEmail ? String(rawEmail).toLowerCase().trim() : null;

  const ipKey = `auth_ip:${ip}`;
  const accountKey = account ? `auth_acc:${account}` : null;

  const getRecord = (k) => {
    let rec = authBackoffStore.get(k);
    if (!rec) {
      rec = { attempts: [], failures: 0, unlockAt: 0, lastFailedAt: 0 };
      authBackoffStore.set(k, rec);
    }
    // Clean window attempts
    rec.attempts = rec.attempts.filter(t => t > windowStart);
    return rec;
  };

  const ipRecord = getRecord(ipKey);
  const accountRecord = accountKey ? getRecord(accountKey) : null;

  // 1. Check Exponential Backoff Lockout (Per-IP or Per-Account)
  const isIpLocked = ipRecord.unlockAt > now;
  const isAccountLocked = accountRecord && accountRecord.unlockAt > now;

  if (isIpLocked || isAccountLocked) {
    const unlockAt = Math.max(ipRecord.unlockAt || 0, accountRecord?.unlockAt || 0);
    const retryAfterSec = Math.max(1, Math.ceil((unlockAt - now) / 1000));
    res.setHeader('Retry-After', retryAfterSec);
    res.setHeader('RateLimit-Limit', cfg.MAX_IP);
    res.setHeader('RateLimit-Remaining', 0);
    return res.status(429).json({
      error: `Too many failed authentication attempts. Please try again in ${retryAfterSec} second(s).`,
      retryAfterSeconds: retryAfterSec,
      backoff: true,
      tier: 'auth'
    });
  }

  // 2. Check Window Burst Limits (Per-IP and Per-Account)
  if (ipRecord.attempts.length >= cfg.MAX_IP || (accountRecord && accountRecord.attempts.length >= cfg.MAX_ACCOUNT)) {
    const oldest = ipRecord.attempts[0] || now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + cfg.WINDOW_MS - now) / 1000));
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({
      error: 'Authentication request limit exceeded. Please wait before trying again.',
      retryAfterSeconds: retryAfterSec,
      tier: 'auth'
    });
  }

  // Track attempt
  ipRecord.attempts.push(now);
  if (accountRecord) accountRecord.attempts.push(now);

  const remaining = Math.max(0, cfg.MAX_IP - ipRecord.attempts.length);
  res.setHeader('RateLimit-Limit', cfg.MAX_IP);
  res.setHeader('RateLimit-Remaining', remaining);

  // Attach recordFailure & recordSuccess methods for routes to invoke
  req.recordAuthFailure = (explicitAccount) => {
    const currentNow = Date.now();
    const acc = (explicitAccount || account);
    const accKey = acc ? `auth_acc:${String(acc).toLowerCase().trim()}` : accountKey;
    const targets = [ipRecord];
    if (accKey) targets.push(getRecord(accKey));

    targets.forEach(rec => {
      rec.failures += 1;
      rec.lastFailedAt = currentNow;
      if (rec.failures >= cfg.FREE_ATTEMPTS) {
        // Exponential backoff: baseDelay * 2^(failures - freeAttempts)
        const backoffMultiplier = Math.pow(2, rec.failures - cfg.FREE_ATTEMPTS);
        const delaySec = Math.min(cfg.MAX_DELAY_SEC, cfg.BASE_DELAY_SEC * backoffMultiplier);
        rec.unlockAt = currentNow + (delaySec * 1000);
      }
    });
  };

  req.recordAuthSuccess = (explicitAccount) => {
    const acc = (explicitAccount || account);
    const accKey = acc ? `auth_acc:${String(acc).toLowerCase().trim()}` : accountKey;
    const targets = [ipRecord];
    if (accKey) targets.push(getRecord(accKey));

    targets.forEach(rec => {
      rec.failures = 0;
      rec.unlockAt = 0;
    });
  };

  next();
}

/**
 * Public Tier Limiter (moderate limits for read endpoints)
 */
const publicLimiter = createRateLimiter({
  prefix: 'public',
  tier: 'public',
  windowMs: RATE_LIMITS.PUBLIC.WINDOW_MS,
  max: RATE_LIMITS.PUBLIC.MAX,
  message: 'Public API rate limit exceeded. Please slow down your requests.'
});

/**
 * Public Interactive Tier Limiter (Chatbot, Contact forms)
 */
const interactiveLimiter = createRateLimiter({
  prefix: 'interactive',
  tier: 'public_interactive',
  windowMs: RATE_LIMITS.PUBLIC_INTERACTIVE.WINDOW_MS,
  max: RATE_LIMITS.PUBLIC_INTERACTIVE.MAX,
  message: 'Interaction limit reached. Please wait a moment before sending another message.'
});

/**
 * Authenticated User Tier Limiter (Admin operations, high throughput)
 */
const authenticatedLimiter = createRateLimiter({
  prefix: 'authed',
  tier: 'authenticated',
  windowMs: RATE_LIMITS.AUTHENTICATED.WINDOW_MS,
  max: RATE_LIMITS.AUTHENTICATED.MAX,
  keyGenerator: req => req.user?.id ? `user_${req.user.id}` : getClientIp(req),
  message: 'Authenticated action rate limit reached.'
});

// Periodic memory garbage collection (every 5 minutes)
const gcInterval = setInterval(() => {
  const now = Date.now();
  const maxLifetime = Math.max(
    RATE_LIMITS.AUTH.WINDOW_MS,
    RATE_LIMITS.PUBLIC.WINDOW_MS,
    RATE_LIMITS.AUTHENTICATED.WINDOW_MS
  ) * 2;

  // Clean sliding window store
  for (const [key, timestamps] of ipWindowStore.entries()) {
    const valid = timestamps.filter(t => t > (now - maxLifetime));
    if (valid.length === 0) ipWindowStore.delete(key);
    else ipWindowStore.set(key, valid);
  }

  // Clean auth backoff store
  for (const [key, record] of authBackoffStore.entries()) {
    const isExpired = record.unlockAt <= now &&
      record.attempts.length === 0 &&
      (now - record.lastFailedAt > maxLifetime);
    if (isExpired) authBackoffStore.delete(key);
  }
}, 5 * 60 * 1000);

if (gcInterval.unref) gcInterval.unref();

module.exports = {
  createRateLimiter,
  authRateLimiter,
  publicLimiter,
  interactiveLimiter,
  authenticatedLimiter
};
