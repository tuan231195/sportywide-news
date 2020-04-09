/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es, redis } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import createError from 'http-errors';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';

import nextConnect from '@vdtn359/next-connect';
import { errorLogger } from 'src/api/logging';

const handler = nextConnect({ onError: errorLogger });

handler.get(request);

export default handler;

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
		throw new createError.NotFound();
	}
	const indexDoc: NewsStatDto = {
		docIds: [document.id],
		time: new Date(),
		type: ACTION_TYPE.VIEW,
	};
	redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
	return res.json(document);
}
