require('dotenv').config();
import { logging } from '@vdtn359/news-core';
import { Logger } from 'winston';

process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';

import * as search from '@vdtn359/news-search';
import config from 'config';
import {
	connectDBUsingConfig,
	connectRedisUsingConfig,
	DB,
	NEWS_GROUP,
	NEWS_STATS_GROUP,
	NEWS_STATS_STREAM,
	NEWS_STREAM,
	NewsDao,
} from '@vdtn359/news-schema';

export const db: DB = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);
export const es = search.connectToEsUsingConfig(config);
export const logger: Logger = logging.createLogger(
	'worker',
	config.get('logging.level')
);
export const newsDao = new NewsDao(db);

export async function setupRedis() {
	try {
		await Promise.all([
			setupRedisStream(NEWS_STREAM, NEWS_GROUP),
			setupRedisStream(NEWS_STATS_STREAM, NEWS_STATS_GROUP),
		]);
	} catch (e) {
		logger.error('Failed to setup redis: ', e);
	}
}

export async function setupRedisStream(stream, group) {
	const streamExists = await redis.exists(stream);
	const extraArgs = streamExists ? [] : ['MKSTREAM'];
	try {
		await redis.xgroup('CREATE', stream, group, 0, ...extraArgs);
	} catch (e) {
		if (e.message !== 'BUSYGROUP Consumer Group name already exists') {
			throw e;
		}
	}
}

export async function setupEs() {
	try {
		return await search.setup(es);
	} catch (e) {
		logger.error('Failed to setup elasticsearch: ', e);
	}
}
export { config };
