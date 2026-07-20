module.exports = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-in-production',
  JWT_EXPIRES: '12h',
  DEFAULT_ADMIN: {
    email: 'admin@hddpconsultants.com',
    password: 'Admin@123',
    name: 'HDDP Admin'
  },
  ACCELEREC_JOBS_URL: process.env.ACCELEREC_JOBS_URL || 'https://portal.accelerec.com/api/v1/organization/jobs',
  ACCELEREC_API_KEY: process.env.ACCELEREC_API_KEY || '830937qslqv076a9c37d3'
};
