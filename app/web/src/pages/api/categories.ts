/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { getHandler } from 'src/api/handler';
const handler = getHandler();
handler.get(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	const {
		body: {
			aggregations: {
				categories: { buckets },
			},
		},
	} = await es.search({
		index: NEWS_INDEX,
		body: {
			size: 0,
			aggs: {
				categories: {
					terms: { field: 'category' },
				},
			},
		},
	});

	res.json(
		buckets.map((bucket) => ({
			category: bucket.key,
			count: bucket.doc_count,
		}))
	);
}
