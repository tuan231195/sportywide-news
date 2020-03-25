import { NewsDto } from '@vdtn359/news-schema';

export interface News {
	extractFeeds(): Promise<NewsDto[]>;
	extractNews(url): Promise<string>;
}
