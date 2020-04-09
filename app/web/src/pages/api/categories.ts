/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import nextConnect from '@vdtn359/next-connect';
import { errorLogger } from 'src/api/logging';

const handler = nextConnect({ onError: errorLogger });

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
