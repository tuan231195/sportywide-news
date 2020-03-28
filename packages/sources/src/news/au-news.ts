import { DefaultNews } from 'src/news/default-news';
import { CATEGORY } from '@vdtn359/news-models';
import axios from 'axios';
import Cheerio from 'cheerio';
import { getCleanedHTML } from 'src/news/utils';

export class AuNews extends DefaultNews {
	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	static async extractUrl(url: string): Promise<string> {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = Cheerio.load(newsPage);
		const storyContent = Cheerio.html($('.story-content'));
		return getCleanedHTML(storyContent);
	}
}
