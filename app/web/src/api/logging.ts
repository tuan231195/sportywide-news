import { logger } from 'src/setup';
import * as Sentry from '@sentry/node';
import VError from 'verror';

process.once('unhandledRejection', (e) => {
	logger.error('Unhandled rejections: ', e);
	Sentry.captureException(e);
});

export function errorLogger(err, req, res) {
	err = formatError(err);
	const status = err.status || 500;
	if (status >= 500) {
		Sentry.captureException(err);
		logger.error(err);
	}

	res.status(status).json({
		error: err.message || 'Internal Server Error',
	});
}

function formatError(error) {
	if (error.name === 'ResponseError') {
		return new VError({
			name: 'Elasticsearch error',
			cause: error,
			info: error.meta,
		});
	}
	return error;
}
