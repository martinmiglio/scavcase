/*
  Warnings:

  - You are about to drop the `ReturnedItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReturnedItem" DROP CONSTRAINT "ReturnedItem_reportId_fkey";

-- DropTable
DROP TABLE "ReturnedItem";

-- CreateTable
CREATE TABLE "InputItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "InputItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "OutputItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_inputItemId_fkey" FOREIGN KEY ("inputItemId") REFERENCES "InputItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputItem" ADD CONSTRAINT "OutputItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
