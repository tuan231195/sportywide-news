import { merge } from 'lodash';
import * as search from '@vdtn359/news-search';
import IORedis from 'ioredis';
import { logging } from '@vdtn359/news-core';
import * as Sentry from '@sentry/node';
import { Logger } from 'winston';
import { env } from '@vdtn359/news-utils';

const configMap = {
	default: {
		es: {
			host: 'http://localhost:9200',
		},
		redis: {
			host: 'localhost',
			password: '',
		},
		sentry: {
			dsn: process.env.SENTRY_DSN,
		},
		logging: {
			level: 'debug',
			logzToken: process.env.LOGZ_TOKEN,
		},
		email: {
			apiKey: process.env.SENDGRID_API_KEY,
			supportEmail: 'help@vdtn359.com',
			adminEmail: 'admin@vdtn359.com',
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

Sentry.init({
	dsn: config.sentry?.dsn,
	environment: process.env.NODE_CONFIG_ENV,
	release: process.env.SENTRY_RELEASE,
	beforeSend(event) {
		if (env.isDevelopment()) {
			return null;
		}
		return event;
	},
});

export { Sentry };

export const es = search.connectToEs({
	node: config.es?.host,
});

export const redis = new IORedis({
	host: config.redis.host,
});
