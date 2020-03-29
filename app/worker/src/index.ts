import { processStream } from 'src/process';
import { NEWS_CONSUMER_PREFIX } from '@vdtn359/news-schema';
import { isMainThread, workerData } from 'worker_threads';
import { arr } from '@vdtn359/news-utils';
import { worker as w } from '@vdtn359/news-core';

const WORKER = 2;

if (isMainThread) {
	for (const id of arr.range(WORKER)) {
		const workerId = `${NEWS_CONSUMER_PREFIX}-${id}`;
		const worker = w.spawn(__filename, { workerData: { id } });
		worker.on('message', ({ type, args }) => {
			console[type](`[${workerId}] - `, ...args);
		});
	}
} else {
	const workerId = workerData.id;
	w.info(`Starting`);
	processStream(workerId).then(() => w.info(`Setup finished`));
}
