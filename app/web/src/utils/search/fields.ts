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
		};
		for (const [key, values] of Object.entries(hit.fields)) {
			document[key] = (values as any)[0];
		}
		return document;
	});
}
