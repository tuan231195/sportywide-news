import { Inject, Service } from 'typedi';
import axios, { AxiosInstance } from 'axios';
import querystring from 'querystring';

@Service()
export class ApiService {
	private readonly axios: AxiosInstance;
	constructor(@Inject('baseUrl') private readonly baseUrl: string) {
		this.axios = axios.create({
			baseURL: `${baseUrl}/api`,
			paramsSerializer: (params) => querystring.stringify(params),
		});
	}

	api() {
		return this.axios;
	}
}
