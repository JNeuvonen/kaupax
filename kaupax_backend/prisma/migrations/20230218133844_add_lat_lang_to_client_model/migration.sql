/*
  Warnings:

  - Added the required column `lat` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "long" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
