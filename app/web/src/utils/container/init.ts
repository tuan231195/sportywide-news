import { env } from '@vdtn359/news-utils';
import { Container } from 'typedi';
import { initDB } from 'src/utils/db/store';

export function init(ctx) {
	if (ctx && ctx.container) {
		return ctx.container;
	}
	const container = Container.of(ctx.req);
	if (ctx.req) {
		container.set(
			'baseUrl',
			`${env.isDevelopment() ? ctx.req.protocol || 'http' : 'https'}://${
				ctx.req.headers.host
			}`
		);
		container.set('db', Promise.resolve({}));
	} else {
		container.set('baseUrl', window.location.origin);
		container.set('db', initDB());
	}
	return container;
}
