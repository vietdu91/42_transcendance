# Utilisez une image de base Node.js 14
FROM node:lts-alpine

# Définissez le répertoire de travail
WORKDIR /usr/src/app

# Installation de NestJS CLI globalement
RUN npm install -g @nestjs/cli

# Copiez les fichiers package.json et package-lock.json
COPY ./package*.json ./

# Installez les dépendances
RUN npm install

RUN npm install --save @nestjs/passport passport passport-local && npm install --save-dev @types/passport-local

# Copiez tous les autres fichiers
COPY ./src ./

# Exposez le port 3000
EXPOSE 3000

# Démarrez l'application
CMD [ "npm", "run", "start:dev" ]
