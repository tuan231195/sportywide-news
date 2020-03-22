const { sh, cli } = require('tasksfile');

function buildPackagesDev() {
	return sh('ts-transpile -b packages');
}

function watchPackages() {
	return sh('ts-transpile -b packages -w', {
		async: true,
	});
}

function buildPackages() {
	return sh('ttsc -b packages');
}

function startAppDevs() {
	return sh('pnpm recursive run dev', {
		async: true,
	});
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

cli({
	buildPackagesDev,
	buildPackages,
	watchPackages,
	dev,
	build,
	deploy,
});
