import { DefaultNews } from 'src/news/default-news';
import { CATEGORY, NewsImageDto } from '@vdtn359/news-models';
import Cheerio from 'cheerio';
import { getCleanedHTML } from 'src/news/utils';
import { axios } from './utils';

export class CnetNews extends DefaultNews {
	static url = 'www.cnet.com';
	constructor(category: CATEGORY, rssFeed: string) {
		super(category, rssFeed);
	}

	getImage(element: Cheerio): NewsImageDto | null {
		const image = element.find('media\\:thumbnail');
		return image.length
			? {
					imageUrl: image.attr('url')!,
			  }
			: null;
	}

	static async extractUrl(url: string) {
		const newsPage = await axios(url).then(({ data }) => data);
		const $ = Cheerio.load(newsPage);
		const storyContent = Cheerio.html($('#article-body'));
		return getCleanedHTML(storyContent);
	}
}
