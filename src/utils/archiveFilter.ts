// Browser script for the filter tabs of an archive page (the blog's
// categories, the projects' areas). The tabs are real links (?category=tech),
// so they work without JavaScript; this filters in place instead of reloading.
//
// Markup:
//   <nav data-filter-param="category">            the URL parameter
//     <a data-filter="all" href="…">              one tab per value, plus "all"
//   <article data-filter-value="tech">            the items to show or hide
//   <p data-filter-empty hidden>                  shown when nothing matches

const ALL = 'all';

export function initArchiveFilter() {
  const nav = document.querySelector<HTMLElement>('[data-filter-param]');
  if (!nav) return;
  const param = nav.dataset.filterParam!;
  const tabs = [...nav.querySelectorAll<HTMLAnchorElement>('[data-filter]')];
  const items = document.querySelectorAll<HTMLElement>('[data-filter-value]');
  const empty = document.querySelector<HTMLElement>('[data-filter-empty]');

  function apply(requested: string) {
    // An unknown value (a mistyped or outdated link) shows everything.
    const value = tabs.some((tab) => tab.dataset.filter === requested) ? requested : ALL;
    let visible = 0;
    items.forEach((item) => {
      const match = value === ALL || item.dataset.filterValue === value;
      item.hidden = !match;
      if (match) visible++;
    });
    if (empty) empty.hidden = visible !== 0;

    tabs.forEach((tab) => {
      if (tab.dataset.filter === value) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });

    const url = new URL(window.location.href);
    if (value === ALL) url.searchParams.delete(param);
    else url.searchParams.set(param, value);
    history.replaceState(null, '', url.toString());
  }

  apply(new URLSearchParams(window.location.search).get(param) ?? ALL);

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      apply(tab.dataset.filter!);
    });
  });
}
