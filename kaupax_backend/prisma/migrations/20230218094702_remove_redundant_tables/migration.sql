/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalArea` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalArea` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalArea` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Realtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Realtor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_realtorId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_realtorId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "postalArea" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postalArea" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Realtor" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "postalArea" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Contact";
