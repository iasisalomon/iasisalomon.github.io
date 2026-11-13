// How a project from src/data/projects.json is shown as a card: on the
// homepage (Selected work, Engineering) and in the /projects/ archive.
import { AREA_META, STATUS_LABELS } from '../data/areas';
import type { Project } from '../data/queries';
import { useTranslations, type Locale } from '../i18n';

/** What ProjectCard.astro draws. */
export interface ProjectCardProps {
  title: string;
  description: string;
  /** The project's case study: the whole card opens it. */
  href?: string;
  /** Small line above the title. */
  tag?: string;
  /** Honest status pill of a repo ("practice", "challenge", …). */
  status?: string;
  /** One line under the text: the stack or the key facts. */
  meta?: string;
  /** Text of the call to action shown when the card has an `href`. */
  ctaLabel?: string;
  /** External links (repo, demo…); `icon` is an astro-icon name. */
  links?: { label: string; href: string; icon?: string }[];
  /** Visual header: a photo, or a background class with a brand logo or an icon. */
  media?: { image: { src: string; alt: string } } | { panel: { gradientClass: string; icon?: string; logo?: string } };
}

/** The card for `project`. With `media`, every card gets a visual header (its
 *  photo, its own panel or its area's gradient and icon) and a tag; without,
 *  the compact card of the Engineering screen. */
export function projectCard(project: Project, lang: Locale, { media }: { media: boolean }): ProjectCardProps {
  const t = useTranslations(lang);
  const area = AREA_META[project.category];
  const { card } = project;
  const image = card?.image ?? project.image;

  // A card's own link first, then the project's; the same address only once.
  const links = [
    ...(card?.link ? [{ label: card.link.label, href: card.link.href }] : []),
    ...project.links.map((l) => ({ label: l.text, href: l.url, icon: l.icon })),
  ].filter((link, i, all) => all.findIndex((other) => other.href === link.href) === i);

  return {
    title: project.title,
    description: card?.description ?? project.description,
    href: project.caseStudyHref,
    tag: card?.tag ?? (media ? t(area.label) : undefined),
    status: project.status && t(STATUS_LABELS[project.status]),
    meta: (card?.facts.items ?? project.skills).join(' · '),
    ctaLabel: card?.ctaLabel ?? t('work.readCaseStudy'),
    links,
    media: !media
      ? undefined
      : card?.panel
        ? { panel: card.panel }
        : image
          ? { image: { src: image, alt: card?.imageAlt ?? '' } }
          : { panel: { gradientClass: area.gradientClass, icon: area.icon } },
  };
}
