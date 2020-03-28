import { Elasticsearch } from 'src/es';

export const NEWS_INDEX = 'news';

export async function setup(elasticsearch: Elasticsearch) {
	if (!(await elasticsearch.hasIndex(NEWS_INDEX))) {
		await elasticsearch.createIndex(NEWS_INDEX, {
			properties: {
				id: { type: 'keyword', store: true },
				title: { type: 'text', store: true },
				description: {
					type: 'text',
					store: true,
				},
				body: {
					type: 'text',
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
					type: 'text',
					store: true,
				},
				url: {
					type: 'text',
					store: true,
					index: false,
				},
			},
		});
	}
}
