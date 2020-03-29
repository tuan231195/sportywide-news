import {
	Worker,
	WorkerOptions,
	isMainThread,
	parentPort,
} from 'worker_threads';

export const spawnWorker = (file: string, wkOpts: WorkerOptions) => {
	wkOpts.eval = true;
	if (!wkOpts.workerData) {
		wkOpts.workerData = {};
	}
	wkOpts.workerData.__filename = file;
	return new Worker(
		`
            const wk = require('worker_threads');
            const path = require('path');
            let file = wk.workerData.__filename;
            if (file.endsWith('.ts')) {
            	process.env.TS_NODE_TRANSPILE_ONLY = true;
            	process.env.TS_NODE_TYPE_CHECK = false;
            	require('ts-node').register();
            	require('tsconfig-paths').register({
            		baseUrl: '.',
  					paths: {
  						"src/*": ["./src/*"]
  					}
            	});
            }
            require(file);
        `,
		wkOpts
	);
};

export function error(...args) {
	logging('error', ...args);
}
export function warn(...args) {
	logging('warn', ...args);
}
export function info(...args) {
	logging('info', ...args);
}

export function logging(type, ...args) {
	if (isMainThread) {
		console[type](...args);
	} else if (parentPort) {
		parentPort.postMessage({
			type,
			args,
		});
	}
}
