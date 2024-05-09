-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_userId_fkey";

-- AlterTable
ALTER TABLE "vehicles" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
