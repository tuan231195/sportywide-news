import { extractUrl } from 'src/news/factory';

describe('#extractUrl', () => {
	it('parse news urls correctly', async () => {
		let news = await extractUrl(
			'https://www.news.com.au/travel/travel-advice/coronavirus-in-australia-mandatory-quarantine-in-hotels-for-anyone-returning-from-overseas/news-story/353e68837a888122a223d53bb2e4cf03?from=rss-basic'
		);
		expect(news).toMatchSnapshot();

		news = await extractUrl(
			'https://www.cnet.com/news/best-wireless-earbuds-and-headphones-for-samsung'
		);
		expect(news).toMatchSnapshot();
	});
});
