#!/usr/bin/env bash

VERSION="$(cat ./package.json | jq -r .version)"
{
    docker pull registry.heroku.com/vdtn359-news/worker:"$VERSION"
} || {
  echo "Building worker version $VERSION"
  npm run build
  npx mono-install --engine pnpm --install-dir produles --package-json ./package.json --package-lock ../../pnpm-lock.yaml --resolve --dry-run
  docker build -t registry.heroku.com/vdtn359-news/worker:$VERSION -f Dockerfile --target prod .
  docker tag registry.heroku.com/vdtn359-news/worker:$VERSION registry.heroku.com/vdtn359-news/worker:latest
  docker push registry.heroku.com/vdtn359-news/worker:$VERSION
  docker push registry.heroku.com/vdtn359-news/worker:latest
}
