/*
  Warnings:

  - You are about to alter the column `uid` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(12)`.
  - You are about to alter the column `licencePlate` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uid" SET DATA TYPE CHAR(12);

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "licencePlate" SET DATA TYPE CHAR(10);
