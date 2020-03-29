process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
import config from 'config';
import {
	connectDBUsingConfig,
	DB,
	connectRedisUsingConfig,
} from '@vdtn359/news-schema';

export const db: DB = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);

export { config };
