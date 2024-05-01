/*
  Warnings:

  - Added the required column `updatedAt` to the `Challan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "issuedAt" SET DEFAULT CURRENT_TIMESTAMP;
