/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Listing_uuid_key" ON "Listing"("uuid");
