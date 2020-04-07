import { Inject, Service } from 'typedi';
import axios, { AxiosInstance } from 'axios';
import querystring from 'querystring';

@Service()
export class ApiService {
	private readonly axios: AxiosInstance;
	constructor(
		@Inject('baseUrl') private readonly baseUrl: string,
		@Inject('context') private readonly ctx
	) {
		this.axios = axios.create({
			baseURL: `${baseUrl}/api`,
			paramsSerializer: (params) => querystring.stringify(params),
			headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
		});
	}

	api() {
		return this.axios;
	}
}
