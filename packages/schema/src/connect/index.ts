import { Sequelize } from 'sequelize-typescript';
import { News } from 'src/models';

export type ConnectOptions = {
	database: string;
	username: string;
	password: string;
};
export function connect(connectOptions: ConnectOptions) {
	return new Sequelize({
		...connectOptions,
		dialect: 'postgres',
		logging: false,
		repositoryMode: true,
		models: [News],
	});
}
