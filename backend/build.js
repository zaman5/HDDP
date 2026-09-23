/**
 * HDDP Backend Production Build Script
 * Bundles and minifies the Express backend with esbuild for high-performance production deployment.
 */
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  const startTime = Date.now();
  console.log('\n📦 Starting HDDP Backend Production Build...\n');

  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Ensure data directory exists
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    const result = await esbuild.build({
      entryPoints: [path.join(__dirname, 'server.js')],
      bundle: true,
      platform: 'node',
      target: 'node20',
      outfile: path.join(distDir, 'server.js'),
      format: 'cjs',
      minify: true,
      sourcemap: true,
      sourcesContent: false,
      external: [
        // Keep native / optional node external dependencies if needed
        'bcryptjs'
      ],
      metafile: true
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const outFile = path.join(distDir, 'server.js');
    const stats = fs.statSync(outFile);
    const sizeKb = (stats.size / 1024).toFixed(1);

    console.log(`✔ Backend build succeeded!`);
    console.log(`  - Output: ${outFile} (${sizeKb} KB)`);
    console.log(`  - Duration: ${elapsed}s`);
    console.log(`  - Node Target: Node 20+`);
    console.log(`\n🚀 To run the production build:`);
    console.log(`  node backend/dist/server.js\n`);
  } catch (err) {
    console.error('❌ Backend build failed:', err);
    process.exit(1);
  }
}

build();
