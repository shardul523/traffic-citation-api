-- CreateEnum
CREATE TYPE "ChallanStatus" AS ENUM ('ISSUED', 'PAID', 'DISMISSED');

-- CreateTable
CREATE TABLE "Challan" (
    "id" SERIAL NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "violation" TEXT NOT NULL,
    "fineAmount" DOUBLE PRECISION NOT NULL,
    "status" "ChallanStatus" NOT NULL,
    "vehicleLicensePlate" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,

    CONSTRAINT "Challan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "licencePlate" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Officer" (
    "id" SERIAL NOT NULL,
    "officerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licencePlate_key" ON "Vehicle"("licencePlate");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Officer_officerId_key" ON "Officer"("officerId");

-- AddForeignKey
ALTER TABLE "Challan" ADD CONSTRAINT "Challan_vehicleLicensePlate_fkey" FOREIGN KEY ("vehicleLicensePlate") REFERENCES "Vehicle"("licencePlate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challan" ADD CONSTRAINT "Challan_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("officerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
