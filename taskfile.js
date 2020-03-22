const { sh, cli } = require('tasksfile');

function buildPackagesDev() {
	sh('ts-transpile -b packages');
}

function watchPackages() {
	sh('ts-transpile -b packages -w', {
		async: true,
	});
}

function buildPackages() {
	sh('ttsc -b packages');
}

function dev() {
	sh('pnpm recursive run dev', {
		async: true,
	});
}

cli({
	buildPackagesDev,
	buildPackages,
	watchPackages,
	dev,
});
