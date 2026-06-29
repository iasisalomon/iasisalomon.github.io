// Single source of truth for the portfolio's shared identifiers.
// Brands, project categories (areas of expertise) and their human-facing
// labels live here so every component references the same canonical values.

export const BRAND_IDS = ['iasi', 'glunis', 'oxaciano'] as const;
export type BrandId = (typeof BRAND_IDS)[number];

// Project categories double as "areas of expertise" (see Plan 01).
export const CATEGORY_IDS = ['code', 'event', 'data-science', 'education'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

// Human-facing labels for each category/area.
export const CATEGORY_LABELS: Record<CategoryId, string> = {
  code: 'Software Engineering',
  event: 'Events & Production',
  'data-science': 'Data Science',
  education: 'Education',
};

// Canonical order brands are displayed in across the site.
export const BRAND_ORDER: readonly BrandId[] = ['iasi', 'glunis', 'oxaciano'];
