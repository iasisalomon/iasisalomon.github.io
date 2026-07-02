// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Iasi Salomon';
export const SITE_DESCRIPTION = 'Iasi Salomon is an operations & strategy lead and software engineer. Portfolio, case studies, and writing on operations, esports, QA automation, and Web3 — formerly Sky Mavis (Axie Infinity).';

// Blog categories — must stay in sync with the `category` enum in
// content.config.ts. Used by the blog navbar, the archive filter tabs
// and the footer links.
export const BLOG_CATEGORIES = [
	{ id: 'tech', label: 'Tech' },
	{ id: 'business', label: 'Business' },
	{ id: 'other', label: 'Other' },
] as const;