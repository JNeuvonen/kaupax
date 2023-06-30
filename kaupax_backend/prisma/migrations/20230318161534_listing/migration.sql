/*
  Warnings:

  - You are about to drop the column `pictureId` on the `Realtor` table. All the data in the column will be lost.
  - You are about to drop the `Picture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_listingProfilePictureId_fkey";

-- DropForeignKey
ALTER TABLE "Realtor" DROP CONSTRAINT "Realtor_pictureId_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "Picture" TEXT[],
ADD COLUMN     "profilePictureId" INTEGER;

-- AlterTable
ALTER TABLE "Realtor" DROP COLUMN "pictureId",
ADD COLUMN     "profilePictureId" INTEGER;

-- DropTable
DROP TABLE "Picture";
