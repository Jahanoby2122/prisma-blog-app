-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISH', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('APPROVED', 'REJECT');

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(225) NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "isFeature" BOOLEAN NOT NULL DEFAULT false,
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISH',
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "AuthorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "AuthorId" TEXT NOT NULL,
    "PostId" TEXT NOT NULL,
    "ParentId" TEXT,
    "status" "CommentStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_AuthorId_idx" ON "posts"("AuthorId");

-- CreateIndex
CREATE INDEX "comments_AuthorId_idx" ON "comments"("AuthorId");

-- CreateIndex
CREATE INDEX "comments_PostId_idx" ON "comments"("PostId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
