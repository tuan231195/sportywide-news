import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';
import { NewsDto } from '@vdtn359/news-models';

export type NewsSearchDto = NewsDto & { score: number; sort: any[] };

@Service()
export class NewsService {
	constructor(
		@Inject(() => ApiService) private readonly apiService: ApiService
	) {}

	get(slug: string) {
		return this.apiService
			.api()
			.get(`/news/${slug}`)
			.then(({ data }) => data)
			.catch((e) => {
				if (e.response.status === 404) {
					return null;
				}
				throw e;
			});
	}

	suggestSimilar(id: string): Promise<NewsDto[]> {
		return this.apiService
			.api()
			.get(`/news/suggest/${id}`)
			.then(({ data }) => data)
			.catch(() => []);
	}

	fetchNews(
		filter: { searchAfter?: any[]; categories?: string[] } = {}
	): Promise<NewsSearchDto[]> {
		return this.apiService
			.api()
			.get('/news', {
				params: {
					categories: filter.categories,
					searchAfter: filter.searchAfter
						? JSON.stringify(filter.searchAfter)
						: undefined,
				},
			})
			.then(({ data }) => data);
	}

	searchNews(
		filter: {
			search?: string;
			size?: number;
			inline?: boolean;
			categories?: string[];
			searchAfter?: any[];
		} = {}
	): Promise<{
		items: NewsSearchDto[];
		suggestions: string[];
		terms: string[];
		total: number;
	}> {
		return this.apiService
			.api()
			.get('/search', {
				params: {
					categories: filter.categories,
					size: filter.size,
					inline: filter.inline,
					searchAfter: filter.searchAfter
						? JSON.stringify(filter.searchAfter)
						: undefined,
					search: filter.search,
				},
			})
			.then(({ data }) => data);
	}

	fetchCategories() {
		return this.apiService
			.api()
			.get('/categories')
			.then(({ data }) => data);
	}

	fetchHotTerms() {
		return this.apiService
			.api()
			.get('/hot-terms')
			.then(({ data }) => data);
	}

	fetchHotNews() {
		return this.apiService
			.api()
			.get('/hot-news')
			.then(({ data }) => data);
	}

	rating({ id, rating }) {
		return this.apiService
			.api()
			.post('/rating', {
				id,
				rating,
			})
			.then(({ data }) => data);
	}
}
