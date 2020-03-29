process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';

import * as search from '@vdtn359/news-search';
import config from 'config';
import {
	connectDBUsingConfig,
	connectRedisUsingConfig,
	DB,
	NEWS_GROUP,
	NEWS_STREAM,
	NewsDao,
} from '@vdtn359/news-schema';

export const db: DB = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);
export const es = search.connectToEsUsingConfig(config);

export const newsDao = new NewsDao(db);

export async function setupRedis() {
	const streamExists = await redis.exists(NEWS_STREAM);
	const extraArgs = streamExists ? [] : ['MKSTREAM'];
	try {
		await redis.xgroup('CREATE', NEWS_STREAM, NEWS_GROUP, 0, ...extraArgs);
	} catch (e) {
		if (e.message !== 'BUSYGROUP Consumer Group name already exists') {
			throw e;
		}
	}
}

export async function setupEs() {
	return search.setup(es);
}
export { config };
