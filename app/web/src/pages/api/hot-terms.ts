/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es, redis } from 'src/setup';
import { NEWS_STAT_INDEX } from '@vdtn359/news-search';
import { errorLogger } from 'src/api/logger';

const termsCacheKey = 'vn:hot-terms';

async function request(req: NextApiRequest, res: NextApiResponse) {
	let cachedTerms = await redis.get(termsCacheKey);
	if (cachedTerms) {
		return res.json(JSON.parse(cachedTerms));
	}
	cachedTerms = await search();
	await redis.set(termsCacheKey, JSON.stringify(cachedTerms), 'EX', 30);
	res.json(cachedTerms);
}

export default errorLogger(request);

async function search() {
	const results = await es.search({
		index: NEWS_STAT_INDEX,
		body: {
			size: 0,
			aggregations: {
				hot_terms: {
					terms: {
						field: 'term',
						size: 5,
					},
				},
			},
		},
	});
	const {
		body: {
			aggregations: {
				hot_terms: { buckets: hotTerms },
			},
		},
	} = results;

	return hotTerms.map((term) => term.key);
}
