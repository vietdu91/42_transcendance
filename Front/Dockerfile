# build step
FROM node:16.13.2-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY public ./public
COPY src ./src
COPY . ./
CMD ["npm", "start"]
