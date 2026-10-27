// Single source of truth for project categories (areas of expertise).

export const CATEGORY_IDS = ['operations', 'software-engineering', 'events-production'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

// Per-area presentation: label, Bootstrap context color and gradient.
// Case-study pages theme off this one map, so the colour of a thing always
// means its area.
export interface AreaMeta {
  label: string;
  color: string;
  gradientClass: string;
}

export const AREA_META: Record<CategoryId, AreaMeta> = {
  operations: {
    label: 'Operations',
    color: 'dark',
    gradientClass: 'gradient-black',
  },
  'software-engineering': {
    label: 'Software Engineering',
    color: 'success',
    gradientClass: 'gradient-success',
  },
  'events-production': {
    label: 'Events & Production',
    color: 'danger',
    gradientClass: 'gradient-danger',
  },
};
