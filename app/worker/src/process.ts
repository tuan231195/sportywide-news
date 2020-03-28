import { bufferTime, concatMap } from 'rxjs/operators';
import { newsDao, redis, setupRedis } from 'src/setup';
import { NEWS_GROUP, NEWS_STREAM } from '@vdtn359/news-schema';

export async function processStream(consumer) {
	await setupRedis();
	const stream = redis
		.readStream({
			group: NEWS_GROUP,
			stream: NEWS_STREAM,
			consumer,
		})
		.pipe(
			bufferTime(100, null, 10),
			concatMap(async (items: any[]) => {
				if (!items.length) {
					return;
				}
				const itemIds = items.map(({ data }) => data.id);
				const news = await newsDao.findByIds(itemIds);
			})
		);
}
