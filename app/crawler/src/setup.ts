require('dotenv').config();
process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
import config from 'config';
import {
	connectDBUsingConfig,
	connectRedisUsingConfig,
	DB,
} from '@vdtn359/news-schema';
import { logging } from '@vdtn359/news-core';
import { Logger } from 'winston';

export const db: DB = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);
export const logger: Logger = logging.createLogger(
	'crawler',
	config.get('logging.level')
);

export { config };
