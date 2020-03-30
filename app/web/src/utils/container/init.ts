import { env } from '@vdtn359/news-utils';
import { Container } from 'typedi';

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
	} else {
		container.set('baseUrl', window.location.origin);
	}
	return container;
}
