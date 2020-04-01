import * as SequelizeType from 'sequelize';
import { QueryInterface } from 'sequelize';
import { News } from 'src/models';
import { fromSequelize } from 'src/connect';
import { getSlug } from '@vdtn359/news-models';

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof SequelizeType
	) => {
		const db = fromSequelize(queryInterface.sequelize);
		if (!(await db.hasColumn('news', 'slug'))) {
			queryInterface.addColumn(
				'news',
				'slug',
				Sequelize.DataTypes.STRING(1024)
			);
		}
		const newsRepository = db.getRepository(News);
		const newsList = await newsRepository.findAll();
		await Promise.all(
			newsList.map(async (news) => {
				news.slug = getSlug(news.url);
				await news.save();
			})
		);
		queryInterface.changeColumn('news', 'slug', {
			type: Sequelize.DataTypes.STRING(1024),
			allowNull: false,
		});
		queryInterface.addIndex('news', {
			fields: ['slug'],
		});
	},

	down: (queryInterface: QueryInterface) => {
		queryInterface.removeColumn('news', 'slug');
	},
};
