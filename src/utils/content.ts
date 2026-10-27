// Small presentation helpers shared by the blog archive, the homepage
// teaser and article pages.

const WORDS_PER_MINUTE = 220;

/** Approximate reading time of a Markdown body, e.g. "8 min read". */
export function readingTime(body: string | undefined): string {
  const words = (body ?? '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Español',
};

/** Display name for a post written in a language other than English, else undefined. */
export function languageName(lang: string | undefined): string | undefined {
  if (!lang || lang === 'en') return undefined;
  return LANGUAGE_NAMES[lang] ?? lang.toUpperCase();
}
