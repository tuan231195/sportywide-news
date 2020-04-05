import { processStream } from 'src/processors/news';
import { NEWS_CONSUMER_PREFIX } from '@vdtn359/news-schema';
import { isMainThread, workerData } from 'worker_threads';
import { arr } from '@vdtn359/news-utils';
import { worker as w } from '@vdtn359/news-core';
import { logger, setupEs, setupRedis } from 'src/setup';

start();

const WORKER = 2;

async function start() {
	await setupRedis();
	await setupEs();
	if (isMainThread) {
		for (const id of arr.range(WORKER)) {
			const workerId = `${NEWS_CONSUMER_PREFIX}-${id}`;
			process.env.WORKER_ID = workerId;
			w.spawn(__filename, { workerData: { id: workerId } });
		}
	} else {
		const workerId = workerData.id;
		w.info(logger, `Starting`);
		processStream(workerId);
	}
}
