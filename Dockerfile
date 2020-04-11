FROM node:12-alpine
ENV TERRAFORM_VERSION=0.12.20

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl jq

RUN wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /usr/bin

RUN npm install -g pnpm@4.12.1 @vdtn359/mono-install
