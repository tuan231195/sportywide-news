import { Service, Inject } from 'typedi';
import axios, { AxiosInstance } from 'axios';

@Service()
export class ApiService {
	private readonly axios: AxiosInstance;
	constructor(@Inject('baseUrl') private readonly baseUrl: string) {
		this.axios = axios.create({
			baseURL: `${baseUrl}/api`,
		});
	}

	api() {
		return this.axios;
	}
}
