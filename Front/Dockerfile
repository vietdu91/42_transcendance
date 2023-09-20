# build step
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.1.0 \
	&& npm install --legacy-peer-deps

# CMD ["npm", "start"]
ENTRYPOINT ["tail", "-f", "/dev/null"]
