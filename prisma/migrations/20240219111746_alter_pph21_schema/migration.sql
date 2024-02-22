/*
  Warnings:

  - You are about to drop the column `pkp` on the `pph21_taxes` table. All the data in the column will be lost.
  - Added the required column `employeeType` to the `pph21_taxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasNpwp` to the `pph21_taxes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "taxes"."pph21_taxes" DROP COLUMN "pkp",
ADD COLUMN     "employeeType" "taxes"."UnitEmployeeType" NOT NULL,
ADD COLUMN     "hasNpwp" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "taxes"."pph21_december_results" (
    "id" TEXT NOT NULL,
    "currentYear" DECIMAL(65,30) NOT NULL,
    "beforeDecember" DECIMAL(65,30) NOT NULL,
    "taxId" TEXT NOT NULL,

    CONSTRAINT "pph21_december_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."pph21_net_calculations" (
    "id" TEXT NOT NULL,
    "positionDeduction" DECIMAL(65,30) NOT NULL,
    "annualContribution" DECIMAL(65,30) NOT NULL,
    "annualAssurance" DECIMAL(65,30) NOT NULL,
    "result" DECIMAL(65,30) NOT NULL,
    "taxId" TEXT NOT NULL,

    CONSTRAINT "pph21_net_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."pph21_taxables" (
    "id" TEXT NOT NULL,
    "percentage" DECIMAL(65,30),
    "ptkp" DECIMAL(65,30),
    "amount" DECIMAL(65,30) NOT NULL,
    "result" DECIMAL(65,30) NOT NULL,
    "taxId" TEXT NOT NULL,

    CONSTRAINT "pph21_taxables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."pph21_tariffs" (
    "id" TEXT NOT NULL,
    "percentage" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "result" DECIMAL(65,30) NOT NULL,
    "taxId" TEXT NOT NULL,

    CONSTRAINT "pph21_tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pph21_december_results_taxId_key" ON "taxes"."pph21_december_results"("taxId");

-- CreateIndex
CREATE UNIQUE INDEX "pph21_net_calculations_taxId_key" ON "taxes"."pph21_net_calculations"("taxId");

-- CreateIndex
CREATE UNIQUE INDEX "pph21_taxables_taxId_key" ON "taxes"."pph21_taxables"("taxId");

-- AddForeignKey
ALTER TABLE "taxes"."pph21_december_results" ADD CONSTRAINT "pph21_december_results_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"."pph21_taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."pph21_net_calculations" ADD CONSTRAINT "pph21_net_calculations_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"."pph21_taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."pph21_taxables" ADD CONSTRAINT "pph21_taxables_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"."pph21_taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."pph21_tariffs" ADD CONSTRAINT "pph21_tariffs_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"."pph21_taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
