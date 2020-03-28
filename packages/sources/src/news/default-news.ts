import { News } from 'src/news.interface';
import { CATEGORY, NewsDto, NewsImageDto } from '@vdtn359/news-models';
import { getParsedXml } from 'src/news/utils';
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
			const url = element.find('link').text().trim();
			const title = element.find('title').text().trim();
			const description = element.find('description').text().trim();
			const pubDate =
				element.find('pubDate').text() || $('pubDate').text();

			return {
				category: this.category,
				guid: str.toGuid(url),
				title: title,
				description: description,
				image: this.getImage(element),
				pubDate: parse(
					pubDate,
					'E, dd MMM yyyy HH:mm:ss XX',
					new Date()
				),
				url,
				feed: this.rssFeed.trim(),
			};
		});
	}

	getImage(element: Cheerio): NewsImageDto | null {
		const image = element.find('image');
		return image.length
			? {
					imageDesc: image.find('title').text().trim(),
					imageUrl: image.find('link').text().trim(),
			  }
			: null;
	}
}
