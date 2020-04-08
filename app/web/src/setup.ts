import { merge } from 'lodash';
import * as search from '@vdtn359/news-search';
import IORedis from 'ioredis';
import { logging } from '@vdtn359/news-core';
import { Logger } from 'winston';

const configMap = {
	default: {
		es: {
			host: 'http://localhost:9200',
		},
		redis: {
			host: 'localhost',
			password: '',
		},
		logging: {
			level: 'debug',
			logzToken: process.env.LOGZ_TOKEN,
		},
	},
};

export const config = merge(
	{},
	configMap.default,
	configMap[process.env.NODE_ENV] || {}
);

export const logger: Logger = logging.createLogger(
	'web',
	config.logging?.level,
	{
		logzToken: config.logging?.logzToken,
	}
);

export const es = search.connectToEs({
	node: config.es?.host,
});

export const redis = new IORedis({
	host: config.redis.host,
});
