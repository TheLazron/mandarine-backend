/*
  Warnings:

  - You are about to drop the column `drawingId` on the `Rounds` table. All the data in the column will be lost.
  - You are about to drop the `Drawing` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[drawingUrl]` on the table `Rounds` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Rounds" DROP CONSTRAINT "Rounds_drawingId_fkey";

-- DropIndex
DROP INDEX "Rounds_drawingId_key";

-- AlterTable
ALTER TABLE "Rounds" DROP COLUMN "drawingId",
ADD COLUMN     "drawingUrl" TEXT;

-- DropTable
DROP TABLE "Drawing";

-- CreateIndex
CREATE UNIQUE INDEX "Rounds_drawingUrl_key" ON "Rounds"("drawingUrl");
