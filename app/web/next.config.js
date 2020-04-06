const path = require('path');
const webpack = require('webpack');
const withTM = require('next-transpile-modules')([
	'@vdtn359/news-utils',
	'@vdtn359/news-models',
	'@vdtn359/news-search',
]);
const withPlugins = require('next-compose-plugins');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const nextConfig = withPlugins(
	[
		[
			(nextConfig) => {
				return Object.assign({}, nextConfig, {
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
						} else {
							console.warn(
								'Bundling all node modules. Only doing this in development mode'
							);
						}

						if (options.isServer) {
							config.module.rules.push({
								test: /^(idb)$/,
								use: 'null-loader',
							});
						}

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

						config.resolve.alias = {
							...config.resolve.alias,
							src: path.resolve(__dirname, 'src'),
							'@vdtn359/news-utils': require.resolve(
								'@vdtn359/news-utils'
							),
							'@vdtn359/news-search': require.resolve(
								'@vdtn359/news-search'
							),
							'@vdtn359/news-models': require.resolve(
								'@vdtn359/news-models'
							),
						};

						config.plugins.push(
							new webpack.EnvironmentPlugin(['NODE_ENV'])
						);

						return config;
					},
				});
			},
		],
		[withTM],
	],
	{
		target: 'serverless',
	}
);

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
