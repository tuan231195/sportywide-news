/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { redis } from 'src/setup';
import { errorLogger } from 'src/api/logger';
import { stringQuery } from 'src/api/parse';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';

async function request(req: NextApiRequest, res: NextApiResponse) {
	const rating = parseFloat(stringQuery(req.body.rating));
	if (isNaN(rating) || rating < 0 || rating > 5) {
		return res.status(400).json({
			error: 'Invalid rating',
		});
	}
	const documentId = stringQuery(req.body.id);
	if (!documentId) {
		return res.status(400).json({
			error: 'Document id is required',
		});
	}
	const indexDoc: NewsStatDto = {
		docIds: [documentId],
		time: new Date(),
		num: rating,
		type: ACTION_TYPE.RATE,
	};
	redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
	res.json({ message: 'ok' });
}

export default errorLogger(request);
