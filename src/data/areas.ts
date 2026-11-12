// Single source of truth for project categories (areas of expertise) and
// the status labels of engineering repos.
import type { TranslationKey } from '../i18n';

export const CATEGORY_IDS = ['operations', 'software-engineering', 'events-production'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

// Per-area presentation: label, Bootstrap context color and gradient.
// Case-study pages theme off this one map, so the colour of a thing always
// means its area.
export interface AreaMeta {
  /** Translation key of the area's name. */
  label: TranslationKey;
  color: string;
  gradientClass: string;
}

export const AREA_META: Record<CategoryId, AreaMeta> = {
  operations: {
    label: 'areas.operations',
    color: 'dark',
    gradientClass: 'gradient-black',
  },
  'software-engineering': {
    label: 'areas.softwareEngineering',
    color: 'success',
    gradientClass: 'gradient-success',
  },
  'events-production': {
    label: 'areas.eventsProduction',
    color: 'danger',
    gradientClass: 'gradient-danger',
  },
};

// Honest label for repos shown in the Engineering section.
export const STATUS_IDS = ['practice', 'challenge', 'private deployment'] as const;
export type StatusId = (typeof STATUS_IDS)[number];

export const STATUS_LABELS: Record<StatusId, TranslationKey> = {
  practice: 'status.practice',
  challenge: 'status.challenge',
  'private deployment': 'status.privateDeployment',
};
