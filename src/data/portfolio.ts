// Validated, typed access layer for portfolio data.
//
// Components import `projects` and `brands` from here instead of reading the
// raw JSON. The Zod schemas below run at build time, so a malformed entry
// (e.g. an unknown brand id, a bad URL, a missing field) fails `astro build`
// loudly rather than rendering broken markup.

import { z } from 'astro/zod';
import projectsRaw from './projects.json';
import brandsRaw from './brands.json';
import { BRAND_IDS, CATEGORY_IDS } from './areas';

const linkSchema = z.object({
  text: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1),
});

const brandSchema = z.object({
  id: z.enum(BRAND_IDS),
  name: z.string().min(1),
  description: z.string().min(1),
  color: z.string().min(1),
  gradientClass: z.string().min(1),
  icon: z.string().min(1),
  tags: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
});

const projectSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  brand: z.enum(BRAND_IDS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  category: z.enum(CATEGORY_IDS),
  skills: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
});

export type Brand = z.infer<typeof brandSchema>;
export type Project = z.infer<typeof projectSchema>;

/** Parse with Zod, throwing a readable, build-failing error on bad data. */
function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`[portfolio data] Invalid ${label}:\n${issues}`);
  }
  return result.data;
}

export const brands: Brand[] = parseOrThrow(z.array(brandSchema), brandsRaw, 'brands.json');
export const projects: Project[] = parseOrThrow(z.array(projectSchema), projectsRaw, 'projects.json');

// Referential integrity: every project must point at a brand that exists.
const brandIds = new Set(brands.map((b) => b.id));
for (const project of projects) {
  if (!brandIds.has(project.brand)) {
    throw new Error(
      `[portfolio data] Project "${project.title}" references unknown brand "${project.brand}".`,
    );
  }
}

/** Number of projects per brand id — used by the Brands section. */
export const projectCountByBrand: Record<string, number> = brands.reduce(
  (acc, brand) => {
    acc[brand.id] = projects.filter((p) => p.brand === brand.id).length;
    return acc;
  },
  {} as Record<string, number>,
);

export { BRAND_IDS, CATEGORY_IDS, CATEGORY_LABELS, BRAND_ORDER } from './areas';
export type { BrandId, CategoryId } from './areas';
