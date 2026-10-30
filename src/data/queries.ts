// Read access to the site's data collections (see content.config.ts).
//
// Pages and components ask for data through these functions instead of
// calling getCollection() themselves, so sorting, the `featured` filter,
// the {fact} placeholders and the choice of language are handled in one place.
// Every function takes the page's language and returns plain text in it.

import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';
import { FACTS } from '../consts';
import { LOCALES, isLocale, localePath, pick, useTranslations, type Alternates, type Locale } from '../i18n';

/** A data shape with every { en, es } value replaced by the text in one language. */
type Resolved<T> = T extends Record<Locale, infer U>
  ? Resolved<U>
  : T extends (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

const isPerLocale = (value: object): value is Record<Locale, unknown> =>
  !Array.isArray(value) && LOCALES.every((l) => l in value);

/** Resolve every { en, es } value in `data` to its `lang` version. */
function resolve<T>(data: T, lang: Locale): Resolved<T> {
  if (Array.isArray(data)) return data.map((item) => resolve(item, lang)) as Resolved<T>;
  if (data && typeof data === 'object' && !(data instanceof Date)) {
    if (isPerLocale(data)) return resolve(data[lang], lang) as Resolved<T>;
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, resolve(v, lang)])) as Resolved<T>;
  }
  return data as Resolved<T>;
}

export type Project = Resolved<CollectionEntry<'projects'>['data']>;
export type Testimonial = CollectionEntry<'testimonials'>['data'];
export type Organization = CollectionEntry<'organizations'>['data'];
export type Role = Resolved<CollectionEntry<'experience'>['data']>;

/** Replace {fact} placeholders with values from FACTS; unknown names fail the build. */
export function fillFacts(text: string, lang: Locale): string {
  return text.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (!(name in FACTS)) throw new Error(`[data] Unknown fact "{${name}}" in: ${text}`);
    return String(pick(FACTS[name], lang));
  });
}

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

// ---------------------------------------------------------------- Projects

/** All projects, in projects.json order. */
export async function getProjects(lang: Locale): Promise<Project[]> {
  return (await getCollection('projects')).map((e) => resolve(e.data, lang)).sort(byOrder);
}

export async function getProject(slug: string, lang: Locale): Promise<Project | undefined> {
  const entry = await getEntry('projects', slug);
  return entry && resolve(entry.data, lang);
}

/** Selected work cards: featured projects that have a card, with placeholders filled. */
export async function getFeaturedWork(lang: Locale): Promise<(Project & { card: NonNullable<Project['card']> })[]> {
  return (await getProjects(lang)).flatMap((p) =>
    p.featured && p.card
      ? [{ ...p, card: { ...p.card, facts: { ...p.card.facts, items: p.card.facts.items.map((f) => fillFacts(f, lang)) } } }]
      : [],
  );
}

/** Engineering repos: software projects with an honest status label. */
export async function getRepos(lang: Locale): Promise<Project[]> {
  return (await getProjects(lang)).filter((p) => p.category === 'software-engineering' && p.status);
}

// -------------------------------------------------------------- Experience

/** All roles, newest first, with placeholders filled. */
export async function getExperience(lang: Locale): Promise<Role[]> {
  return (await getCollection('experience'))
    .map((e) => resolve(e.data, lang))
    .map((r) => ({ ...r, bullets: r.bullets.map((b) => fillFacts(b, lang)) }))
    .sort((a, b) => b.start.localeCompare(a.start));
}

export async function getFeaturedExperience(lang: Locale): Promise<Role[]> {
  return (await getExperience(lang)).filter((r) => r.featured);
}

/** "Jan 2026 – Present" from YYYY-MM dates. Formatted in UTC so months don't shift. */
export function formatRange(start: string, end: string | undefined, lang: Locale): string {
  const month = (ym: string) =>
    new Date(`${ym}-01`).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  return `${month(start)} – ${end ? month(end) : useTranslations(lang)('experience.present')}`;
}

// ------------------------------------------------- Testimonials, organizations

/** All testimonials, in testimonials.json order. Quotes stay in their original English. */
export async function getTestimonials(): Promise<Testimonial[]> {
  return (await getCollection('testimonials')).map((e) => e.data).sort(byOrder);
}

/** All organizations, in organizations.json order. */
export async function getOrganizations(): Promise<Organization[]> {
  return (await getCollection('organizations')).map((e) => e.data).sort(byOrder);
}

// ------------------------------------------------- Translated Markdown entries

type MarkdownCollection = Extract<CollectionKey, 'blog' | 'caseStudies'>;

/** "es/einstein-2016" → { lang: 'es', slug: 'einstein-2016' }. */
function splitId(id: string): { lang: Locale; slug: string } {
  const [lang, slug] = id.split('/');
  if (!isLocale(lang) || !slug) throw new Error(`[data] "${id}" must live in a language folder, e.g. en/${id}.md`);
  return { lang, slug };
}

/** A Markdown entry with its language and its slug (the file name). */
export type Localized<C extends MarkdownCollection> = {
  entry: CollectionEntry<C>;
  lang: Locale;
  slug: string;
};

async function getLocalized<C extends MarkdownCollection>(collection: C): Promise<Localized<C>[]> {
  return (await getCollection(collection)).map((entry) => ({ entry: entry as CollectionEntry<C>, ...splitId(entry.id) }));
}

/** The languages each slug is written in. */
async function languagesBySlug(collection: MarkdownCollection): Promise<Map<string, Locale[]>> {
  const map = new Map<string, Locale[]>();
  for (const { lang, slug } of await getLocalized(collection)) map.set(slug, [...(map.get(slug) ?? []), lang]);
  return map;
}

// -------------------------------------------------------------------- Blog

export type Post = Localized<'blog'> & {
  href: string;
  /** Pages of this post in each language it's written in. */
  alternates: Alternates;
};

const newestFirst = (a: Post, b: Post) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf();

async function getAllPosts(): Promise<Post[]> {
  const languages = await languagesBySlug('blog');
  return (await getLocalized('blog')).map((post) => ({
    ...post,
    href: localePath(post.lang, `/blog/${post.slug}/`),
    alternates: Object.fromEntries(languages.get(post.slug)!.map((l) => [l, localePath(l, `/blog/${post.slug}/`)])),
  }));
}

/** Posts written in `lang`, newest first: the pages under that language's /blog/. */
export async function getPostsIn(lang: Locale): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.lang === lang).sort(newestFirst);
}

/** Posts to list on a `lang` page, newest first: each post in `lang`, or in
 *  the language it was written in when it has no `lang` version. */
export async function getPostList(lang: Locale): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts
    .filter((p) => p.lang === lang || !p.alternates[lang])
    .sort(newestFirst);
}

// ------------------------------------------------------------- Case studies

export type CaseStudy = Localized<'caseStudies'> & {
  project: Project & { date: string };
  alternates: Alternates;
};

/** Case studies written in `lang`, newest first by catalog date. Each file
 *  name must be a project slug, and that project needs a date. */
export async function getCaseStudiesIn(lang: Locale): Promise<CaseStudy[]> {
  const languages = await languagesBySlug('caseStudies');
  const studies = await Promise.all(
    (await getLocalized('caseStudies'))
      .filter((cs) => cs.lang === lang)
      .map(async (cs) => {
        const project = await getProject(cs.slug, lang);
        if (!project) {
          throw new Error(
            `Case study "${cs.entry.id}" has no matching project in projects.json. ` +
              `Rename the file to a valid project slug or add the project.`,
          );
        }
        if (!project.date) throw new Error(`Project "${project.slug}" has a case study, so it needs a "date" in projects.json.`);
        return {
          ...cs,
          project: { ...project, date: project.date },
          alternates: Object.fromEntries(languages.get(cs.slug)!.map((l) => [l, localePath(l, `/projects/${cs.slug}/`)])),
        };
      }),
  );
  return studies.sort((a, b) => b.project.date.localeCompare(a.project.date));
}
