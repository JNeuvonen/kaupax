/*
  Warnings:

  - Added the required column `lat` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `Realtor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Realtor" ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "long" DOUBLE PRECISION NOT NULL;
