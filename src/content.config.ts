import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS } from './data/areas';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		// Describes the hero photo; without it the alt falls back to the title.
		heroImageAlt: z.string().optional(),
		category: z.enum(['tech', 'business', 'other']).optional(),
		// BCP-47 language tag for the post body (defaults to 'en'). Used for the
		// <html lang> attribute so search engines index the post in the right locale.
		lang: z.string().optional().default('en'),
		// Recognition the piece received (e.g. a contest prize), shown as a badge.
		award: z.string().optional(),
	}),
});

// A gallery photo: a bare path, or an object with its own alt text and an
// optional caption. Bare paths are normalized so pages only see objects.
const galleryImage = z
	.union([
		z.string(),
		z.object({
			src: z.string(),
			alt: z.string(),
			caption: z.string().optional(),
		}),
	])
	.transform((img) => (typeof img === 'string' ? { src: img, alt: '', caption: undefined } : img));

// Long-form case studies. Each file's id (filename) must match a project slug
// in src/data/projects.json (see getProject); shared metadata (date,
// skills, links) comes from that catalog entry, while the Markdown
// body and the fields below hold the case-study narrative.
const caseStudies = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/data/caseStudies' }),
	schema: z.object({
		role: z.string().optional(),
		timeframe: z.string().optional(),
		outcome: z.string().optional(),
		heroImage: z.string().optional(),
		// Describes the hero photo (heroImage, or the catalog image).
		heroImageAlt: z.string().optional(),
		gallery: z.array(galleryImage).optional(),
	}),
});

// JSON data files under src/data/ work as the site's database: one file per
// collection, one object per entry, each with a unique kebab-case `slug`
// (it becomes the entry id and, where there is one, its URL). `featured`
// entries are the ones the homepage shows; the rest only appear in full
// listings. Pages read them through src/data/queries.ts.
const slug = z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case');

// Loads a JSON array and records each entry's position in the file as
// `order`, so the order in the file is the order on the site.
const orderedJson = (path: string) =>
	file(path, {
		parser: (text) => (JSON.parse(text) as Record<string, unknown>[]).map((item, order) => ({ ...item, order })),
	});

const linkSchema = z.object({
	text: z.string().min(1),
	url: z.string().url(),
	/** astro-icon name, e.g. 'fa6-brands:github'. */
	icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/),
});

// How a featured project looks as a Selected work card on the homepage.
// Text may use {fact} placeholders from FACTS in consts.ts.
const workCardSchema = z.object({
	tag: z.string().min(1),
	/** Card text; defaults to the project description. */
	description: z.string().min(1).optional(),
	/** Card photo; defaults to the project image. */
	image: z.string().min(1).optional(),
	imageAlt: z.string().optional(),
	/** Shown instead of a photo: background class + a brand logo or an astro-icon name. */
	panel: z.object({ gradientClass: z.string(), icon: z.string().optional(), logo: z.string().optional() }).optional(),
	facts: z.object({ label: z.string(), items: z.array(z.string()) }),
	ctaLabel: z.string().min(1),
	/** Optional plain link shown next to the main button. */
	link: z.object({ label: z.string(), href: z.string().url() }).optional(),
});

const projects = defineCollection({
	loader: orderedJson('src/data/projects.json'),
	schema: z
		.object({
			slug,
			order: z.number(),
			title: z.string().min(1),
			description: z.string().min(1),
			// Optional: without one, case-study pages fall back to the site's default
			// social image (see SEO.astro).
			image: z.string().min(1).optional(),
			// Required for projects with a case study, which use it for ordering and
			// the "When" fact; projects/[slug].astro enforces that.
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD').optional(),
			category: z.enum(CATEGORY_IDS),
			skills: z.array(z.string()).default([]),
			links: z.array(linkSchema).default([]),
			// Honest label for repos shown in the Engineering section.
			status: z.enum(['practice', 'challenge', 'private deployment']).optional(),
			// Featured repos (with a status) lead the Engineering section; other
			// featured projects are the Selected work cards and need a `card`.
			featured: z.boolean().default(false),
			card: workCardSchema.optional(),
		})
		.refine((p) => !p.featured || p.status || p.card, {
			message: 'a featured project without a status is a Selected work card, so it needs a "card"',
		}),
});

// One entry per role. Titles, employers and dates must match the CV and
// LinkedIn exactly. Consecutive roles at the same organization are shown
// grouped under it. Bullets may use {fact} placeholders from FACTS.
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'dates must be YYYY-MM');
const experience = defineCollection({
	loader: file('src/data/experience.json'),
	schema: z.object({
		slug,
		title: z.string().min(1),
		organization: z.string().min(1),
		/** Shown in parentheses after the organization, e.g. "contract". */
		organizationNote: z.string().optional(),
		start: yearMonth,
		/** Omitted while the role is current. */
		end: yearMonth.optional(),
		bullets: z.array(z.string().min(1)).min(1),
		featured: z.boolean().default(false),
	}),
});

const testimonials = defineCollection({
	loader: orderedJson('src/data/testimonials.json'),
	schema: z.object({
		slug,
		order: z.number(),
		quote: z.string().min(1),
		name: z.string().min(1),
		role: z.string().min(1),
		org: z.string().optional(),
		featured: z.boolean().default(false),
	}),
});

// "Teams and organizations" logos.
const organizations = defineCollection({
	loader: orderedJson('src/data/organizations.json'),
	schema: z.object({
		slug,
		order: z.number(),
		name: z.string().min(1),
		logo: z.string().min(1),
		/** Logo needs a dark tile to stay readable. */
		darkTile: z.boolean().default(false),
		url: z.string().url().optional(),
		featured: z.boolean().default(false),
	}),
});

export const collections = { blog, caseStudies, projects, experience, testimonials, organizations };
