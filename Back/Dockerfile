# Utilisez une image de base Node.js 14
FROM node:lts-alpine

# Définissez le répertoire de travail
WORKDIR /usr/src/app

# Installation de NestJS CLI globalement
#clRUN npm install -g @nestjs/cli

# Copiez les fichiers package.json et package-lock.json
COPY ./package*.json ./

# Installez les dépendances
RUN npm install -g npm@latest
RUN npm install
RUN npm install prisma --save-dev
RUN npm i -g @nestjs/cli

#RUN npm install --save @nestjs/passport passport passport-local && npm install --save-dev @types/passport-local

#RUN npm install passport-google-oauth20 --save
#RUN npm install otplib --save
#RUN npm install @nestjs/jwt passport-jwt --save
#RUN npm install @nestjs/config --save
#RUN npm install @nestjs/common --save
#RUN npm install qrcode --save
#RUN npm install prisma --save-dev
#RUN npm install express --save
#RUN npm install @prisma/client --save
#RUN npm i cookie-parser --save
#RUN npm i -D @types/cookie-parser --save

# Copiez tous les autres fichiers
COPY ./src ./

# Exposez le port 300
EXPOSE 3001

# Démarrez l'application
CMD [ "npm", "run", "start:dev" ]
