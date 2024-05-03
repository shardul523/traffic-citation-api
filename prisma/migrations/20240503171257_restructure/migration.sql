/*
  Warnings:

  - You are about to drop the `Challan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Officer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Challan" DROP CONSTRAINT "Challan_officerId_fkey";

-- DropForeignKey
ALTER TABLE "Challan" DROP CONSTRAINT "Challan_vehicleLicensePlate_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userId_fkey";

-- DropTable
DROP TABLE "Challan";

-- DropTable
DROP TABLE "Officer";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Vehicle";

-- CreateTable
CREATE TABLE "challans" (
    "id" SERIAL NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "violation" TEXT NOT NULL,
    "fineAmount" DOUBLE PRECISION NOT NULL,
    "status" "ChallanStatus" NOT NULL,
    "vehicleLicensePlate" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,

    CONSTRAINT "challans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "licencePlate" CHAR(10) NOT NULL,
    "vehicleType" "VehicleType" NOT NULL DEFAULT 'FOUR_WHEELER',
    "userId" INTEGER,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officers" (
    "id" SERIAL NOT NULL,
    "officerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "officers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_licencePlate_key" ON "vehicles"("licencePlate");

-- CreateIndex
CREATE UNIQUE INDEX "users_uid_key" ON "users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "officers_officerId_key" ON "officers"("officerId");

-- CreateIndex
CREATE UNIQUE INDEX "officers_email_key" ON "officers"("email");

-- AddForeignKey
ALTER TABLE "challans" ADD CONSTRAINT "challans_vehicleLicensePlate_fkey" FOREIGN KEY ("vehicleLicensePlate") REFERENCES "vehicles"("licencePlate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challans" ADD CONSTRAINT "challans_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "officers"("officerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
