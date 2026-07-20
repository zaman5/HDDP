// Seeds initial data on first run (blogs, Q&A). Existing data is never overwritten.
const bcrypt = require('bcryptjs');
const { read, write } = require('./db');
const { DEFAULT_ADMIN } = require('./config');

function seed() {
  // ---- Admin user ----
  const users = read('users');
  if (!users.length) {
    write('users', [{
      id: 1,
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      passwordHash: bcrypt.hashSync(DEFAULT_ADMIN.password, 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    }]);
    console.log('Seeded default admin:', DEFAULT_ADMIN.email);
  }

  // ---- Blogs ----
  const blogs = read('blogs');
  if (!blogs.length) {
    write('blogs', [
      {
        id: 1,
        slug: 'from-talent-to-team-hddps-seamless-recruitment-deployment-strategy',
        title: "From Talent to Team: HDDP's Seamless Recruitment & Deployment Strategy",
        excerpt: 'Finding the right candidate is just one piece of the puzzle. Discover how HDDP turns individual hires into high-performing teams through a seamless recruitment and deployment process.',
        coverImage: 'assets/img/blog-recruitment.jpg',
        author: 'HDDP Admin',
        published: true,
        createdAt: '2025-07-24T10:00:00.000Z',
        updatedAt: '2025-07-24T10:00:00.000Z',
        content: '<h2>Introduction</h2><p>Finding the right candidate is just one piece of the puzzle. At HDDP Consultants, we believe true value is created when talent is not only hired, but successfully deployed and integrated into your organization.</p><h2>Our Seamless Process</h2><p>Our Hiring, Development &amp; Deployment Process covers the full journey: talent sourcing, screening &amp; assessment, selection &amp; placement, and ongoing partnership. Each stage is designed to reduce time-to-hire while raising the quality of every placement.</p><h2>Why It Matters</h2><p>Organizations that treat recruitment and deployment as one connected strategy see faster onboarding, stronger retention, and better team performance. That is the HDDP difference.</p><p><em>Edit or replace this article any time from the Admin panel.</em></p>'
      },
      {
        id: 2,
        slug: 'why-global-talent-acquisition-is-the-future-of-healthcare-it',
        title: 'Why Global Talent Acquisition Is the Future of Healthcare & IT',
        excerpt: "In a world that's rapidly digitizing and globalizing, healthcare and IT organizations can no longer rely on local talent pools alone. Here's why global talent acquisition is the future.",
        coverImage: 'assets/img/blog-global-talent.jpg',
        author: 'HDDP Admin',
        published: true,
        createdAt: '2025-07-24T09:00:00.000Z',
        updatedAt: '2025-07-24T09:00:00.000Z',
        content: '<h2>Introduction</h2><p>In a world that is rapidly digitizing and globalizing, the demand for skilled professionals in healthcare and information technology has never been higher.</p><h2>The Case for Global Talent</h2><p>Global talent acquisition gives organizations access to wider skill pools, around-the-clock coverage, and diverse perspectives that drive innovation. Remote and hybrid work models have removed geographic barriers.</p><h2>How HDDP Helps</h2><p>With an extensive global talent network and a rigorous screening process, HDDP connects healthcare and IT organizations with professionals who are ready to perform from day one.</p><p><em>Edit or replace this article any time from the Admin panel.</em></p>'
      }
    ]);
    console.log('Seeded blogs');
  }

  // ---- Q&A ----
  const qa = read('qa');
  if (!qa.length) {
    write('qa', [
      { id: 1, question: 'What does HDDP stand for?', answer: 'HDDP stands for Hiring, Development & Deployment Process. We are consultants who manage the full talent lifecycle — from finding the right people to developing and deploying them successfully.', category: 'About Us', published: true, order: 1 },
      { id: 2, question: 'What services does HDDP Consultants offer?', answer: 'We offer four core solutions: Recruitment & Placement Services, Organizational Restructuring, Corporate Training Solutions, and HR Managed Services (including payroll, RPO, performance management, employee engagement, and HR technology integration).', category: 'Services', published: true, order: 2 },
      { id: 3, question: 'Which industries do you serve?', answer: 'Our expertise spans Healthcare, Information Technology, Banking & Financial Services, Consumer Goods & Retail, Travel & Transportation, and many other sectors.', category: 'Industries', published: true, order: 3 },
      { id: 4, question: 'How long has HDDP been in business?', answer: 'For over 25 years, our team has been at the forefront of connecting talent, strategy, and business insight to deliver transformative workforce solutions.', category: 'About Us', published: true, order: 4 },
      { id: 5, question: 'What is your recruitment process?', answer: 'Our process has four stages: 1) Talent Sourcing through our global network, 2) Screening & Assessment including technical, behavioral and background checks, 3) Selection & Placement with interview coordination and onboarding, and 4) Ongoing Partnership with regular follow-ups after placement.', category: 'Process', published: true, order: 5 },
      { id: 6, question: 'Do you offer remote and hybrid staffing?', answer: 'Yes. We provide Permanent Recruitment, Contract & Project-Based Staffing, Remote & Hybrid Staffing, Executive Search, and Managed Services — for on-site, remote, or hybrid work models.', category: 'Services', published: true, order: 6 },
      { id: 7, question: 'How can I apply for a job through HDDP?', answer: 'Visit our Careers / Apply Now page and submit your details and resume. Our recruiters will match your profile with open roles across our client network.', category: 'Careers', published: true, order: 7 },
      { id: 8, question: 'How do I contact HDDP Consultants?', answer: 'You can reach us at +1 (480) 712-2224, visit us at 808 N, 4th Ave, Unit 17, Phoenix, AZ 85003, or use the Get in Touch form on our website.', category: 'Contact', published: true, order: 8 }
    ]);
    console.log('Seeded Q&A');
  }

  // ---- Jobs ----
  const jobs = read('jobs');
  if (!jobs.length) {
    write('jobs', [
      { id: 1, title: 'Registered Nurse', department: 'Healthcare', location: 'Phoenix, AZ', type: 'Full-time', description: 'Provide direct patient care in a fast-paced clinical environment for one of our healthcare clients. Active RN license required.', open: true, postedAt: '2025-07-01T09:00:00.000Z', updatedAt: '2025-07-01T09:00:00.000Z' },
      { id: 2, title: 'Software Engineer', department: 'Information Technology', location: 'Remote', type: 'Full-time', description: 'Build and maintain web applications for our IT clients. Experience with JavaScript/TypeScript and REST APIs preferred.', open: true, postedAt: '2025-07-03T09:00:00.000Z', updatedAt: '2025-07-03T09:00:00.000Z' },
      { id: 3, title: 'HR Business Partner', department: 'HR Managed Services', location: 'Phoenix, AZ', type: 'Contract', description: 'Support HR operations, employee relations, and performance management programs for client organizations.', open: true, postedAt: '2025-07-05T09:00:00.000Z', updatedAt: '2025-07-05T09:00:00.000Z' }
    ]);
    console.log('Seeded jobs');
  }

  ['messages', 'applications', 'chatlogs'].forEach(n => { if (!read(n).length) write(n, []); });
}

module.exports = seed;
