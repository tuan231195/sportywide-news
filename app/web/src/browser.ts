import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import * as Sentry from '@sentry/browser';
import { env } from '@vdtn359/news-utils';

Sentry.init({
	dsn: process.env.SENTRY_DS,
	environment: process.env.NODE_CONFIG_ENV,
	release: process.env.SENTRY_RELEASE,
	beforeSend(event) {
		if (env.isDevelopment()) {
			return null;
		}
		return event;
	},
});

if (!env.isDevelopment()) {
	LogRocket.init('vdtn359/vdtn359-news');
	setupLogRocketReact(LogRocket);

	LogRocket.getSessionURL((sessionURL) => {
		Sentry.configureScope((scope) => {
			scope.setExtra('sessionURL', sessionURL);
		});
	});
}
