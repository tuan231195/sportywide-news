import { stringQuery } from 'src/api/parse';

export const FIELDS = [
	'id',
	'pubDate',
	'category',
	'image',
	'url',
	'title',
	'description',
	'slug',
];

export function parseFields(hits) {
	return hits.map((hit) => {
		const document = {
			score: hit._score,
			sort: hit.sort,
		};
		for (const [key, values] of Object.entries(hit.fields)) {
			document[key] = (values as any)[0];
		}
		return document;
	});
}

export function parseJsonQuery(query, field) {
	if (!query[field]) {
		return undefined;
	}
	try {
		return JSON.parse(stringQuery(query[field]));
	} catch {
		return undefined;
	}
}
