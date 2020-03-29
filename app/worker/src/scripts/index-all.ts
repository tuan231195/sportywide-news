import { db, redis } from 'src/setup';
import { map, bufferTime, concatMap } from 'rxjs/operators';
import { NEWS_STREAM } from '@vdtn359/news-schema';

run().then(() => process.exit(0));

async function run() {
	const stream = await db.stream('SELECT id FROM news');
	return stream
		.pipe(
			map((row) => row.id),
			bufferTime(100, null, 20),
			concatMap(async (ids) => {
				const pipeline = redis.pipeline();
				for (const id of ids) {
					pipeline.xadd(NEWS_STREAM, '*', 'id', id);
				}
				await pipeline.exec();
			})
		)
		.toPromise();
}
