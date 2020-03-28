process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
import config from 'config';
import {
	connectDBUsingConfig,
	connectRedisUsingConfig,
	NEWS_GROUP,
	NEWS_STREAM,
	Sequelize,
} from '@vdtn359/news-schema';

export const sequelize: Sequelize = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);

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
export { config };
