import { merge } from 'lodash';
import * as search from '@vdtn359/news-search';

const configMap = {
	default: {
		es: {
			host: 'http://localhost:9200',
		},
	},
};

export const config = merge(
	{},
	configMap.default,
	configMap[process.env.NODE_ENV] || {}
);

export const es = search.connectToEs({
	node: config.es?.host,
});
