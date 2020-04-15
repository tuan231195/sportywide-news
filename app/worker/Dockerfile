FROM vdtn359/news-ci AS build

RUN mkdir -p /opt
COPY taskfile.js /opt/
COPY ./package.json /opt/
COPY *.yaml /opt/
COPY ./packages/core/package.json /opt/packages/core/package.json
COPY ./packages/search/package.json /opt/packages/search/package.json
COPY ./packages/utils/package.json /opt/packages/utils/package.json
COPY ./packages/models/package.json /opt/packages/models/package.json
COPY ./packages/schema/package.json /opt/packages/schema/package.json
COPY ./packages/sources/package.json /opt/packages/sources/package.json
COPY ./app/worker/package.json /opt/app/worker/package.json

WORKDIR /opt
RUN npm set verify-store-integrity false
RUN pnpm recursive install --no-optional
COPY *.json /opt/
COPY ./packages /opt/packages

WORKDIR /opt/app/worker
RUN pnpm store prune
RUN cd /opt && pnpm run cli -- buildPackages
RUN mono-install --engine pnpm --install-dir produles --package-json ./package.json --package-lock ../../pnpm-lock.yaml -- --unsafe-perm --prod

COPY ./app/worker /opt/app/worker
RUN npm run build

FROM node:12-alpine AS prod

WORKDIR /opt/app
RUN mkdir -p /opt/app
COPY --from=build /opt/app/worker/produles/node_modules /opt/app/node_modules
COPY --from=build /opt/app/worker/dist /opt/app/dist
COPY --from=build /opt/app/worker/package.json /opt/app/package.json
ENV NODE_ENV production
CMD ["npm", "start"]
