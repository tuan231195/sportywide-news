import { NewsDto } from '@vdtn359/news-models';
import { Sequelize, Repository } from 'sequelize-typescript';
import { News } from 'src/models';
import { Dao } from 'src/daos/dao.interface';

export class NewsDao implements Dao<News> {
	private newsRepository: Repository<News>;
	constructor(sequelize: Sequelize) {
		this.newsRepository = sequelize.getRepository(News);
	}

	save(newsDtos: NewsDto[]) {
		return this.newsRepository.bulkCreate(newsDtos, {
			updateOnDuplicate: ['description', 'image', 'title', 'pubDate'],
			returning: true,
		});
	}

	findByIds(itemIds: string[]): Promise<News[]> {
		return this.newsRepository.findAll({
			where: {
				id: itemIds,
			},
		});
	}
}
