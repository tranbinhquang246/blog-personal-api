/*
  Warnings:

  - You are about to drop the `About_Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post_Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post_Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post_Category" DROP CONSTRAINT "Post_Category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Category" DROP CONSTRAINT "Post_Category_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Tag" DROP CONSTRAINT "Post_Tag_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Tag" DROP CONSTRAINT "Post_Tag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_authorId_fkey";

-- DropTable
DROP TABLE "About_Author";

-- DropTable
DROP TABLE "Post_Category";

-- DropTable
DROP TABLE "Post_Tag";

-- DropTable
DROP TABLE "Progress";

-- CreateTable
CREATE TABLE "PostTag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PostCategory" (
    "postId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutAuthor" (
    "uuid" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "aliasName" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "interest" TEXT[],
    "reason" TEXT[],
    "target" TEXT[],
    "experience" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutAuthor_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "LifeProcess" (
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_postId_key" ON "PostTag"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_tagId_key" ON "PostTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "PostCategory_postId_key" ON "PostCategory"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostCategory_categoryId_key" ON "PostCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "LifeProcess_authorId_key" ON "LifeProcess"("authorId");

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCategory" ADD CONSTRAINT "PostCategory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCategory" ADD CONSTRAINT "PostCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeProcess" ADD CONSTRAINT "LifeProcess_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AboutAuthor"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
