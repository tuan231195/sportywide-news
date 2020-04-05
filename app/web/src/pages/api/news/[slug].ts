/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es, redis } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { logger } from 'src/api/logger';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';

async function request(req: NextApiRequest, res: NextApiResponse) {
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
	const indexDoc: NewsStatDto = {
		docIds: [document.id],
		time: new Date(),
		type: ACTION_TYPE.VIEW,
	};
	redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
	return res.json(document);
}

export default logger(request);
