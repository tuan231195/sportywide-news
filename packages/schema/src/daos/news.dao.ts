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
		const newsModels: Partial<News>[] = newsDtos.map((newsDto) => ({
			category: newsDto.category,
			id: newsDto.guid,
			description: newsDto.description,
			image: newsDto.image?.imageUrl,
			title: newsDto.title,
			feed: newsDto.feed,
			pubDate: newsDto.pubDate,
			url: newsDto.url,
		}));
		return this.newsRepository.bulkCreate(newsModels, {
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
