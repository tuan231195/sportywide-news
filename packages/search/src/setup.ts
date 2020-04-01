/* eslint-disable @typescript-eslint/camelcase */
import { Elasticsearch } from 'src/es';

export const NEWS_INDEX = 'news';

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
					},
				},
			},
			mappings: {
				properties: {
					id: { type: 'keyword', store: true },
					title: {
						type: 'text',
						store: true,
						term_vector: 'yes',
						analyzer: 'fulltext',
					},
					description: {
						type: 'text',
						store: true,
						term_vector: 'yes',
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
			},
		});
	}
}
