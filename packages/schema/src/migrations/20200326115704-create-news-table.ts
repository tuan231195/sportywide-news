import { QueryInterface } from 'sequelize';
import * as SequelizeType from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
		return queryInterface.createTable('news', {
			id: {
				type: Sequelize.DataTypes.STRING,
				primaryKey: true,
			},
			url: {
				type: Sequelize.DataTypes.STRING(1024),
				allowNull: false,
			},
			image: Sequelize.DataTypes.STRING(1024),
			title: {
				type: Sequelize.DataTypes.STRING(1000),
				allowNull: false,
			},
			pubDate: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			description: Sequelize.DataTypes.TEXT,
			feed: {
				type: Sequelize.DataTypes.STRING(500),
				allowNull: false,
			},
			category: {
				type: Sequelize.DataTypes.ENUM(
					'SPORT',
					'NATIONAL',
					'WORLD',
					'LIFESTYLE',
					'TRAVEL',
					'ENTERTAINMENT',
					'TECHNOLOGY',
					'BUSINESS'
				),
			},
			createdAt: {
				type: Sequelize.DataTypes.DATE,
			},
			updatedAt: {
				type: Sequelize.DataTypes.DATE,
			},
		});
	},

	down: (queryInterface: QueryInterface) => {
		return queryInterface.dropTable('news');
	},
};
