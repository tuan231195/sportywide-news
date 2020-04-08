import { NewsDto } from '@vdtn359/news-models';
import { Dao } from 'src/daos/dao.interface';
import { DB, NEWS_COLLECTION } from 'src/db';

export class NewsDao implements Dao<NewsDto> {
	constructor(private readonly db: DB) {}

	save(newsDtos: NewsDto[]) {
		return this.db.save(NEWS_COLLECTION, newsDtos);
	}

	saveOne(newsDto) {
		return this.db.saveOne(NEWS_COLLECTION, newsDto);
	}

	async findByIds(itemIds: string[]): Promise<NewsDto[]> {
		return this.db.findByIds(NEWS_COLLECTION, itemIds);
	}
}
