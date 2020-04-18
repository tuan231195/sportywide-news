import { config } from '../setup';
import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
	domain: config.auth.domain,
	clientId: config.auth.clientId,
	clientSecret: config.auth.clientSecret,
	scope: 'openid email profile',
	redirectUri: `${config.url}/api/auth/callback`,
	postLogoutRedirectUri: config.url,
	session: {
		cookieSecret: config.auth.cookieSecret,
		cookieLifetime: 60 * 60 * 8,
	},
	oidcClient: {
		httpTimeout: 2500,
		clockTolerance: 10000,
	},
});
