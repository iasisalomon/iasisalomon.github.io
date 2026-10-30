// Languages of the site. English lives at /, Spanish under /es/ (see the
// i18n block in astro.config.mjs); every page has the same path after the
// prefix in both languages, e.g. /blog/x/ and /es/blog/x/.
//
// Interface text (buttons, headings, labels) lives in en.json and es.json
// next to this file. Content (posts, case studies, data) is translated where
// it lives: Markdown in src/data/<collection>/<lang>/, JSON fields as
// { "en": …, "es": … }.

import en from './en.json';
import es from './es.json';

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** The other language, for the switcher. */
export const otherLocale = (lang: Locale): Locale => (lang === 'en' ? 'es' : 'en');

type Dictionary = typeof en;
export type TranslationKey = {
  [S in keyof Dictionary]: `${S & string}.${keyof Dictionary[S] & string}`;
}[keyof Dictionary];

const DICTIONARIES: Record<Locale, Dictionary> = { en, es };

// Every language must have exactly the keys English has.
for (const lang of LOCALES) {
  const keys = (d: Dictionary) =>
    Object.entries(d).flatMap(([section, entries]) => Object.keys(entries).map((k) => `${section}.${k}`));
  const expected = new Set(keys(en));
  const actual = new Set(keys(DICTIONARIES[lang]));
  const missing = [...expected].filter((k) => !actual.has(k));
  const extra = [...actual].filter((k) => !expected.has(k));
  if (missing.length || extra.length) {
    throw new Error(`[i18n] ${lang}.json is out of sync with en.json. Missing: ${missing.join(', ') || 'none'}. Extra: ${extra.join(', ') || 'none'}.`);
  }
}

/** t('section.key', { name: 'x' }) → the text in `lang`, with {name} placeholders filled. */
export function useTranslations(lang: Locale) {
  return (key: TranslationKey, vars: Record<string, string | number> = {}): string => {
    const [section, name] = key.split('.') as [keyof Dictionary, string];
    const text = (DICTIONARIES[lang][section] as Record<string, string>)[name];
    return text.replace(/\{(\w+)\}/g, (match, v: string) => (v in vars ? String(vars[v]) : match));
  };
}

/** Path of `path` (written as the English path, e.g. '/blog/') in `lang`.
 *  Not astro:i18n's getRelativeLocaleUrl, which appends a slash to files
 *  such as /rss.xml. */
export function localePath(lang: Locale, path: string): string {
  return lang === DEFAULT_LOCALE ? path : `/${lang}${path}`;
}

/** A JSON value that is either the same in every language or given per language. */
export type Localizable<T = string> = T | Record<Locale, T>;

const isPerLocale = <T>(value: Localizable<T>): value is Record<Locale, T> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && LOCALES.every((l) => l in value);

/** The `lang` version of a Localizable value. */
export function pick<T>(value: Localizable<T>, lang: Locale): T {
  return isPerLocale(value) ? value[lang] : value;
}

const DATE_LOCALES: Record<Locale, string> = { en: 'en-US', es: 'es-AR' };

/** Dates are stored as UTC midnight; format in UTC so they don't shift a day back. */
export function formatDate(date: Date, lang: Locale, options: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString(DATE_LOCALES[lang], { ...options, timeZone: 'UTC' });
}

/** Each language's name in itself, for "this post is in …" badges. */
export const LANGUAGE_NAMES: Record<Locale, string> = { en: 'English', es: 'Español' };

/** A page's address in each language it exists in, for hreflang and the switcher. */
export type Alternates = Partial<Record<Locale, string>>;

/** Same path in every language: for pages that exist in all of them. */
export const everyLocale = (path: string): Alternates =>
  Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)]));
