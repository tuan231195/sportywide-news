/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { buildEsQuery } from 'src/utils/search/query';
import { FIELDS, parseFields, parseJsonQuery } from 'src/utils/search/fields';
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
			query: buildEsQuery(req.query),
			_source: FIELDS,
			sort: [
				{
					pubDate: {
						order: 'desc',
					},
				},
				{
					id: {
						order: 'desc',
					},
				},
			],
			search_after: parseJsonQuery(req.query, 'searchAfter'),
		},
	});

	const newsDtos = parseFields(hits);
	res.json(newsDtos);
}
