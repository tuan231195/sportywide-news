import { DefaultNews } from 'src/sources/news/default-news';
import axios, { AxiosInstance } from 'axios';
import { CATEGORY, NewsDto } from '@vdtn359/news-schema';
import url from 'url';
import { str } from '@vdtn359/news-utils';
import { getParsedXml } from 'src/sources/news/utils';
import { parse } from 'date-fns';

export class SmhNews extends DefaultNews {
	private readonly axios: AxiosInstance;

	constructor(category: CATEGORY, private readonly rssFeed: string) {
		super(category);
		this.axios = axios.create({
			baseURL: rssFeed,
		});
	}

	async extractFeeds(): Promise<NewsDto[]> {
		const host: any = url.parse(this.rssFeed);
		const $: CheerioStatic = await getParsedXml(axios, this.rssFeed);
		const pubDate = new Date();
		console.log($('pubDate').text());
		return Array.from($('item')).map((node) => {
			const element = $(node);
			const url = element.find('link').text();
			const title = element.find('title').text();
			const description = element.find('description').text();
			return {
				category: this.category,
				website: host.hostname,
				guid: str.toGuid(url),
				title,
				description: description.trim(),
				image: null,
				pubDate: parse(
					$('pubDate').text(),
					'E, dd MMM yyyy HH:mm:ss XX',
					new Date()
				),
				url,
				feed: this.rssFeed,
			};
		});
	}
}
