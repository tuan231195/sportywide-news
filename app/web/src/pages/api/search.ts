/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es, redis } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { logger } from 'src/api/logger';
import { buildEsQuery, buildSuggester } from 'src/utils/search/query';
import {
	FIELDS,
	parseFields,
	parseJsonQuery,
	parseSuggestions,
} from 'src/utils/search/fields';
import { stringQuery } from 'src/api/parse';
import { ACTION_TYPE, NewsStatDto } from '@vdtn359/news-models';

async function request(req: NextApiRequest, res: NextApiResponse) {
	const [searchResults, termsResult] = await Promise.all([
		search(req.query),
		significantTerms(req.query),
	]);

	res.json({
		...termsResult,
		...searchResults,
	});
}

export default logger(request);

async function search(query) {
	const searchAfter = parseJsonQuery(query, 'searchAfter');
	const searchQuery = stringQuery(query.search);
	const size = stringQuery(query.size);
	const results = await es.search({
		index: NEWS_INDEX,
		body: {
			track_scores: true,
			size: size ? parseInt(size, 10) : undefined,
			search_after: searchAfter,
			suggest: buildSuggester(query),
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
				{
					id: {
						order: 'desc',
					},
				},
			],
			query: buildEsQuery(query),
			stored_fields: FIELDS,
		},
	});
	const {
		body: {
			hits: {
				total: { value: total },
				hits,
			},
		},
	} = results;

	const suggestions = parseSuggestions(results.body.suggest?.suggests);

	const newsDtos = parseFields(hits) || [];
	if (searchQuery?.trim() && !query.inline) {
		const topSearch = newsDtos.slice(0, 3);
		if (topSearch.length) {
			const indexDoc: NewsStatDto = {
				docIds: topSearch.map((search) => search.id),
				time: new Date(),
				term: searchQuery,
				type: ACTION_TYPE.SEARCH,
			};
			redis.xadd('news-stats', '*', 'payload', JSON.stringify(indexDoc));
		}
	}

	return {
		suggestions,
		items: newsDtos,
		total,
	};
}

async function significantTerms(query) {
	if (!query.search) {
		return {
			terms: [],
		};
	}
	const results = await es.search({
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
	let terms = [];
	if (results) {
		const searchQuery = stringQuery(query.search);
		terms =
			results.body.aggregations?.search?.keywords?.buckets?.map(
				(bucket) => bucket.key
			) || [];
		terms = terms.filter(
			(term) => term.toLowerCase() !== searchQuery.toLowerCase()
		);
	}
	return {
		terms,
	};
}
