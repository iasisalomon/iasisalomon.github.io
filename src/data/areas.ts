// Single source of truth for the portfolio's shared identifiers.
// Projects are organized by AREA OF EXPERTISE — the visitor-facing way to
// browse the work. (Brand is kept only as quiet provenance metadata on a
// project; it is no longer a headline concept.)

export const BRAND_IDS = ['iasi', 'glunis', 'oxaciano'] as const;
export type BrandId = (typeof BRAND_IDS)[number];

// The three areas of expertise. These double as project categories so the
// Expertise section and the Projects filter stay perfectly in sync.
export const CATEGORY_IDS = ['operations', 'software-engineering', 'events-production'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

// Per-area presentation: label, Bootstrap context color, icon and gradient.
// Everything visual (expertise cards, project cards, case-study heroes) themes
// off this one map, so the colour of a thing always means its area.
export interface AreaMeta {
  label: string;
  color: string;
  icon: string;
  gradientClass: string;
}

export const AREA_META: Record<CategoryId, AreaMeta> = {
  operations: {
    label: 'Operations & Strategy',
    color: 'dark',
    icon: 'fas fa-project-diagram',
    gradientClass: 'gradient-black',
  },
  'software-engineering': {
    label: 'Software Engineering',
    color: 'success',
    icon: 'fas fa-laptop-code',
    gradientClass: 'gradient-success',
  },
  'events-production': {
    label: 'Events & Production',
    color: 'danger',
    icon: 'fas fa-microphone',
    gradientClass: 'gradient-danger',
  },
};

// Convenience label map (derived) for components that only need the text.
export const CATEGORY_LABELS = Object.fromEntries(
  Object.entries(AREA_META).map(([id, meta]) => [id, meta.label]),
) as Record<CategoryId, string>;
