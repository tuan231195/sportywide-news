import nextConnect from '@vdtn359/next-connect';
import { errorLogger } from 'src/api/logging';
import {
	corsMiddleware,
	helmetMiddleware,
	loggingMiddleware,
} from 'src/api/middlewares';

export function getHandler() {
	const handler = nextConnect({ onError: errorLogger });
	handler.use(helmetMiddleware);
	handler.use(corsMiddleware);
	handler.use(loggingMiddleware);
	return handler;
}
