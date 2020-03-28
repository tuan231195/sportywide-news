import { DefaultNews } from 'src/news/default-news';
import { CATEGORY } from '@vdtn359/news-models';
import { axios, getCleanedHTML } from 'src/news/utils';
import Cheerio from 'cheerio';

export class SmhNews extends DefaultNews {
	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	static async extractUrl(url: string) {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = Cheerio.load(newsPage);
		const articleBody = $(
			'#content > div > div > article > div > div:nth-child(1) > div:nth-child(2)'
		);
		articleBody.find('time').remove();
		const storyContent = Cheerio.html(articleBody);
		return getCleanedHTML(storyContent);
	}
}
