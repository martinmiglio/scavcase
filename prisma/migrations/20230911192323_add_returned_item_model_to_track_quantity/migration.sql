/*
  Warnings:

  - You are about to drop the column `input_item_id` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `returned_item_ids` on the `Report` table. All the data in the column will be lost.
  - Added the required column `inputItemId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "input_item_id",
DROP COLUMN "returned_item_ids",
ADD COLUMN     "inputItemId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ReturnedItem" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "ReturnedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReturnedItem" ADD CONSTRAINT "ReturnedItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
