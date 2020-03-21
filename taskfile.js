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

cli({
	buildPackagesDev,
	buildPackages,
	watchPackages,
});
