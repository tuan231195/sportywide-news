/* eslint-disable @typescript-eslint/camelcase */
export const mappings = {
	properties: {
		id: { type: 'keyword', store: true },
		title: {
			type: 'text',
			store: true,
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
			store: true,
			analyzer: 'fulltext',
		},
		body: {
			type: 'text',
			analyzer: 'html',
		},
		slug: {
			type: 'keyword',
			store: true,
		},
		category: {
			type: 'keyword',
			store: true,
		},
		image: {
			type: 'text',
			store: true,
			index: false,
		},
		pubDate: { type: 'date', store: true },
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
			store: true,
		},
		url: {
			type: 'text',
			store: true,
			index: false,
		},
	},
};
