# build step
# FROM node:18-alpine as development

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install -g npm@10.1.0 \
# 	&& npm install --legacy-peer-deps

# CMD ["npm", "start"]

FROM node:18-alpine as production

WORKDIR /usr/src/app

RUN npm install -g serve

COPY package*.json ./

RUN npm install -g npm@10.1.0 \
	&& npm install --omit=dev --legacy-peer-deps

COPY . .

# RUN npm run build
ENTRYPOINT [ "npm", "start" ]
# ENTRYPOINT ["serve", "-s", "build"]
