FROM node:12-slim as build

ENV NODE_ENV=production

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY . ./

RUN npm run build


FROM nginx:1.16-alpine

COPY --from=build /app/build/ /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]