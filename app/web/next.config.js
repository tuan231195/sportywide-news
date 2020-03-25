const withTM = require('next-transpile-modules')([
	'@vdtn359/news-utils',
	'@vdtn359/news-schema',
]);
const withPlugins = require('next-compose-plugins');

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

						config.resolve.alias = {
							...config.resolve.alias,
							'@vdtn359/news-utils': require.resolve(
								'@vdtn359/news-utils'
							),
							'@vdtn359/news-schema': require.resolve(
								'@vdtn359/news-schema'
							),
						};

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
