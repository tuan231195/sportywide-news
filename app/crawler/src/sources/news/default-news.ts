import { News } from 'src/sources/news.interface';
import { CATEGORY } from '@vdtn359/news-schema';

export abstract class DefaultNews implements News {
	protected constructor(protected readonly category: CATEGORY) {}

	abstract async extractFeeds();

	extractNews(url): Promise<string> {
		return url;
	}
}
