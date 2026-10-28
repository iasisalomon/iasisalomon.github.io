// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Iasi Salomon | Technical Delivery Manager';
export const SITE_DESCRIPTION =
	'Technical Delivery Manager with 5+ years in remote, cross-functional tech teams. Delivery operations, automation and AI. Rosario, Argentina; US time zones.';

export const LINKS = {
	email: 'mailto:iasisalomon@gmail.com',
	emailAddress: 'iasisalomon@gmail.com',
	linkedin: 'https://www.linkedin.com/in/iasisalomon/',
	github: 'https://github.com/iasisalomon',
	x: 'https://x.com/glunisok',
	instagram: 'https://instagram.com/oxaciano',
	tiktok: 'https://tiktok.com/@oxaciano',
	telegram: 'https://t.me/oxaciano',
	calendly: 'https://calendly.com/iasisalomon',
};

// Keep the header focused on the sections most useful to hiring teams.
export const NAV_LINKS = [
	{ label: 'Home', href: '/#home' },
	{ label: 'Experience', href: '/#experience' },
	{ label: 'Work', href: '/#work' },
	{ label: 'Organizations', href: '/#organizations' },
	{ label: 'Testimonials', href: '/#testimonials' },
	{ label: "Let's talk", href: '/#contact' },
] as const;

// The footer keeps links to every homepage section, including secondary content.
export const FOOTER_LINKS = [
	{ label: 'Home', href: '/#home' },
	{ label: 'About', href: '/#about' },
	{ label: 'Experience', href: '/#experience' },
	{ label: 'Work', href: '/#work' },
	{ label: 'Engineering', href: '/#engineering' },
	{ label: 'Blog', href: '/#blog' },
	{ label: 'Skills', href: '/#skills' },
	{ label: 'Organizations', href: '/#organizations' },
	{ label: 'Testimonials', href: '/#testimonials' },
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

// Headline numbers repeated across the homepage (Hero, Experience, Selected
// work). Change them here; the Markdown case studies state them in their own words.
export const FACTS = {
	teamSize: '60+',
	crewHoursInOneMonth: '4,900+',
	broadcastsInOneMonth: '470+',
	onboardingMinutesSaved: 30,
} as const;
