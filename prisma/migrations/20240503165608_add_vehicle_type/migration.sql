-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('TWO_WHEELER', 'FOUR_WHEELER');

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "vehicleType" "VehicleType" NOT NULL DEFAULT 'FOUR_WHEELER';
