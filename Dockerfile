FROM node:20.11.0-buster-slim as base

FROM base as development

WORKDIR /usr/src/app

COPY package.*json .

RUN npm install

COPY . .
