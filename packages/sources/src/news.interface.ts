import { NewsDto } from '@vdtn359/news-models';

export interface News {
	extractFeeds(): Promise<NewsDto[]>;
	extractNews(url): Promise<string>;
}
