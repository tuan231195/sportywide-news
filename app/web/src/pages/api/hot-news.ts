/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { errorLogger } from 'src/api/logger';
import { buildCommonQuery } from 'src/utils/search/query';
import { FIELDS, parseFields } from 'src/utils/search/fields';

async function request(req: NextApiRequest, res: NextApiResponse) {
	const commonNews = await search();
	res.json(commonNews);
}

export default errorLogger(request);

async function search() {
	const results = await es.search({
		index: NEWS_INDEX,
		body: {
			track_scores: true,
			size: 20,
			sort: [
				{
					_score: {
						order: 'desc',
					},
				},
				{
					pubDate: {
						order: 'desc',
					},
				},
			],
			query: buildCommonQuery(),
			stored_fields: FIELDS,
		},
	});
	const {
		body: {
			hits: { hits },
		},
	} = results;

	return parseFields(hits) || [];
}
