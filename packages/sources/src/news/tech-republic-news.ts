import { DefaultNews } from 'src/news/default-news';
import { CATEGORY } from '@vdtn359/news-models';
import { axios, getCleanedHTML } from 'src/news/utils';
import Cheerio from 'cheerio';

export class TechRepublicNews extends DefaultNews {
	static url = 'www.techrepublic.com';

	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	static async extractUrl(url: string) {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = Cheerio.load(newsPage);
		const articleBody = $('article.article-single > div.content');
		const toRemove = ['[data-component="newsletterSubscription"]'];
		toRemove.forEach((section) => {
			articleBody.find(section).remove();
		});
		const storyContent = Cheerio.html(articleBody);
		return getCleanedHTML(storyContent);
	}
}
