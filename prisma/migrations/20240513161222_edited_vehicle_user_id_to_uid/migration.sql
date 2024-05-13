/*
  Warnings:

  - You are about to drop the column `userId` on the `vehicles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_userId_fkey";

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "userId",
ADD COLUMN     "uid" TEXT;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
