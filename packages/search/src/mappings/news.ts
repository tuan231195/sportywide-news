/* eslint-disable @typescript-eslint/camelcase */
export const mappings = {
	properties: {
		id: { type: 'keyword' },
		title: {
			type: 'text',
			analyzer: 'fulltext',
			fields: {
				trigram: {
					type: 'text',
					analyzer: 'trigram',
				},
				reverse: {
					type: 'text',
					analyzer: 'reverse',
				},
			},
		},
		description: {
			type: 'text',
			analyzer: 'fulltext',
		},
		body: {
			type: 'text',
			analyzer: 'html',
		},
		slug: {
			type: 'keyword',
		},
		category: {
			type: 'keyword',
		},
		image: {
			type: 'text',
			index: false,
		},
		pubDate: { type: 'date' },
		numViews: {
			type: 'integer',
		},
		numSearches: {
			type: 'integer',
		},
		ratings: {
			type: 'float',
		},
		numRatings: {
			type: 'integer',
		},
		feed: {
			type: 'keyword',
		},
		url: {
			type: 'text',
			index: false,
		},
	},
};
