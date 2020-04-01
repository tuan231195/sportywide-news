/*  eslint-disable @typescript-eslint/camelcase */
import { filterCategories } from 'src/utils/categories';

export function buildEsQuery(queryStr: any = {}) {
	const mustQuery = [];
	if (queryStr.categories) {
		if (!Array.isArray(queryStr.categories)) {
			queryStr.categories = [queryStr.categories];
		}
		const categories = filterCategories(queryStr.categories);
		mustQuery.push({
			terms: {
				category: categories,
			},
		});
	}

	if (queryStr.search) {
		mustQuery.push({
			bool: {
				should: [
					{
						match_phrase: {
							title: {
								boost: 2,
								query: queryStr.search,
							},
						},
					},
					{
						match_phrase: {
							description: {
								boost: 1.5,
								query: queryStr.search,
							},
						},
					},
					{
						match_phrase: {
							body: {
								boost: 1,
								query: queryStr.search,
							},
						},
					},
				],
				minimum_should_match: 1,
			},
		});
	}

	if (!mustQuery.length) {
		mustQuery.push({
			match_all: {},
		});
	}

	return {
		bool: {
			must: mustQuery,
		},
	};
}
