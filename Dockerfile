FROM node:20.11.0-buster-slim as base

FROM base as development

WORKDIR /usr/src/app

COPY package.*json .

RUN npm install

COPY . .

RUN npm run build

FROM base as production

WORKDIR /usr/src/app

COPY package.*json .

RUN npm install --omit=dev --ignore-scripts

COPY --from=development /usr/src/app/dist ./dist

CMD ["npm","run","start"]

