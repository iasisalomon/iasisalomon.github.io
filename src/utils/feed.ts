// One RSS feed per language (/rss.xml, /es/rss.xml), each with the posts
// written in that language, newest first.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { BLOG_CATEGORIES } from '../consts';
import { getPostsIn } from '../data/queries';
import { useTranslations, type Locale } from '../i18n';

export async function feed(context: APIContext, lang: Locale) {
	const t = useTranslations(lang);
	const categoryLabels: Record<string, string> = Object.fromEntries(BLOG_CATEGORIES.map((c) => [c.id, t(c.label)]));
	const posts = await getPostsIn(lang);
	return rss({
		title: t('site.title'),
		description: t('site.description'),
		site: context.site!,
		customData: `<language>${lang}</language>`,
		items: posts.map(({ entry, href }) => ({
			title: entry.data.title,
			description: entry.data.description,
			pubDate: entry.data.pubDate,
			link: href,
			categories: entry.data.category ? [categoryLabels[entry.data.category]] : [],
		})),
	});
}
