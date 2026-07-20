const router = require('express').Router();
const { read, write } = require('../db');
const knowledge = require('../knowledge');

const FALLBACK = "I'm the HDDP assistant and can answer questions about our services (Recruitment & Placement, Organizational Restructuring, Corporate Training, HR Managed Services), the industries we serve, our recruitment process, careers, and contact details. Could you rephrase your question, or call us at +1 (480) 712-2224?";

// POST /api/chatbot  { message: "..." }
router.post('/', (req, res) => {
  const message = String((req.body || {}).message || '').trim();
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const text = ' ' + message.toLowerCase() + ' ';
  let best = null, bestScore = 0;
  for (const entry of knowledge) {
    const score = entry.keywords.reduce((s, k) => s + (text.includes(k.toLowerCase()) ? k.length : 0), 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  const reply = best ? best.reply : FALLBACK;

  // Log conversation for admin review
  const logs = read('chatlogs');
  logs.push({ id: logs.length + 1, message, reply, at: new Date().toISOString() });
  write('chatlogs', logs.slice(-500)); // keep last 500

  res.json({ reply });
});

module.exports = router;
