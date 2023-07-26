# Utilisez une image de base Node.js 14
FROM node:lts-alpine

# Définissez le répertoire de travail
WORKDIR /usr/src/app

# Installation de NestJS CLI globalement
# Copiez les fichiers package.json et package-lock.json
COPY ./package*.json ./

# Installez les dépendances
RUN npm install xdg-utils
RUN npm install -g npm@latest
RUN npm install --save
RUN npm install prisma --save-dev
RUN npm i -g @nestjs/cli
RUN npm i

# Copiez tous les autres fichiers
COPY ./src ./

# Exposez le port 300
EXPOSE 3001

COPY ./utils/script.sh /

RUN chmod 755 /script.sh

# Démarrez l'application

ENTRYPOINT [ "tail", "-f", "/dev/null" ]

# CMD [ "/script.sh" ]