const { sh, cli } = require('tasksfile');

function buildPackagesDev() {
	return sh('ts-transpile -b packages', {
		async: true,
	});
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
	return sh('ttsc -b packages', {
		async: true,
	});
}

function startAppDevs() {
	return Promise.all([
		sh('pnpm recursive run dev --filter @vdtn359/news-web', {
			async: true,
		}),
	]);
}

function buildApp() {
	return sh('pnpm recursive run build', {
		async: true,
	});
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

function postInstall() {
	sh(
		'link-parent-bin > /dev/null && link-parent-bin --child-directory-root app > /dev/null'
	);
	sh('pnpm recursive exec -- npx --no-install sort-package-json', {
		async: true,
	});
}

cli({
	buildPackagesDev,
	buildPackages,
	watchPackages,
	dev,
	build,
	deploy,
	postInstall,
});
