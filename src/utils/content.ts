// Small presentation helpers shared by the blog archive, the homepage
// teaser and article pages.
import { LANGUAGE_NAMES, useTranslations, type Locale } from '../i18n';

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
