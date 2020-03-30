import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';
import { NewsDto } from '@vdtn359/news-models';

@Service()
export class NewsService {
	constructor(
		@Inject(() => ApiService) private readonly apiService: ApiService
	) {}

	fetchNews(nextTimestamp?: number): Promise<NewsDto[]> {
		return this.apiService
			.api()
			.get('/news', {
				params: {
					searchAfter: nextTimestamp ? nextTimestamp : undefined,
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
