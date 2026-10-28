// Generates WebP thumbnails for case-study gallery photos, sized to cover the
// 3:2 grid tiles (at least 600x400) at 2x density.
//
//   pnpm thumbs
//
// For every image in public/images/gallery/<folder>/, writes
// public/images/gallery/<folder>/thumbs/<name>.webp unless it already exists
// (pass --force to regenerate). The full-size photos are never modified; the
// project page shows the thumbnail and the lightbox opens the full-size file.
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const GALLERY_DIR = 'public/images/gallery';
const WIDTH = 600;
const HEIGHT = 400;
const force = process.argv.includes('--force');

for (const folder of readdirSync(GALLERY_DIR)) {
  const dir = join(GALLERY_DIR, folder);
  if (!statSync(dir).isDirectory()) continue;

  const thumbsDir = join(dir, 'thumbs');
  mkdirSync(thumbsDir, { recursive: true });

  for (const file of readdirSync(dir)) {
    if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
    const out = join(thumbsDir, `${parse(file).name}.webp`);
    if (existsSync(out) && !force) continue;

    const info = await sharp(join(dir, file))
      // 'outside' keeps the aspect ratio and makes both sides at least WIDTHxHEIGHT.
      .resize({ width: WIDTH, height: HEIGHT, fit: 'outside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  }
}
