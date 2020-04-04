/* eslint-disable @typescript-eslint/camelcase */
import { Elasticsearch } from 'src/es';

export const NEWS_INDEX = 'news';

const mappings = {
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

export async function setup(elasticsearch: Elasticsearch) {
	if (!(await elasticsearch.hasIndex(NEWS_INDEX))) {
		await elasticsearch.createIndex(NEWS_INDEX, {
			settings: {
				analysis: {
					analyzer: {
						html: {
							type: 'custom',
							char_filter: ['html_strip'],
							filter: ['lowercase', 'stop'],
							tokenizer: 'standard',
						},
						fulltext: {
							type: 'custom',
							tokenizer: 'standard',
							filter: ['lowercase', 'stop'],
						},
						trigram: {
							type: 'custom',
							tokenizer: 'standard',
							filter: ['lowercase', 'shingle'],
						},
						reverse: {
							type: 'custom',
							tokenizer: 'standard',
							filter: ['lowercase', 'reverse'],
						},
					},
					filter: {
						shingle: {
							type: 'shingle',
							min_shingle_size: 2,
							max_shingle_size: 3,
						},
					},
					tokenizer: {
						trigram: {
							type: 'ngram',
							min_gram: 3,
							max_gram: 3,
							token_chars: ['letter', 'digit'],
						},
					},
				},
			},
			mappings,
		});
	} else {
		await elasticsearch.indices.putMapping({
			index: NEWS_INDEX,
			body: mappings,
		});
	}
}
