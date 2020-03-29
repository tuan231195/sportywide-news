import { bufferTime, concatMap, filter, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { newsDao, redis, setupRedis, setupEs, es } from 'src/setup';
import { NEWS_GROUP, NEWS_STREAM } from '@vdtn359/news-schema';
import { extractUrl } from '@vdtn359/news-sources';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { getThumbnailUrl } from '@vdtn359/news-sources';
import { worker as w } from '@vdtn359/news-core';

export async function processStream(consumer) {
	await setupRedis();
	await setupEs();
	redis
		.readStream({
			group: NEWS_GROUP,
			stream: NEWS_STREAM,
			consumer,
		})
		.pipe(
			bufferTime(100, null, 20),
			concatMap(async (items: any[]) => {
				const itemIds = items.map(({ data }) => data.id);
				return getFullNews(itemIds);
			}),
			filter((news: any) => !!news?.length),
			catchError((e) => {
				w.error(e);
				return of([]);
			})
		)
		.subscribe({
			next: esSync,
		});
}

async function getFullNews(itemIds: string[]) {
	if (!itemIds.length) {
		return [];
	}
	const newsModels = await newsDao.findByIds(itemIds);
	return Promise.all(
		newsModels.map(async (newsModel) => {
			let body = '';
			const hasDocument = await es.hasDocument(NEWS_INDEX, newsModel.id);
			if (!hasDocument) {
				body = await extractUrl(newsModel.url);
				if (!body) {
					w.error(`news ${newsModel.url} has no body`);
				}
			}
			if (!newsModel.image && body) {
				newsModel.image = getThumbnailUrl(body);
				await newsModel.save();
			}
			return {
				...(body ? { body } : undefined),
				...newsModel.toJSON(),
			};
		})
	);
}

async function esSync(news: any[] = []) {
	w.info(`Indexing ${news.length} documents`);
	try {
		await es.bulkUpsert(NEWS_INDEX, news);
	} catch (e) {
		w.error('Failed to index', e);
	}
}
