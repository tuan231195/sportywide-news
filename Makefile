buildCI:
	docker build -t vdtn359/news-ci .

buildWorker:
	docker build --cache-from registry.heroku.com/vdtn359-news-worker/worker:build -t registry.heroku.com/vdtn359-news-worker/worker:build -f app/worker/Dockerfile --target build .
	docker build --cache-from registry.heroku.com/vdtn359-news-worker/worker:build --cache-from registry.heroku.com/vdtn359-news-worker/worker -t registry.heroku.com/vdtn359-news-worker/worker -f app/worker/Dockerfile --target prod .

pushCI: buildCI
	docker push vdtn359/news-ci

pushWorker: buildWorker
	docker push registry.heroku.com/vdtn359-news-worker/worker:build
	docker push registry.heroku.com/vdtn359-news-worker/worker

releaseWorker:
	heroku container:release worker
