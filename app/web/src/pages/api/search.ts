/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { logger } from 'src/api/logger';
import { buildEsQuery } from 'src/utils/search/query';
import { FIELDS, parseFields } from 'src/utils/search/fields';

async function request(req: NextApiRequest, res: NextApiResponse) {
	const from = req.query.from ? parseInt(req.query.from as string, 10) : 0;
	const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;
	const {
		body: {
			hits: {
				total: { value: total },
				hits,
			},
		},
	} = await es.search({
		index: NEWS_INDEX,
		from,
		size,
		body: {
			sort: req.query.search ? undefined : [{ pubDate: 'desc' }],
			track_scores: true,
			query: buildEsQuery(req.query),
			stored_fields: FIELDS,
		},
	});
	const newsDtos = parseFields(hits);
	res.json({
		items: newsDtos,
		pagination: {
			from,
			size,
			total,
		},
	});
}

export default logger(request);
