/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';

export default async function request(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {
		body: {
			hits: { hits },
		},
	} = await es.search({
		index: NEWS_INDEX,
		body: {
			query: {
				match_all: {},
			},
			stored_fields: [
				'id',
				'pubDate',
				'category',
				'image',
				'url',
				'title',
				'description',
			],
			sort: [{ pubDate: 'desc' }],
			search_after: req.query.searchAfter
				? [parseInt(req.query.searchAfter as string, 10)]
				: undefined,
		},
	});

	const newsDtos = hits.map((hit) => {
		const newsDto = {};
		for (const [key, values] of Object.entries(hit.fields)) {
			newsDto[key] = (values as any)[0];
		}
		return newsDto;
	});
	res.json(newsDtos);
}
