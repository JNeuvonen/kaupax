/*
  Warnings:

  - You are about to drop the column `profilePictureId` on the `Realtor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Realtor" DROP COLUMN "profilePictureId",
ADD COLUMN     "profilePicture" TEXT;
