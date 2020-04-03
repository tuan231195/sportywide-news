/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { logger } from 'src/api/logger';
import { buildEsQuery } from 'src/utils/search/query';
import { FIELDS, parseFields } from 'src/utils/search/fields';

async function request(req: NextApiRequest, res: NextApiResponse) {
	const searchQuery = Array.isArray(req.query.search)
		? req.query.search[0]
		: req.query.search;
	const from = req.query.from ? parseInt(req.query.from as string, 10) : 0;
	const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;
	const [searchResults, termsResult] = await Promise.all([
		search(req.query, from, size),
		significantTerms(req.query),
	]);
	const {
		body: {
			hits: {
				total: { value: total },
				hits,
			},
		},
	} = searchResults;
	let terms = [];
	if (termsResult) {
		terms =
			termsResult.body.aggregations?.search?.keywords?.buckets?.map(
				(bucket) => bucket.key
			) || [];
		terms = terms.filter(
			(term) => term.toLowerCase() !== searchQuery.toLowerCase()
		);
	}
	const newsDtos = parseFields(hits);
	res.json({
		items: newsDtos,
		terms,
		pagination: {
			from,
			size,
			total,
		},
	});
}

export default logger(request);

async function search(query, from, size) {
	return es.search({
		index: NEWS_INDEX,
		from,
		size,
		body: {
			sort: query.search ? undefined : [{ pubDate: 'desc' }],
			track_scores: true,
			query: buildEsQuery(query),
			stored_fields: FIELDS,
		},
	});
}

async function significantTerms(query) {
	if (!query.search) {
		return null;
	}
	return es.search({
		index: NEWS_INDEX,
		body: {
			query: buildEsQuery(query),
			aggregations: {
				search: {
					sampler: {
						shard_size: 100,
					},
					aggregations: {
						keywords: {
							significant_text: {
								field: 'body',
							},
						},
					},
				},
			},
		},
	});
}
