// Fails the build if a page in dist/ has inline code the CSP in public/_headers
// would block: an inline <script> whose sha256 hash is not in script-src, an
// inline <style> tag, or a style="" attribute. JSON-LD is skipped because
// browsers never execute it.
//
//   node scripts/check-csp.mjs   (runs after `astro build`)
//
// Editing the theme script in MainLayout.astro changes its hash: copy the new
// value this script prints into script-src in public/_headers.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const headers = readFileSync('public/_headers', 'utf8');
const scriptSrc = headers.match(/script-src ([^;]+)/)?.[1] ?? '';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const problems = [];
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const page = relative(DIST, file);

  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\ssrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    if (!scriptSrc.includes(hash)) {
      problems.push(`${page}: inline script ${hash} not in script-src: ${body.trim().slice(0, 60)}`);
    }
  }
  if (/<style[\s>]/.test(html)) problems.push(`${page}: inline <style> tag`);
  for (const [tag] of html.matchAll(/<[a-z][^>]*\sstyle=["'][^>]*>/g)) {
    problems.push(`${page}: style attribute: ${tag.slice(0, 80)}`);
  }
}

if (problems.length) {
  console.error(`CSP check failed (${problems.length}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('CSP check passed: no inline code outside the allowed hashes.');
