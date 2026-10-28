import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, BLOG_CATEGORIES } from '../consts';

const categoryLabels = Object.fromEntries(BLOG_CATEGORIES.map((c) => [c.id, c.label]));

export async function GET(context) {
	// Newest first, matching the blog archive.
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			categories: post.data.category ? [categoryLabels[post.data.category]] : [],
		})),
	});
}
