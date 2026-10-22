module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 4000,
  JWT_SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('JWT_SECRET environment variable is required in production'); })() : 'development-ephemeral-jwt-secret-key-12345'),
  JWT_EXPIRES: process.env.JWT_EXPIRES || '12h',
  DEFAULT_ADMIN: {
    email: process.env.ADMIN_EMAIL || 'admin@hddpconsultants.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    name: process.env.ADMIN_NAME || 'HDDP Admin'
  },
  ACCELEREC_JOBS_URL: process.env.ACCELEREC_JOBS_URL || 'https://portal.accelerec.com/api/v1/organization/jobs',
  ACCELEREC_API_KEY: process.env.ACCELEREC_API_KEY || '',


  // ===== Configurable Rate Limiting Thresholds =====
  RATE_LIMITS: {
    // 1. Authentication Tier (Login, Change-Password)
    // Stricter limits using a combination of per-IP and per-Account with exponential backoff
    AUTH: {
      WINDOW_MS: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes window
      MAX_IP: parseInt(process.env.RATE_LIMIT_AUTH_MAX_IP, 10) || 20, // Max attempts per IP in window
      MAX_ACCOUNT: parseInt(process.env.RATE_LIMIT_AUTH_MAX_ACCOUNT, 10) || 10, // Max attempts per account in window
      FREE_ATTEMPTS: parseInt(process.env.RATE_LIMIT_AUTH_FREE_ATTEMPTS, 10) || 3, // Allowed initial failed attempts before backoff
      BASE_DELAY_SEC: parseInt(process.env.RATE_LIMIT_AUTH_BASE_DELAY_SEC, 10) || 2, // Base backoff delay (2s, 4s, 8s, 16s...)
      MAX_DELAY_SEC: parseInt(process.env.RATE_LIMIT_AUTH_MAX_DELAY_SEC, 10) || 900 // Max backoff delay (15 min)
    },

    // 2. Public Read Endpoints (/api/blogs, /api/qa, /api/careers, /api/health)
    // Moderate limits to prevent scraping and abuse
    PUBLIC: {
      WINDOW_MS: parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS, 10) || 60 * 1000, // 1 minute window
      MAX: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX, 10) || 120 // 120 requests per minute
    },

    // 3. Public Interactive Endpoints (/api/chatbot, /api/contact)
    // Target burst limits for AI chat and message forms
    PUBLIC_INTERACTIVE: {
      WINDOW_MS: parseInt(process.env.RATE_LIMIT_INTERACTIVE_WINDOW_MS, 10) || 60 * 1000, // 1 minute window
      MAX: parseInt(process.env.RATE_LIMIT_INTERACTIVE_MAX, 10) || 30 // 30 requests per minute
    },

    // 4. Authenticated User Actions (/api/admin/*, CRUD operations)
    // Looser limits for legitimate administrative operations
    AUTHENTICATED: {
      WINDOW_MS: parseInt(process.env.RATE_LIMIT_AUTHED_WINDOW_MS, 10) || 60 * 1000, // 1 minute window
      MAX: parseInt(process.env.RATE_LIMIT_AUTHED_MAX, 10) || 400 // 400 requests per minute
    }
  }
};
