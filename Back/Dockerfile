# Utilisez une image de base Node.js 14
FROM node:lts-alpine

# Définissez le répertoire de travail
WORKDIR /usr/src/app

# Installation de NestJS CLI globalement
# Copiez les fichiers package.json et package-lock.json
COPY ./package*.json ./

# Installez les dépendances
RUN npm install -g npm@latest
RUN npm install --save
RUN npm install prisma --save-dev
RUN npm i -g @nestjs/cli

# Copiez tous les autres fichiers
COPY ./src ./

# Exposez le port 300
EXPOSE 3001

# Démarrez l'application

COPY ./utils/script.sh /

RUN chmod 755 /script.sh

# A LANCER POUR LES TESTS
# # Lancer le script dans le terminal du docker via [/script.sh]
ENTRYPOINT [ "tail", "-f" ]

# A LANCER POUR LE RENDU FINAL (ne permet pas de modification directe du code)
# CMD [ "/script.sh" ]