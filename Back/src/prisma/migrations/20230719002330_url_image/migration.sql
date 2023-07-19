/*
  Warnings:

  - Added the required column `url_image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "url_image" TEXT NOT NULL;
