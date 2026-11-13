// Rehype plugin for Markdown tables.
//
// Copies each header cell's text onto the matching body cells as a
// `data-label` attribute, and marks tables with three or more columns with
// the `table-stack` class. On phones LongformLayout turns those into stacked
// cards (one per row, each value under its column name) instead of a wide
// table that scrolls sideways. Done at build time so no script is needed.

/** @param {any} node */
function textOf(node) {
	if (node.type === 'text') return node.value;
	return (node.children ?? []).map(textOf).join('');
}

/** @param {any} node @param {string} tag */
function findAll(node, tag, found = []) {
	if (node.type === 'element' && node.tagName === tag) found.push(node);
	for (const child of node.children ?? []) findAll(child, tag, found);
	return found;
}

/** @param {any} node */
function labelTables(node) {
	if (node.type === 'element' && node.tagName === 'table') {
		const labels = findAll(node, 'th').map((th) => textOf(th).trim());
		if (labels.length >= 3) {
			node.properties = { ...node.properties, className: [...(node.properties?.className ?? []), 'table-stack'] };
		}
		for (const row of findAll(node, 'tr')) {
			findAll(row, 'td').forEach((td, i) => {
				if (labels[i]) td.properties = { ...td.properties, dataLabel: labels[i] };
			});
		}
		return;
	}
	for (const child of node.children ?? []) labelTables(child);
}

export default function rehypeTableLabels() {
	return (/** @type {any} */ tree) => labelTables(tree);
}
