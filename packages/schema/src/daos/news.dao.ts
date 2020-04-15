import { NewsDto } from '@vdtn359/news-models';
import { Dao } from 'src/daos/dao.interface';
import { DB, NEWS_COLLECTION } from 'src/db';
import { subDays } from 'date-fns';
import { chunk } from 'lodash';

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

	async removeOldNews() {
		const snapshots = await this.db
			.collection(NEWS_COLLECTION)
			.where('pubDate', '<', subDays(new Date(), 7))
			.get();

		const chunks: any[] = chunk(Array.from(snapshots.docs), 100);
		for (const chunk of chunks) {
			const batch = this.db.batch();
			for (const doc of chunk) {
				batch.delete(doc.ref);
			}
			await batch.commit();
		}
		return snapshots.size;
	}
}
