import { Inject, Service } from 'typedi';
import { ApiService } from 'src/services/api.service';
import { NewsDto } from '@vdtn359/news-models';

@Service()
export class EmailService {
	constructor(
		@Inject(() => ApiService) private readonly apiService: ApiService
	) {}

	contact(formData) {
		return this.apiService.api().post(`/contact`, formData);
	}
}
