import { DefaultNews } from 'src/sources/news/default-news';
import axios, { AxiosInstance } from 'axios';
import { CATEGORY, NewsDto } from '@vdtn359/news-models';
import url from 'url';
import { str } from '@vdtn359/news-utils';
import { getParsedXml } from 'src/sources/news/utils';

export class AuNews extends DefaultNews {
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
		const pubDate = new Date($('pubDate').text());
		return Array.from($('item')).map((node) => {
			const element = $(node);
			const url = element.find('link').text();
			const title = element.find('title').text();
			const description = element.find('description').text();
			const image = element.find('image');
			return {
				category: this.category,
				website: host.hostname,
				guid: str.toGuid(url),
				title,
				description: description.trim(),
				image: image.length
					? {
							imageDesc: image.find('title').text(),
							imageUrl: image.find('link').text(),
					  }
					: null,
				pubDate,
				url,
				feed: this.rssFeed,
			};
		});
	}
}
