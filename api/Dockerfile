FROM node:14.16-slim

ENV NODE_ENV=production

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY . ./

EXPOSE 3001

CMD ["npm", "run", "prod"]
