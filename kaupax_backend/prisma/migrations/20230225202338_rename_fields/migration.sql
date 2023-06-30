/*
  Warnings:

  - You are about to drop the column `long` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "long",
ADD COLUMN     "lng" DOUBLE PRECISION;
