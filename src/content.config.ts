import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/blog' }),
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
// in src/data/projects.json (see getProjectBySlug); shared metadata (date,
// skills, links) comes from that catalog entry, while the Markdown
// body and the fields below hold the case-study narrative.
const caseStudies = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/caseStudies' }),
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

export const collections = { blog, caseStudies };
