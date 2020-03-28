import { DefaultNews } from 'src/news/default-news';
import { CATEGORY, NewsImageDto } from '@vdtn359/news-models';

export class CnetNews extends DefaultNews {
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
}
