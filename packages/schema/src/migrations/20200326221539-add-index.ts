import { QueryInterface } from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface) => {
		return Promise.all([
			queryInterface.addIndex('news', {
				fields: ['category'],
			}),
			queryInterface.addIndex('news', {
				fields: ['url'],
			}),
		]);
	},

	down: (queryInterface: QueryInterface) => {
		return Promise.all([
			queryInterface.removeIndex('news', 'news_category'),
			queryInterface.removeIndex('news', 'news_url'),
		]);
	},
};
