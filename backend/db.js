// Simple JSON-file database. Swap with MongoDB/MySQL later if needed.
const fs = require('fs');
const path = require('path');
const SEED_DIR = path.join(__dirname, 'data');
// Vercel's filesystem is read-only outside /tmp, so writes go there instead of the bundled seed dir.
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : SEED_DIR;
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function read(name, fallback = []) {
  try {
    const file = path.join(DATA_DIR, name + '.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    const seedFile = path.join(SEED_DIR, name + '.json');
    if (DATA_DIR !== SEED_DIR && fs.existsSync(seedFile)) {
      return JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    }
    return fallback;
  } catch (err) {
    console.error(`[DB Error] Failed to read database collection '${name}':`, err.message);
    return fallback;
  }
}

function write(name, data) {
  try {
    fs.writeFileSync(path.join(DATA_DIR, name + '.json'), JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`[DB Error] Failed to write database collection '${name}':`, err);
    throw new Error('Database operation failed');
  }
}
function nextId(items) { return items && items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }

module.exports = { read, write, nextId };
