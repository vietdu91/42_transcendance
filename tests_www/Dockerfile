# build step
FROM node:16.13.2-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install react-router-dom
RUN npm install awesome-typescript-loader source-map-loader

COPY public ./public
COPY src ./src
COPY . ./

CMD ["npm", "start"]
