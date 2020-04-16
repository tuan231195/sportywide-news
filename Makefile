ansible_tags =

ifeq ($(ansible_tags),)
	ansible_opts=
else
	ansible_opts=--tags $(ansible_tags)
endif

buildCI:
	docker build -t vdtn359/news-ci .

buildWorker:
	docker build -t registry.heroku.com/vdtn359-news/worker -f app/worker/Dockerfile --target prod .

buildPacker:
	export DIGITALOCEAN_TOKEN=$(shell secrethub read vdtn359/start/vdtn359-news/digitalocean-token); \
	cd infra/packer && packer build vdtn359.json

provisionDigitalOcean:
	cd infra/terraform/digitalocean; \
	terraform init; \
	terraform apply -auto-approve

provisionHeroku:
	cd infra/terraform/heroku; \
	terraform init; \
	terraform apply -auto-approve

provisionCrawler:
	cd app/crawler && ./deploy.sh

provisionScheduler:
	cd app/scheduler && ./deploy.sh

playbook:
	cd infra/ansible && ansible-playbook -v main.yml $(ansible_opts)

pushCI: buildCI
	docker push vdtn359/news-ci

pushWorker: buildWorker
	docker push registry.heroku.com/vdtn359-news/worker

pushWeb: buildWeb
	docker push registry.heroku.com/vdtn359-news/web

releaseWorker:
	heroku container:release -a vdtn359-news worker

releaseWeb:
	heroku container:release -a vdtn359-news web
