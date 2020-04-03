import { CnetNews } from 'src/news';

describe('#extractNews', () => {
	it('should strip style and css and data attributes', async () => {
		expect(
			await CnetNews.extractUrl(
				'https://www.cnet.com/news/every-livestream-concerts-coronavirus-shutdown'
			)
		).toMatchSnapshot();
	});
});
