/*
  Warnings:

  - You are about to drop the column `price` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `listingType` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "price",
ADD COLUMN     "listingType" TEXT NOT NULL,
ALTER COLUMN "floor" DROP NOT NULL,
ALTER COLUMN "yearBuilt" DROP NOT NULL;
