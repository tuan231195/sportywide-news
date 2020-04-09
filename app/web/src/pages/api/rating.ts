/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { redis } from 'src/setup';
import { stringQuery } from 'src/api/parse';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';
import createError from 'http-errors';
import nextConnect from '@vdtn359/next-connect';
import { errorLogger } from 'src/api/logging';

const handler = nextConnect({ onError: errorLogger });

handler.post(request);

export default handler;

async function request(req: NextApiRequest, res: NextApiResponse) {
	const rating = parseFloat(stringQuery(req.body.rating));
	if (isNaN(rating) || rating < 0 || rating > 5) {
		throw new createError.BadRequest('Invalid rating');
	}
	let oldRating = parseFloat(stringQuery(req.body.oldRating));
	if (isNaN(oldRating)) {
		oldRating = 0;
	}
	if (oldRating < 0 || oldRating > 5) {
		throw new createError.BadRequest('Invalid rating');
	}
	const documentId = stringQuery(req.body.id);
	if (!documentId) {
		throw new createError.BadRequest('Document id is required');
	}
	const indexDoc: NewsStatDto = {
		docIds: [documentId],
		time: new Date(),
		rating,
		oldRating: oldRating || 0,
		type: ACTION_TYPE.RATE,
	};
	redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
	res.json({ message: 'ok' });
}
