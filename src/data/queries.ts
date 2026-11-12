// Read access to the site's data collections (see content.config.ts).
//
// Pages and components ask for data through these functions instead of
// calling getCollection() themselves, so sorting, the `featured` filter,
// the {fact} placeholders and the choice of language are handled in one place.
// Every function takes the page's language and returns plain text in it.

import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';
import { FACTS } from '../consts';
import {
  formatDate,
  isLocale,
  isPerLocale,
  localePath,
  pick,
  useTranslations,
  type Alternates,
  type Locale,
  type Localizable,
} from '../i18n';

/** A data shape with every { en, es } value replaced by the text in one language. */
type Resolved<T> = T extends Record<Locale, infer U>
  ? Resolved<U>
  : T extends (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

/** Resolve every { en, es } value in `data` to its `lang` version. */
function resolve<T>(data: T, lang: Locale): Resolved<T> {
  if (Array.isArray(data)) return data.map((item) => resolve(item, lang)) as Resolved<T>;
  if (data && typeof data === 'object' && !(data instanceof Date)) {
    if (isPerLocale<unknown>(data)) return resolve(data[lang], lang) as Resolved<T>;
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
  const facts: Record<string, Localizable<string | number>> = FACTS;
  return text.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (!(name in facts)) throw new Error(`[data] Unknown fact "{${name}}" in: ${text}`);
    return String(pick(facts[name], lang));
  });
}

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

/** Featured entries first; each group keeps its own order. */
export const featuredFirst = <T extends { featured: boolean }>(items: T[]): T[] => [
  ...items.filter((i) => i.featured),
  ...items.filter((i) => !i.featured),
];

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

/** "Jan 2026 – Present" from YYYY-MM dates. */
export function formatRange(start: string, end: string | undefined, lang: Locale): string {
  const month = (ym: string) => formatDate(new Date(`${ym}-01`), lang, { month: 'short', year: 'numeric' });
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

/** A Markdown entry with its language, its slug (the file name), its page and
 *  that page in each language the entry is written in. */
export type Localized<C extends MarkdownCollection> = {
  entry: CollectionEntry<C>;
  lang: Locale;
  slug: string;
  href: string;
  alternates: Alternates;
};

/** Every entry of a collection; `pathOf(slug)` is its page, written as the English path. */
async function getLocalized<C extends MarkdownCollection>(collection: C, pathOf: (slug: string) => string): Promise<Localized<C>[]> {
  const entries = (await getCollection(collection)).map((entry) => ({ entry: entry as CollectionEntry<C>, ...splitId(entry.id) }));
  const alternates = new Map<string, Alternates>();
  for (const { lang, slug } of entries) alternates.set(slug, { ...alternates.get(slug), [lang]: localePath(lang, pathOf(slug)) });
  return entries.map((e) => ({ ...e, href: localePath(e.lang, pathOf(e.slug)), alternates: alternates.get(e.slug)! }));
}

// -------------------------------------------------------------------- Blog

export type Post = Localized<'blog'>;

const newestFirst = (a: Post, b: Post) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf();

const getAllPosts = () => getLocalized('blog', (slug) => `/blog/${slug}/`);

/** Posts written in `lang`, newest first: the pages under that language's /blog/. */
export async function getPostsIn(lang: Locale): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.lang === lang).sort(newestFirst);
}

/** Posts to list on a `lang` page, newest first: each post in `lang`, or in
 *  the language it was written in when it has no `lang` version. */
export async function getPostList(lang: Locale): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.lang === lang || !p.alternates[lang]).sort(newestFirst);
}

// ------------------------------------------------------------- Case studies

export type CaseStudy = Localized<'caseStudies'> & {
  project: Project & { date: string };
};

/** Case studies written in `lang`, newest first by catalog date; projects
 *  with the same date keep their projects.json order, so every language
 *  lists them alike. Each file name must be a project slug, and that project
 *  needs a date. */
export async function getCaseStudiesIn(lang: Locale): Promise<CaseStudy[]> {
  const studies = await Promise.all(
    (await getLocalized('caseStudies', (slug) => `/projects/${slug}/`))
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
        return { ...cs, project: { ...project, date: project.date } };
      }),
  );
  return studies.sort((a, b) => b.project.date.localeCompare(a.project.date) || byOrder(a.project, b.project));
}
