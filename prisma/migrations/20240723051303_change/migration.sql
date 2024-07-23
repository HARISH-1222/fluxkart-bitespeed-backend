/*
  Warnings:

  - The `linkPrecedence` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `phoneNumber` on table `Contact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Precedence" AS ENUM ('secondary', 'primary');

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "linkedId" DROP NOT NULL,
DROP COLUMN "linkPrecedence",
ADD COLUMN     "linkPrecedence" "Precedence" NOT NULL DEFAULT 'primary',
ALTER COLUMN "deletedAt" DROP NOT NULL;
