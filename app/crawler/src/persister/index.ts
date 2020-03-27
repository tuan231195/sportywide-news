import { NewsDto } from '@vdtn359/news-models';
import {
	connectDB,
	connectRedis,
	News,
	NEWS_STREAM,
} from '@vdtn359/news-schema';
import config from 'config';
import { process } from '@vdtn359/news-utils';

const sequelize = connectDB({
	username: config.get('db.username'),
	password: config.get('db.password'),
	database: 'news',
	host: config.get('db.host'),
});

const redis = connectRedis({
	password: config.get('redis.password'),
	host: config.get('redis.host'),
});

const newsRepository = sequelize.getRepository(News);

export async function saveNews(newsDtos: NewsDto[]) {
	const batcher = process.batch(newsDtos, 10);
	await batcher(async (dtos) => {
		await saveDb(dtos);
		await saveRedis(dtos);
	});
}

async function saveDb(dtos: NewsDto[]) {
	const newsModels: Partial<News>[] = dtos.map((newsDto) => ({
		category: newsDto.category,
		id: newsDto.guid,
		description: newsDto.description,
		image: newsDto.image?.imageUrl,
		title: newsDto.title,
		feed: newsDto.feed,
		pubDate: newsDto.pubDate,
		url: newsDto.url,
	}));
	await newsRepository.bulkCreate(newsModels, {
		updateOnDuplicate: ['description', 'image', 'title', 'pubDate'],
	});
}

async function saveRedis(dtos: NewsDto[]) {
	const pipeline = redis.pipeline();
	for (const newsDto of dtos) {
		pipeline.xadd(NEWS_STREAM, '*', 'id', newsDto.guid);
	}
	await pipeline.exec();
}
export function cleanup(): Promise<void> {
	return sequelize.close();
}
