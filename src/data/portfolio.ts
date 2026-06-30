// Validated, typed access layer for portfolio data.
//
// Components import `projects` and `brands` from here instead of reading the
// raw JSON. The Zod schemas below run at build time, so a malformed entry
// (e.g. an unknown brand id, a bad URL, a missing field) fails `astro build`
// loudly rather than rendering broken markup.

import { z } from 'astro/zod';
import projectsRaw from './projects.json';
import brandsRaw from './brands.json';
import expertiseRaw from './expertise.json';
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
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  brand: z.enum(BRAND_IDS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  category: z.enum(CATEGORY_IDS),
  skills: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
  // Flagship projects surfaced in the "Selected Work" rail. These are the
  // ones that have a written case study (see src/content/caseStudies/).
  featured: z.boolean().default(false),
});

// An area of expertise. `match` ties the area to the projects that prove it.
// Presentation (icon/color/gradient) is derived from AREA_META by id, so it
// isn't duplicated here.
const expertiseSchema = z.object({
  id: z.enum(CATEGORY_IDS),
  name: z.string().min(1),
  summary: z.string().min(1),
  tools: z.array(z.string()).default([]),
  match: z.object({ category: z.enum(CATEGORY_IDS) }),
  yearsActive: z.string().optional(),
});

export type Brand = z.infer<typeof brandSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Expertise = z.infer<typeof expertiseSchema>;

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

// Referential integrity: every project must point at a brand that exists,
// and slugs must be unique (they become case-study URLs).
const brandIds = new Set(brands.map((b) => b.id));
const seenSlugs = new Set<string>();
for (const project of projects) {
  if (!brandIds.has(project.brand)) {
    throw new Error(
      `[portfolio data] Project "${project.title}" references unknown brand "${project.brand}".`,
    );
  }
  if (seenSlugs.has(project.slug)) {
    throw new Error(`[portfolio data] Duplicate project slug "${project.slug}".`);
  }
  seenSlugs.add(project.slug);
}

/** Look up a project by its URL slug. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Projects flagged as flagship work (have a case study). */
export const featuredProjects: Project[] = projects.filter((p) => p.featured);

/** Resolve the brand record for a project (or any brand id). */
export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export const expertise: Expertise[] = parseOrThrow(
  z.array(expertiseSchema),
  expertiseRaw,
  'expertise.json',
);

/** Projects that demonstrate a given area of expertise. */
export function projectsForArea(area: Expertise): Project[] {
  return projects.filter((p) => p.category === area.match.category);
}

/** Distinct skills aggregated across the projects in an area. */
export function skillsForArea(area: Expertise): string[] {
  const set = new Set<string>();
  for (const p of projectsForArea(area)) p.skills.forEach((s) => set.add(s));
  return [...set];
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
