// Read access to the site's data collections (see content.config.ts).
//
// Pages and components ask for data through these functions instead of
// calling getCollection() themselves, so sorting, the `featured` filter and
// the {fact} placeholders are handled in one place.

import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { FACTS } from '../consts';

export type Project = CollectionEntry<'projects'>['data'];
export type Testimonial = CollectionEntry<'testimonials'>['data'];
export type Organization = CollectionEntry<'organizations'>['data'];
export type Role = CollectionEntry<'experience'>['data'];

/** Replace {fact} placeholders with values from FACTS; unknown names fail the build. */
export function fillFacts(text: string): string {
  return text.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (!(name in FACTS)) throw new Error(`[data] Unknown fact "{${name}}" in: ${text}`);
    return String(FACTS[name as keyof typeof FACTS]);
  });
}

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

// ---------------------------------------------------------------- Projects

/** All projects, in projects.json order. */
export async function getProjects(): Promise<Project[]> {
  return (await getCollection('projects')).map((e) => e.data).sort(byOrder);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getEntry('projects', slug))?.data;
}

/** Selected work cards: featured projects that have a card, with placeholders filled. */
export async function getFeaturedWork(): Promise<(Project & { card: NonNullable<Project['card']> })[]> {
  return (await getProjects()).flatMap((p) =>
    p.featured && p.card
      ? [{ ...p, card: { ...p.card, facts: { ...p.card.facts, items: p.card.facts.items.map(fillFacts) } } }]
      : [],
  );
}

/** Engineering repos: software projects with an honest status label. */
export async function getRepos(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.category === 'software-engineering' && p.status);
}

// -------------------------------------------------------------- Experience

/** All roles, newest first, with placeholders filled. */
export async function getExperience(): Promise<Role[]> {
  return (await getCollection('experience'))
    .map((e) => ({ ...e.data, bullets: e.data.bullets.map(fillFacts) }))
    .sort((a, b) => b.start.localeCompare(a.start));
}

export async function getFeaturedExperience(): Promise<Role[]> {
  return (await getExperience()).filter((r) => r.featured);
}

/** "Jan 2026 – Present" from YYYY-MM dates. Formatted in UTC so months don't shift. */
export function formatRange(start: string, end?: string): string {
  const month = (ym: string) =>
    new Date(`${ym}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `${month(start)} – ${end ? month(end) : 'Present'}`;
}

// ------------------------------------------------- Testimonials, organizations

/** All testimonials, in testimonials.json order. */
export async function getTestimonials(): Promise<Testimonial[]> {
  return (await getCollection('testimonials')).map((e) => e.data).sort(byOrder);
}

/** All organizations, in organizations.json order. */
export async function getOrganizations(): Promise<Organization[]> {
  return (await getCollection('organizations')).map((e) => e.data).sort(byOrder);
}
