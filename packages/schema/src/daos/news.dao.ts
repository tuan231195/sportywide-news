import { NewsDto } from '@vdtn359/news-models';
import { Repository } from 'sequelize-typescript';
import { News } from 'src/models';
import { Dao } from 'src/daos/dao.interface';
import { DB } from 'src/db';

export class NewsDao implements Dao<News> {
	private newsRepository: Repository<News>;
	constructor(db: DB) {
		this.newsRepository = db.getRepository(News);
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
