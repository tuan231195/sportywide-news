require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const withPWA = require('next-pwa');
const packageJson = require('./package.json');
process.env.SENTRY_RELEASE = packageJson.version;
const withPlugins = require('next-compose-plugins');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_CONFIG_ENV =
	process.env.NODE_CONFIG_ENV || process.env.NODE_ENV;
const supportedLocales = ['en'];
const isDevelopment = process.env.NODE_ENV === 'development';
const nextConfig = withPlugins([
	[
		(nextConfig) => {
			return Object.assign({}, nextConfig, {
				onDemandEntries: {
					// period (in ms) where the server will keep pages in the buffer
					maxInactiveAge: 250 * 1000,
					// number of pages that should be kept simultaneously without being disposed
					pagesBufferLength: 10,
				},
				compress: true,
				typescript: {
					ignoreDevErrors: true,
					ignoreBuildErrors: true,
				},
				webpack: (config, options) => {
					config.resolve.symlinks = true;
					if (typeof nextConfig.webpack === 'function') {
						return nextConfig.webpack(config, options);
					}
					if (!process.env.LOCAL) {
						config.externals = config.externals || [];
						config.externals.push({
							'aws-sdk': 'aws-sdk',
						});
					}

					if (options.isServer) {
						config.module.rules.push({
							test: /^(idb)$/,
							use: 'null-loader',
						});
					}

					config.module.rules.push({
						test: /^(worker_threads)$/,
						use: 'null-loader',
					});

					const originalEntry = config.entry;
					config.entry = async () => {
						let entries = await originalEntry();

						if (options.isServer) {
							entries = injectPolyfill(
								entries,
								path.resolve('src', 'server-polyfill.ts')
							);
						} else {
							entries['main.js'] = injectPolyfill(
								entries['main.js'],
								path.resolve('src', 'client-polyfill.ts')
							);
						}
						return entries;
					};

					config.plugins.push(
						new webpack.ContextReplacementPlugin(
							/date-fns[\/\\]/,
							new RegExp(
								`[/\\\\\](${supportedLocales.join(
									'|'
								)})[/\\\\\]`
							)
						)
					);

					if (!isDevelopment && process.env.SOURCEMAP) {
						config.devtool = 'source-map';

						for (const plugin of config.plugins) {
							if (plugin.constructor.name === 'UglifyJsPlugin') {
								plugin.options.sourceMap = true;
								break;
							}
						}

						if (
							config.optimization &&
							config.optimization.minimizer
						) {
							for (const plugin of config.optimization
								.minimizer) {
								if (
									plugin.constructor.name === 'TerserPlugin'
								) {
									plugin.options.sourceMap = true;
									break;
								}
							}
						}
					}

					config.resolve.alias = {
						...config.resolve.alias,
						src: path.resolve(__dirname, 'src'),
					};

					if (isDevelopment) {
						const packagePath = path.resolve(
							'..',
							'..',
							'packages'
						);
						config.resolve.alias = {
							...config.resolve.alias,
							'@vdtn359/news-utils': path.resolve(
								packagePath,
								'utils',
								'dist'
							),
							'@vdtn359/news-search': path.resolve(
								packagePath,
								'search',
								'dist'
							),
							'@vdtn359/news-core': path.resolve(
								packagePath,
								'core',
								'dist'
							),
							'@vdtn359/news-models': path.resolve(
								packagePath,
								'models',
								'dist'
							),
						};
					}

					config.plugins.push(
						new webpack.EnvironmentPlugin([
							'NODE_ENV',
							'NODE_CONFIG_ENV',
							'LOGZ_TOKEN',
							'ES_PASSWORD',
							'ES_USERNAME',
							'REDIS_PASSWORD',
							'SENDGRID_API_KEY',
							'SENTRY_RELEASE',
							'SENTRY_REPORTING_DSN',
						])
					);

					return config;
				},
			});
		},
	],
	[
		withPWA,
		{
			pwa: {
				dest: 'public',
				sw: 'service-worker.js',
				disable: process.env.NODE_ENV === 'development',
			},
		},
	],
]);

module.exports = nextConfig;

function injectPolyfill(entry, polyfillFile) {
	if (!entry) {
		return entry;
	}
	if (typeof entry === 'string') {
		return [polyfillFile, entry];
	}
	if (Array.isArray(entry) && !entry.includes(polyfillFile)) {
		return [polyfillFile, ...entry];
	}

	if (typeof entry === 'object') {
		return Object.keys(entry).reduce((currentMap, entryName) => {
			return {
				...currentMap,
				[entryName]: injectPolyfill(entry[entryName], polyfillFile),
			};
		}, {});
	}
	return entry;
}
