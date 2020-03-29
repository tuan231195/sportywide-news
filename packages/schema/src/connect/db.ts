import { Sequelize } from 'sequelize-typescript';
import { News } from 'src/models';
import { proxy } from '@vdtn359/news-utils';
import { DB, DBWrapper } from 'src/db';

export type ConnectDBOptions = {
	database: string;
	username: string;
	password: string;
	host: string;
};
export function connectDB(connectOptions: ConnectDBOptions): DB {
	const sequelize = new Sequelize({
		...connectOptions,
		dialect: 'postgres',
		logging: false,
		repositoryMode: true,
		models: [News],
	});
	const db = new DBWrapper(sequelize);
	return proxy.wrap(db, sequelize);
}

export function connectDBUsingConfig(config) {
	return connectDB({
		username: config.get('db.username'),
		password: config.get('db.password'),
		database: 'news',
		host: config.get('db.host'),
	});
}
