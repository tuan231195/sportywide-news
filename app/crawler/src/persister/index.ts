import { NewsDto } from '@vdtn359/news-models';
import { NEWS_STREAM, NewsDao } from '@vdtn359/news-schema';
import { process } from '@vdtn359/news-utils';
import { db, redis } from 'src/setup';

const newsDao = new NewsDao(db);

export async function saveNews(newsDtos: NewsDto[]) {
	const batcher = process.batch(newsDtos, 10);
	await batcher(async (dtos) => {
		await saveDb(dtos);
		await saveRedis(dtos);
	});
}

async function saveDb(dtos: NewsDto[]) {
	await newsDao.save(dtos);
}

async function saveRedis(dtos: NewsDto[]) {
	const pipeline = redis.pipeline();
	for (const newsDto of dtos) {
		pipeline.xadd(NEWS_STREAM, '*', 'id', newsDto.id);
	}
	await pipeline.exec();
}

export async function cleanup(): Promise<void> {
	await redis.disconnect();
	await db.terminate();
}
