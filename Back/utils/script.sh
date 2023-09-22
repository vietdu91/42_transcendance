npx prisma migrate deploy --schema=./src/prisma/schema.prisma

npx prisma generate --schema=./src/prisma/schema.prisma

npm run build && npm run start:prod

# npx prisma migrate dev --schema=./src/prisma/schema.prisma

# npm run start:dev