process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
import { fetchNews } from 'src/crawler';
import { saveNews, cleanup } from 'src/persister';
import { mergeMap } from 'rxjs/operators';

fetchNews()
	.pipe(mergeMap((newsDtos) => saveNews(newsDtos)))
	.subscribe({
		complete: async () => {
			console.info('Completed');
			await cleanup();
		},
		error: (e) => {
			console.error('Failed to crawl news', e);
		},
	});
