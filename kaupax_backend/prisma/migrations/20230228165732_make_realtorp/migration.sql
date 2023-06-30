-- DropForeignKey
ALTER TABLE "Realtor" DROP CONSTRAINT "Realtor_pictureId_fkey";

-- AlterTable
ALTER TABLE "Realtor" ALTER COLUMN "pictureId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Realtor" ADD CONSTRAINT "Realtor_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
