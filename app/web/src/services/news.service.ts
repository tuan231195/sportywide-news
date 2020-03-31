import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';
import { NewsDto } from '@vdtn359/news-models';

@Service()
export class NewsService {
	constructor(
		@Inject(() => ApiService) private readonly apiService: ApiService
	) {}

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

	fetchCategories() {
		return this.apiService
			.api()
			.get('/categories')
			.then(({ data }) => data);
	}
}
