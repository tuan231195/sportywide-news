/*  eslint-disable @typescript-eslint/camelcase */
import { filterCategories } from 'src/utils/categories';
import { flatMap } from 'lodash';
import { arrayQuery, stringQuery } from 'src/api/parse';

export function buildEsQuery(queryStr: any = {}) {
	const mustQuery = [];
	if (queryStr.categories) {
		queryStr.categories = arrayQuery(queryStr.categories);
		const categories = filterCategories(queryStr.categories);
		mustQuery.push({
			terms: {
				category: categories,
			},
		});
	}

	if (queryStr.search) {
		const searchQuery = stringQuery(queryStr.search);
		mustQuery.push(constructSearchQuery(searchQuery));
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

export function buildSuggester(queryStr) {
	if (!queryStr.search) {
		return undefined;
	}
	return {
		suggests: {
			text: stringQuery(queryStr.search),
			phrase: {
				field: 'title.trigram',
				max_errors: 2,
				direct_generator: [
					{
						field: 'title.trigram',
						suggest_mode: 'popular',
					},
					{
						field: 'title.reverse',
						suggest_mode: 'popular',
						pre_filter: 'reverse',
						post_filter: 'reverse',
					},
				],
			},
		},
	};
}

function constructSearchQuery(searchQuery) {
	const phrases = Array.from(searchQuery.matchAll(/"(.*?)"/g)).map(
		(match) => match[1]
	);
	const must = [];
	const should = [getContentQuery(searchQuery, false)];

	if (phrases.length) {
		for (const phrase of phrases) {
			must.push({
				bool: {
					should: getContentQuery(phrase, true),
					minimum_should_match: 1,
				},
			});
		}
	}

	return {
		bool: {
			should: flatMap(should),
			must,
			minimum_should_match: 1,
		},
	};
}

function getContentQuery(searchQuery, isPhraseMatch) {
	return [
		{
			[isPhraseMatch ? 'match_phrase' : 'match']: {
				title: {
					boost: 2,
					query: searchQuery,
				},
			},
		},
		{
			[isPhraseMatch ? 'match_phrase' : 'match']: {
				description: {
					boost: 1.5,
					query: searchQuery,
				},
			},
		},
		{
			[isPhraseMatch ? 'match_phrase' : 'match']: {
				body: {
					boost: 1,
					query: searchQuery,
				},
			},
		},
	];
}
