import { AxiosInstance } from 'axios';
import Cheerio from 'cheerio';

export function getParsedXml(axios: AxiosInstance, url) {
	return axios.get(url).then(({ data, headers }) => {
		const contentType = headers['content-type'];
		if (
			contentType &&
			[
				'application/xml',
				'application/rss+xml',
				'text/xml; charset=UTF-8',
				'text/xml',
			].includes(contentType)
		) {
			return Cheerio.load(data, {
				xmlMode: true,
			});
		}
		return data;
	});
}
