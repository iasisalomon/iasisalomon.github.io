// getStaticPaths for the pages that exist once per entry and language.
// The route files under src/pages/ and src/pages/es/ only pick the language.

import { getCaseStudiesIn, getPostsIn } from '../data/queries';
import type { Locale } from '../i18n';

/** One page per post written in `lang`; each links to its newer and older neighbours. */
export async function postPaths(lang: Locale) {
  const posts = await getPostsIn(lang);
  return posts.map((post, i) => ({
    params: { slug: post.slug },
    props: { post, newer: posts[i - 1], older: posts[i + 1] },
  }));
}

/** One page per case study written in `lang`, newest first; previous/next walk that order. */
export async function caseStudyPaths(lang: Locale) {
  const studies = await getCaseStudiesIn(lang);
  return studies.map((study, i) => ({
    params: { slug: study.slug },
    props: { study, prev: studies[i - 1], next: studies[i + 1] },
  }));
}
