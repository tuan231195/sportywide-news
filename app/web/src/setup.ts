import { merge } from 'lodash';
import * as search from '@vdtn359/news-search';
import IORedis from 'ioredis';

const configMap = {
	default: {
		es: {
			host: 'http://localhost:9200',
		},
		redis: {
			host: 'localhost',
			password: '',
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

export const redis = new IORedis({
	host: config.redis.host,
});
