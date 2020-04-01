import axios, { AxiosInstance } from 'axios';
import Cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
import adapter from 'axios/lib/adapters/http';
import htmlToText from 'html-to-text';

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
		FORBID_ATTR: ['style', 'class', 'id'],
	});
}

export function getThumbnailUrl(source) {
	const $ = Cheerio.load(source);
	return $('img').eq(0).attr('src');
}

export function getRawText(source) {
	return htmlToText.fromString(source, {
		wordwrap: 130,
		format: {
			text: function (elem) {
				if (elem.parent?.name === 'div') {
					return `${elem.data}\n`;
				} else if (elem.parent?.name === 'span') {
					return `${elem.data} `;
				}
				return elem.data;
			},
		},
	});
}

axios.defaults.adapter = adapter;
export { axios };