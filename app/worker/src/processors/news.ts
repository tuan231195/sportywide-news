import { bufferTime, catchError, concatMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { es, logger, newsDao, redis } from 'src/setup';
import { NEWS_GROUP, NEWS_STREAM } from '@vdtn359/news-schema';
import { extractUrl, getThumbnailUrl } from '@vdtn359/news-sources';
import { NEWS_INDEX } from '@vdtn359/news-search';
import { worker as w } from '@vdtn359/news-core';

export async function processStream(consumer) {
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
				w.error(logger, e);
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
			const body = await extractUrl(newsModel.url);
			if (!body) {
				w.info(logger, `news ${newsModel.url} has no body`);
			}
			if (!newsModel.image && body) {
				w.info(logger, `adding image for news ${newsModel.url}`);
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

async function esSync(newsList: any[] = []) {
	w.info(logger, `Indexing ${newsList.length} documents`);
	try {
		const updatedDocuments = await Promise.all(
			newsList.map(async (news) => {
				if (await es.existsDocument(NEWS_INDEX, news.id)) {
					return {
						...news,
						indexType: 'upsert',
					};
				} else {
					return {
						...news,
						numViews: 0,
						ratings: 0,
						numRatings: 0,
						numSearches: 0,
						indexType: 'index',
					};
				}
			})
		);
		await es.bulkSync(NEWS_INDEX, updatedDocuments);
	} catch (e) {
		w.error(logger, 'Failed to index', e);
	}
}
