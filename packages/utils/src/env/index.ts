export function isProduction(env = process.env.NODE_ENV) {
	return env === 'production';
}

export function isDevelopment(env = process.env.NODE_ENV) {
	return env === 'development';
}

export function isTesting(env = process.env.NODE_ENV) {
	return env === 'test';
}
