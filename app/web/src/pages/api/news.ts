/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { logger } from 'src/api/logger';
import { buildEsQuery } from 'src/utils/search/query';
import { FIELDS, parseFields } from 'src/utils/search/fields';

async function request(req: NextApiRequest, res: NextApiResponse) {
	const {
		body: {
			hits: { hits },
		},
	} = await es.search({
		index: NEWS_INDEX,
		body: {
			query: buildEsQuery(req.query),
			stored_fields: FIELDS,
			sort: [{ pubDate: 'desc' }],
			search_after: req.query.searchAfter
				? [parseInt(req.query.searchAfter as string, 10)]
				: undefined,
		},
	});

	const newsDtos = parseFields(hits);
	res.json(newsDtos);
}

export default logger(request);
