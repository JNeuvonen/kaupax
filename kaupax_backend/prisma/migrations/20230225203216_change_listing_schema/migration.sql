/*
  Warnings:

  - You are about to drop the column `squareMeters` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `long` on the `Realtor` table. All the data in the column will be lost.
  - Added the required column `surfaceArea` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Realtor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "squareMeters",
ADD COLUMN     "surfaceArea" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Realtor" DROP COLUMN "long",
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
