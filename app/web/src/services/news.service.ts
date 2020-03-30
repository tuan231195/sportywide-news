import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';

@Service()
export class NewsService {
	constructor(
		@Inject(() => ApiService) private readonly apiService: ApiService
	) {}

	fetchNews() {
		return this.apiService
			.api()
			.get('/news')
			.then(({ data }) => data);
	}

	fetchCategories() {
		return this.apiService
			.api()
			.get('/categories')
			.then(({ data }) => data);
	}
}
