import { fetchNews } from 'src/crawler';
import { cleanup, saveNews } from 'src/persister';
import { mergeMap } from 'rxjs/operators';
import { logger } from 'src/setup';

fetchNews()
	.pipe(mergeMap((newsDtos) => saveNews(newsDtos)))
	.subscribe({
		complete: async () => {
			logger.info('Completed');
			await cleanup();
		},
		error: (e) => {
			logger.error('Failed to crawl news', e);
		},
	});
