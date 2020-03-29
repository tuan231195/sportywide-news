import { DefaultNews } from 'src/news/default-news';
import { CATEGORY } from '@vdtn359/news-models';
import Cheerio from 'cheerio';
import { getCleanedHTML } from 'src/news/utils';
import { axios } from './utils';

export class CnetNews extends DefaultNews {
	static url = 'www.cnet.com';
	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	getImage(element: Cheerio): string | undefined {
		const image = element.find('media\\:thumbnail');
		return image.length ? image.attr('url')! : undefined;
	}

	static async extractUrl(url: string) {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = Cheerio.load(newsPage);
		const storyContent = Cheerio.html($('#article-body'));
		return getCleanedHTML(storyContent);
	}
}
