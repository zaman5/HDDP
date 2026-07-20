const router = require('express').Router();
const { read, write, nextId } = require('../db');
const { requireAuth } = require('../middleware/auth');

const slugify = s => String(s).toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 90);

// Public: list published blogs
router.get('/', (req, res) => {
  const all = read('blogs');
  const isAdmin = req.query.all === '1';
  const items = (isAdmin ? all : all.filter(b => b.published))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(items.map(({ content, ...rest }) => rest));
});

// Public: single blog by slug or id
router.get('/:slugOrId', (req, res) => {
  const blogs = read('blogs');
  const p = req.params.slugOrId;
  const blog = blogs.find(b => b.slug === p || String(b.id) === p);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

// Admin: create
router.post('/', requireAuth, (req, res) => {
  const { title, excerpt = '', content = '', coverImage = '', published = false } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const blogs = read('blogs');
  let slug = slugify(title);
  if (blogs.some(b => b.slug === slug)) slug += '-' + Date.now();
  const blog = {
    id: nextId(blogs), slug, title, excerpt, content, coverImage,
    author: req.user.name, published: !!published,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  blogs.push(blog);
  write('blogs', blogs);
  res.status(201).json(blog);
});

// Admin: update
router.put('/:id', requireAuth, (req, res) => {
  const blogs = read('blogs');
  const blog = blogs.find(b => b.id === Number(req.params.id));
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  const { title, excerpt, content, coverImage, published } = req.body || {};
  if (title !== undefined) { blog.title = title; }
  if (excerpt !== undefined) blog.excerpt = excerpt;
  if (content !== undefined) blog.content = content;
  if (coverImage !== undefined) blog.coverImage = coverImage;
  if (published !== undefined) blog.published = !!published;
  blog.updatedAt = new Date().toISOString();
  write('blogs', blogs);
  res.json(blog);
});

// Admin: delete
router.delete('/:id', requireAuth, (req, res) => {
  let blogs = read('blogs');
  const before = blogs.length;
  blogs = blogs.filter(b => b.id !== Number(req.params.id));
  if (blogs.length === before) return res.status(404).json({ error: 'Blog not found' });
  write('blogs', blogs);
  res.json({ ok: true });
});

module.exports = router;
