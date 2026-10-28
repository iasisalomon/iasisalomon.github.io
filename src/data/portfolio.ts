// Validated, typed access layer for portfolio data.
//
// Components import `projects` from here instead of reading the raw JSON.
// The Zod schemas below run at build time, so a malformed entry (e.g. an
// unknown category, a bad URL, a missing field) fails `astro build` loudly
// rather than rendering broken markup.

import { z } from 'astro/zod';
import projectsRaw from './projects.json';
import { CATEGORY_IDS } from './areas';

const linkSchema = z.object({
  text: z.string().min(1),
  url: z.string().url(),
  /** astro-icon name, e.g. 'fa6-brands:github'. */
  icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/),
});

const projectSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  title: z.string().min(1),
  description: z.string().min(1),
  // Optional: without one, case-study pages fall back to the site's default
  // social image (see SEO.astro).
  image: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  category: z.enum(CATEGORY_IDS),
  skills: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
  // Honest label for repos shown in the Engineering section.
  status: z.enum(['practice', 'challenge', 'private deployment']).optional(),
});

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

export const projects: Project[] = parseOrThrow(z.array(projectSchema), projectsRaw, 'projects.json');

// Slugs must be unique (they become case-study URLs).
const seenSlugs = new Set<string>();
for (const project of projects) {
  if (seenSlugs.has(project.slug)) {
    throw new Error(`[portfolio data] Duplicate project slug "${project.slug}".`);
  }
  seenSlugs.add(project.slug);
}

/** Look up a project by its URL slug. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
