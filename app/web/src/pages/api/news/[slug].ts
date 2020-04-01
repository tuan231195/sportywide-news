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
				term: {
					slug: req.query.slug,
				},
			},
		},
	});

	const document = hits[0] && hits[0]._source;

	if (!document) {
		return res.status(404).send('Not Found');
	}
	return res.json(document);
}
