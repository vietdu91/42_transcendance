# build step
FROM node:16.13.2-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

# CMD ["npm", "start"]
ENTRYPOINT ["tail", "-f", "/dev/null"]
