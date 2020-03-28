import axios, { AxiosInstance } from 'axios';
import Cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
import adapter from 'axios/lib/adapters/http';

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

export function getCleanedHTML(source) {
	return DOMPurify.sanitize(source, {
		ALLOW_DATA_ATTR: false,
		FORBID_ATTR: ['style', 'class'],
	});
}

axios.defaults.adapter = adapter;
export { axios };
