/**
 * Bundle size budget checker
 *
 * Reads the Vite build output from dist/assets/ and checks each
 * chunk against its size budget. Uses gzip-compressed size to
 * approximate transfer size (matching Lighthouse budgets).
 *
 * Usage: node scripts/check-bundle-size.mjs
 * Exit code: 0 (pass) or 1 (fail)
 */

import { readFileSync, readdirSync } from 'fs';
import { gzipSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist', 'assets');

// Bundle size budgets (gzip-compressed size in bytes)
const BUDGETS = [
  // Main entry JS — largest chunk, contains framework + core logic
  { pattern: 'index-*.js', label: 'Main JS', maxBytes: 180 * 1024 },
  // Main CSS
  { pattern: 'index-*.css', label: 'Main CSS', maxBytes: 8 * 1024 },
  // Route chunk: Home
  { pattern: 'Home-*.js', label: 'Home chunk', maxBytes: 25 * 1024 },
  // Route chunk: Guide
  { pattern: 'Guide-*.js', label: 'Guide chunk', maxBytes: 15 * 1024 },
  // Route chunk: PricingPage
  { pattern: 'PricingPage-*.js', label: 'Pricing chunk', maxBytes: 20 * 1024 },
  // Route chunk: BgPlayground
  { pattern: 'BgPlayground-*.js', label: 'BgPlayground chunk', maxBytes: 20 * 1024 },
];

let failed = false;
let files;

try {
  files = readdirSync(distDir);
} catch {
  console.error('❌ dist/assets/ directory not found. Run "npm run build" first.');
  process.exit(1);
}

console.log('\n📦 Bundle size budget check');
console.log('━'.repeat(50));

for (const { pattern, label, maxBytes } of BUDGETS) {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  const matched = files.filter(f => regex.test(f));

  if (matched.length === 0) {
    console.warn(`  ⚠  ${label}: no file matching "${pattern}" — skipped`);
    continue;
  }

  for (const file of matched) {
    const content = readFileSync(join(distDir, file));
    const gzipped = gzipSync(content);
    const gzipSize = gzipped.length;
    const maxKB = (maxBytes / 1024).toFixed(1);
    const actualKB = (gzipSize / 1024).toFixed(1);
    const rawKB = (content.length / 1024).toFixed(1);

    if (gzipSize > maxBytes) {
      console.error(`  ❌ ${file}: ${actualKB} KB gzipped (raw ${rawKB} KB) > ${maxKB} KB budget`);
      failed = true;
    } else {
      console.log(`  ✅ ${label}: ${actualKB} KB gzipped (raw ${rawKB} KB) — budget ${maxKB} KB`);
    }
  }
}

console.log('━'.repeat(50));

if (failed) {
  console.error('❌ Bundle size budgets exceeded!\n');
  process.exit(1);
} else {
  console.log('✅ All bundle sizes within budget\n');
}
