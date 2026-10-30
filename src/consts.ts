// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
// Labels are translation keys (src/i18n/en.json); components translate them.
import type { Localizable, TranslationKey } from './i18n';

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
// Each link is a homepage section, in the page's own language.
export const NAV_LINKS: { label: TranslationKey; hash: string }[] = [
	{ label: 'nav.home', hash: '#home' },
	{ label: 'nav.experience', hash: '#experience' },
	{ label: 'nav.work', hash: '#work' },
	{ label: 'nav.organizations', hash: '#organizations' },
	{ label: 'nav.testimonials', hash: '#testimonials' },
	{ label: 'nav.contact', hash: '#contact' },
];

// The footer keeps links to every homepage section, including secondary content.
export const FOOTER_LINKS: { label: TranslationKey; hash: string }[] = [
	{ label: 'nav.home', hash: '#home' },
	{ label: 'nav.about', hash: '#about' },
	{ label: 'nav.experience', hash: '#experience' },
	{ label: 'nav.work', hash: '#work' },
	{ label: 'nav.engineering', hash: '#engineering' },
	{ label: 'nav.blog', hash: '#blog' },
	{ label: 'nav.skills', hash: '#skills' },
	{ label: 'nav.organizations', hash: '#organizations' },
	{ label: 'nav.testimonials', hash: '#testimonials' },
	{ label: 'nav.contact', hash: '#contact' },
];

// Blog categories — must stay in sync with the `category` enum in
// content.config.ts. Used by the blog navbar, the archive filter tabs,
// the homepage blog teaser and the footer links.
export const BLOG_CATEGORIES = [
	{ id: 'tech', label: 'blog.categoryTech' },
	{ id: 'business', label: 'blog.categoryBusiness' },
	{ id: 'other', label: 'blog.categoryOther' },
] as const satisfies readonly { id: string; label: TranslationKey }[];

// Headline numbers repeated across the homepage (Hero, Experience, Selected
// work). Change them here; the Markdown case studies state them in their own words.
export const FACTS: Record<string, Localizable<string | number>> = {
	teamSize: '60+',
	crewHoursInOneMonth: { en: '4,900+', es: '4.900+' },
	broadcastsInOneMonth: '470+',
	onboardingMinutesSaved: 30,
};
