// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Iasi Salomon | Technical Delivery Manager';
export const SITE_DESCRIPTION =
	'Technical Delivery Manager with 4+ years leading remote, cross-functional tech teams. Delivery operations, automation and AI. Rosario, Argentina; US time zones.';

export const LINKS = {
	email: 'mailto:iasisalomon@gmail.com',
	emailAddress: 'iasisalomon@gmail.com',
	linkedin: 'https://www.linkedin.com/in/iasisalomon/',
	github: 'https://github.com/iasisalomon',
	calendly: 'https://calendly.com/iasisalomon',
};

// One link per homepage section, in page order. Shared by the navbar and
// the footer so both stay in sync with index.astro.
export const NAV_LINKS = [
	{ label: 'Home', href: '/#home' },
	{ label: 'About', href: '/#about' },
	{ label: 'Experience', href: '/#experience' },
	{ label: 'Work', href: '/#work' },
	{ label: 'Engineering', href: '/#engineering' },
	{ label: 'Blog', href: '/#blog' },
	{ label: 'Skills', href: '/#skills' },
	{ label: 'Worked with', href: '/#proof' },
	{ label: "Let's talk", href: '/#contact' },
] as const;

// Blog categories — must stay in sync with the `category` enum in
// content.config.ts. Used by the blog navbar, the archive filter tabs,
// the homepage blog teaser and the footer links.
export const BLOG_CATEGORIES = [
	{ id: 'tech', label: 'Tech' },
	{ id: 'business', label: 'Business' },
	{ id: 'other', label: 'Other' },
] as const;
