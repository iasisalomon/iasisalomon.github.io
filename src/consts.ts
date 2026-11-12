// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
// Labels are translation keys (src/i18n/en.json); components translate them.
import type { Localizable, TranslationKey } from './i18n';

export const AUTHOR_NAME = 'Iasi Salomon';

// 1200x630 card for social previews and for posts without a photo of their own.
export const DEFAULT_IMAGE = '/images/og-default.jpg';

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

// One link per homepage screen, in page order, so no screen can be missed.
// Each link is a homepage section, in the page's own language.
export const NAV_LINKS: { label: TranslationKey; hash: string }[] = [
	{ label: 'nav.home', hash: '#home' },
	{ label: 'nav.about', hash: '#about' },
	{ label: 'nav.experience', hash: '#experience' },
	{ label: 'nav.work', hash: '#work' },
	{ label: 'nav.engineering', hash: '#engineering' },
	{ label: 'nav.blog', hash: '#blog' },
	{ label: 'nav.proof', hash: '#proof' },
	{ label: 'nav.contact', hash: '#contact' },
];

// Blog categories: the `category` enum in content.config.ts is built from
// this list. Used by the archive filter tabs, post badges, the homepage blog
// teaser and the feeds (see categoryLabels in utils/content.ts).
export const BLOG_CATEGORIES = [
	{ id: 'tech', label: 'blog.categoryTech' },
	{ id: 'business', label: 'blog.categoryBusiness' },
	{ id: 'other', label: 'blog.categoryOther' },
] as const satisfies readonly { id: string; label: TranslationKey }[];
export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number]['id'];

// Headline numbers repeated across the homepage (Hero, Experience, Selected
// work). Change them here; the Markdown case studies state them in their own words.
export const FACTS = {
	teamSize: '60+',
	crewHoursInOneMonth: { en: '4,900+', es: '4.900+' },
	broadcastsInOneMonth: '470+',
	onboardingMinutesSaved: 30,
} as const satisfies Record<string, Localizable<string | number>>;
export type FactName = keyof typeof FACTS;
