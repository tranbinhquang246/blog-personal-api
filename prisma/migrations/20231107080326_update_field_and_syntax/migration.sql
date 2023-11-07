/*
  Warnings:

  - You are about to drop the column `interrest` on the `About_Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "About_Author" DROP COLUMN "interrest",
ADD COLUMN     "interest" TEXT[];
