import { Sequelize } from 'sequelize-typescript';
import { News } from 'src/models';

export type ConnectDBOptions = {
	database: string;
	username: string;
	password: string;
	host: string;
};
export function connectDB(connectOptions: ConnectDBOptions) {
	return new Sequelize({
		...connectOptions,
		dialect: 'postgres',
		logging: false,
		repositoryMode: true,
		models: [News],
	});
}

export function connectDBUsingConfig(config) {
	return connectDB({
		username: config.get('db.username'),
		password: config.get('db.password'),
		database: 'news',
		host: config.get('db.host'),
	});
}
