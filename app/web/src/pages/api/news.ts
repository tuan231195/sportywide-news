/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { es } from 'src/setup';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { filterCategories } from 'src/utils/categories';

export default async function request(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {
		body: {
			hits: { hits },
		},
	} = await es.search({
		index: NEWS_INDEX,
		body: {
			query: buildEsQuery(req.query),
			stored_fields: [
				'id',
				'pubDate',
				'category',
				'image',
				'url',
				'title',
				'description',
				'slug',
			],
			sort: [{ pubDate: 'desc' }],
			search_after: req.query.searchAfter
				? [parseInt(req.query.searchAfter as string, 10)]
				: undefined,
		},
	});

	const newsDtos = hits.map((hit) => {
		const newsDto = {};
		for (const [key, values] of Object.entries(hit.fields)) {
			newsDto[key] = (values as any)[0];
		}
		return newsDto;
	});
	res.json(newsDtos);
}

function buildEsQuery(queryStr: any = {}) {
	let esQuery = {};
	if (queryStr.categories) {
		if (!Array.isArray(queryStr.categories)) {
			queryStr.categories = [queryStr.categories];
		}
		const categories = filterCategories(queryStr.categories);
		esQuery = {
			...esQuery,
			terms: {
				category: categories,
			},
		};
	} else {
		esQuery = {
			...esQuery,
			match_all: {},
		};
	}

	return esQuery;
}
