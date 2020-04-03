import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';
import { NewsDto } from '@vdtn359/news-models';
import { PaginationDto } from '@vdtn359/news-models/dist/dtos/pagination.dto';

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

	fetchNews(
		filter: { nextTimestamp?: number; categories?: string[] } = {}
	): Promise<NewsDto[]> {
		return this.apiService
			.api()
			.get('/news', {
				params: {
					categories: filter.categories,
					searchAfter: filter.nextTimestamp
						? filter.nextTimestamp
						: undefined,
				},
			})
			.then(({ data }) => data);
	}

	searchNews(
		filter: {
			search?: string;
			categories?: string[];
			from?: number;
			size?: number;
		} = {}
	): Promise<{
		items: NewsDto[];
		pagination: PaginationDto;
		terms: string[];
	}> {
		return this.apiService
			.api()
			.get('/search', {
				params: {
					categories: filter.categories,
					from: filter.from,
					size: filter.size,
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
}
