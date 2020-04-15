FROM vdtn359/news-ci AS build

RUN mkdir -p /opt
COPY taskfile.js /opt/
COPY ./package.json /opt/
COPY *.yaml /opt/
COPY ./packages/core/package.json /opt/packages/core/package.json
COPY ./packages/styles/package.json /opt/packages/styles/package.json
COPY ./packages/search/package.json /opt/packages/search/package.json
COPY ./packages/utils/package.json /opt/packages/utils/package.json
COPY ./packages/models/package.json /opt/packages/models/package.json
COPY ./app/web/package.json /opt/app/web/package.json

WORKDIR /opt
RUN npm set verify-store-integrity false
RUN pnpm recursive install --no-optional

WORKDIR /opt/app/web
RUN pnpm store prune
COPY *.json /opt/
COPY ./packages/*.json /opt/packages/
COPY ./packages/core /opt/packages/core
COPY ./packages/styles /opt/packages/styles
COPY ./packages/search /opt/packages/search
COPY ./packages/utils /opt/packages/utils
COPY ./packages/models /opt/packages/models
RUN cd /opt && pnpm run cli -- buildPackages
RUN mono-install --engine pnpm --install-dir produles --package-json ./package.json --package-lock ../../pnpm-lock.yaml -- --unsafe-perm --prod

COPY ./app/web /opt/app/web
RUN npm run build

FROM node:12-alpine AS prod

WORKDIR /opt/app
RUN mkdir -p /opt/app
COPY --from=build /opt/app/web/produles/node_modules /opt/app/node_modules
COPY --from=build /opt/app/web/.next /opt/app/.next
COPY --from=build /opt/app/web/public /opt/app/public
COPY --from=build /opt/app/web/package.json /opt/app/package.json
ENV NODE_ENV production
CMD ["npm", "start"]

