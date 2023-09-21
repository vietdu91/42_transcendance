FROM node:18-alpine as development

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install xdg-utils
RUN npm install -g npm@latest
RUN npm install --save
RUN npm install prisma --save-dev
RUN npm i -g @nestjs/cli
RUN npm install -g npm@10.1.0 \
	&& npm install --legacy-peer-deps

COPY ./src ./

EXPOSE 3001

COPY ./utils/script.sh /

RUN chmod 755 /script.sh

# ENTRYPOINT [ "tail", "-f", "/dev/null" ]

CMD [ "/script.sh" ]

FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install prisma --save-dev\
	&& npm i -g @nestjs/cli \
	&& npm install -g npm@10.1.0 \
	&& npm install --legacy-peer-deps

COPY ./src .

EXPOSE 3001

COPY ./utils/script.sh /

RUN chmod 755 /script.sh

CMD [ "/script.sh" ]