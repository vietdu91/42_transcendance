/*
  Warnings:

  - You are about to drop the `_players` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gameId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_players" DROP CONSTRAINT "_players_A_fkey";

-- DropForeignKey
ALTER TABLE "_players" DROP CONSTRAINT "_players_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gameId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_players";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
