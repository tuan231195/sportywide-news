import { News } from 'src/sources/news.interface';
import { CATEGORY, NewsDto, NewsImageDto } from '@vdtn359/news-models';
import { getParsedXml } from 'src/sources/news/utils';
import axios, { AxiosInstance } from 'axios';
import { str } from '@vdtn359/news-utils';
import { parse } from 'date-fns';

export abstract class DefaultNews implements News {
	protected axios: AxiosInstance;
	protected constructor(
		protected readonly category: CATEGORY,
		protected rssFeed: string
	) {
		this.axios = axios.create({
			baseURL: rssFeed,
		});
	}

	async extractFeeds(): Promise<NewsDto[]> {
		const $: CheerioStatic = await getParsedXml(this.axios, this.rssFeed);
		return Array.from($('item')).map((node) => {
			const element = $(node);
			const url = element.find('link').text();
			const title = element.find('title').text();
			const description = element.find('description').text();

			return {
				category: this.category,
				guid: str.toGuid(url),
				title,
				description: description.trim(),
				image: this.getImage(element),
				pubDate: parse(
					element.find('pubDate').text(),
					'E, dd MMM yyyy HH:mm:ss XX',
					new Date()
				),
				url,
				feed: this.rssFeed,
			};
		});
	}

	getImage(element: Cheerio): NewsImageDto | null {
		const image = element.find('image');
		return image.length
			? {
					imageDesc: image.find('title').text(),
					imageUrl: image.find('link').text(),
			  }
			: null;
	}

	extractNews(url): Promise<string> {
		return url;
	}
}
