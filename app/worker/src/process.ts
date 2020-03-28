import { redis, setupRedis } from 'src/setup';
import { NEWS_GROUP, NEWS_STREAM } from '@vdtn359/news-schema';

export async function processStream(consumer) {
	await setupRedis();
	const stream = redis.readStream({
		group: NEWS_GROUP,
		stream: NEWS_STREAM,
		consumer,
	});
}
