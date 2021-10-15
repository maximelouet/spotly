FROM node:14.18-slim as build

ENV NODE_ENV=production

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY . ./

RUN npm run build


FROM nginx:1.20-alpine

RUN apk add bash

COPY --from=build /app/build/ /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

WORKDIR /usr/share/nginx/html

COPY copy-env.sh ./
COPY .env.dev ./.env

RUN chmod +x ./copy-env.sh

EXPOSE 3000

CMD ["/bin/sh", "-c", "./copy-env.sh && nginx -g \"daemon off;\""]
