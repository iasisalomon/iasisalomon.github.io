import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		category: z.enum(['tech', 'business', 'other']).optional(),
	}),
});

// Long-form case studies. Each file's slug must match a project slug in
// src/data/projects.json (see getProjectBySlug); shared metadata (brand,
// date, skills, links) comes from that catalog entry, while the Markdown
// body and the fields below hold the case-study narrative.
const caseStudies = defineCollection({
	type: 'content',
	schema: z.object({
		role: z.string().optional(),
		timeframe: z.string().optional(),
		outcome: z.string().optional(),
		heroImage: z.string().optional(),
		gallery: z.array(z.string()).optional(),
	}),
});

export const collections = { blog, caseStudies };
