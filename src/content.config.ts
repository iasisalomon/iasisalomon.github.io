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
		category: z.enum(['tech', 'business', 'other']).optional(),
		// BCP-47 language tag for the post body (defaults to 'en'). Used for the
		// <html lang> attribute so search engines index the post in the right locale.
		lang: z.string().optional().default('en'),
	}),
});

// Long-form case studies. Each file's id (filename) must match a project slug
// in src/data/projects.json (see getProjectBySlug); shared metadata (brand,
// date, skills, links) comes from that catalog entry, while the Markdown
// body and the fields below hold the case-study narrative.
const caseStudies = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/caseStudies' }),
	schema: z.object({
		role: z.string().optional(),
		timeframe: z.string().optional(),
		outcome: z.string().optional(),
		heroImage: z.string().optional(),
		gallery: z.array(z.string()).optional(),
	}),
});

export const collections = { blog, caseStudies };
