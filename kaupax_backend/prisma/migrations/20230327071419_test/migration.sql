/*
  Warnings:

  - You are about to drop the column `city` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `postalArea` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "postalArea",
DROP COLUMN "street";
