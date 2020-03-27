const { sh, cli } = require('tasksfile');

function buildPackagesDev() {
	return sh('ts-transpile -b packages');
}

function watchPackages() {
	return sh(
		'chokidar --silent "packages/*/src/**/*" --initial -c "time ts-transpile -b packages"',
		{
			async: true,
		}
	);
}

function buildPackages() {
	return sh('ttsc -b packages');
}

function startAppDevs() {
	return Promise.all([
		sh('pnpm recursive run dev --filter @vdtn359/news-web', {
			async: true,
		}),
	]);
}

function buildApp() {
	return sh('pnpm recursive run build');
}

function deployApp() {
	return sh('pnpm recursive run deploy', {
		nopipe: true,
	});
}

function dev() {
	return Promise.all([watchPackages(), startAppDevs()]);
}

function build() {
	buildPackages();
	buildApp();
}

function deploy() {
	buildPackages();
	deployApp();
}

function migrate() {
	sh('pnpx sequelize-cli db:migrate', {
		cwd: 'packages/schema',
	});
}

cli({
	buildPackagesDev,
	buildPackages,
	watchPackages,
	dev,
	migrate,
	build,
	deploy,
});
