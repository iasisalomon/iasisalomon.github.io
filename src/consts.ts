// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Iasi Salomon';
// Kept under ~155 chars so it doesn't get truncated in search-result snippets.
export const SITE_DESCRIPTION = 'Iasi Salomon — operations & strategy lead and software engineer. Writing on esports, QA automation and Web3';

// Blog categories — must stay in sync with the `category` enum in
// content.config.ts. Used by the blog navbar, the archive filter tabs
// and the footer links.
export const BLOG_CATEGORIES = [
	{ id: 'tech', label: 'Tech' },
	{ id: 'business', label: 'Business' },
	{ id: 'other', label: 'Other' },
] as const;