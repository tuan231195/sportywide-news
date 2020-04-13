import { fetchNews } from 'src/crawler';
import { cleanup, saveNews } from 'src/persister';
import { mergeMap } from 'rxjs/operators';
import { Sentry, logger } from 'src/setup';
import { env, func } from '@vdtn359/news-utils';

if (env.isDevelopment()) {
	handler(null, {}, func.noop);
}

export function handler(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false;
	fetchNews()
		.pipe(mergeMap((newsDtos) => saveNews(newsDtos)))
		.subscribe({
			complete: async () => {
				await cleanup();
				logger.info('Completed');
				callback(null);
			},
			error: (e) => {
				logger.error('Failed to crawl news: ', e);
				Sentry.captureException(e);
				callback(e);
			},
		});
}
