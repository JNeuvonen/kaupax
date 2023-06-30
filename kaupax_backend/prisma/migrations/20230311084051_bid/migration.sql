-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_realtorId_fkey";

-- AlterTable
ALTER TABLE "Bid" ALTER COLUMN "realtorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_realtorId_fkey" FOREIGN KEY ("realtorId") REFERENCES "Realtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
