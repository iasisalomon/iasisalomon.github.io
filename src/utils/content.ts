// Small presentation helpers shared by the blog archive, the homepage
// teaser, article pages and the feeds.
import { BLOG_CATEGORIES, type BlogCategoryId } from '../consts';
import { LANGUAGE_NAMES, formatDate, useTranslations, type Locale } from '../i18n';

const WORDS_PER_MINUTE = 220;

/** Approximate reading time of a Markdown body, e.g. "8 min read". */
export function readingTime(body: string | undefined, lang: Locale): string {
  const words = (body ?? '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return useTranslations(lang)('blog.minRead', { minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)) });
}

/** Name of a post's language when it differs from the page's, else undefined. */
export function languageName(postLang: Locale, pageLang: Locale): string | undefined {
  return postLang === pageLang ? undefined : LANGUAGE_NAMES[postLang];
}

/** The award as shown on post cards: just the prize, the part before the
 *  first comma ("1st prize"); the post page shows the full text. */
export function cardAward(award: string): string {
  return award.split(',')[0].trim();
}

/** Each blog category's name in `lang`. */
export function categoryLabels(lang: Locale): Record<BlogCategoryId, string> {
  const t = useTranslations(lang);
  return Object.fromEntries(BLOG_CATEGORIES.map((c) => [c.id, t(c.label)])) as Record<BlogCategoryId, string>;
}

/** "Mar 5, 2024": the date on post cards. */
export const shortDate = (date: Date, lang: Locale) => formatDate(date, lang, { year: 'numeric', month: 'short', day: 'numeric' });

/** "March 5, 2024": the date on a post's own page. */
export const longDate = (date: Date, lang: Locale) => formatDate(date, lang, { year: 'numeric', month: 'long', day: 'numeric' });
