FROM node:18-alpine as production

WORKDIR /usr/src/app

RUN npm install -g npm@10.1.0 @nestjs/cli

COPY ./package*.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3001

COPY ./utils/script.sh /

RUN chmod 755 /script.sh

ENTRYPOINT [ "sh", "/script.sh" ]