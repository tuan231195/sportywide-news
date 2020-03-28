process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
import config from 'config';
import {
	connectDBUsingConfig,
	connectRedisUsingConfig,
	Sequelize,
} from '@vdtn359/news-schema';

export const sequelize: Sequelize = connectDBUsingConfig(config);
export const redis = connectRedisUsingConfig(config);

export { config };
