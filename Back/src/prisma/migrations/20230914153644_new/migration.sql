-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('OFFLINE', 'ONLINE', 'INGAME');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "twoFactorSecret" TEXT NOT NULL,
    "accessToken" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "nickname" TEXT,
    "state" "UserState" NOT NULL,
    "age" INTEGER,
    "character" TEXT,
    "actualGame" INTEGER,
    "pfp_url" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "looses" INTEGER NOT NULL DEFAULT 0,
    "friendsList" INTEGER[],
    "blockList" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "playersId" INTEGER[],
    "playersName" TEXT[],
    "score" INTEGER[],
    "winnerId" INTEGER,
    "characters" TEXT[],
    "playing" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "usersList" INTEGER[],
    "banList" INTEGER[],
    "adminList" INTEGER[],

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_twoFactorSecret_key" ON "User"("twoFactorSecret");

-- CreateIndex
CREATE UNIQUE INDEX "User_accessToken_key" ON "User"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_players_AB_unique" ON "_players"("A", "B");

-- CreateIndex
CREATE INDEX "_players_B_index" ON "_players"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_players" ADD CONSTRAINT "_players_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_players" ADD CONSTRAINT "_players_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
