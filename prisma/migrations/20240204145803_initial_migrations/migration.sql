-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "bumdes";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "journals";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "taxes";

-- CreateEnum
CREATE TYPE "auth"."users_role" AS ENUM ('UNIT', 'BUMDES', 'KECAMATAN', 'KABUPATEN');

-- CreateEnum
CREATE TYPE "bumdes"."BumdesUnitBusinessType" AS ENUM ('SERVICES', 'COMMERCE', 'INDUSTRY');

-- CreateEnum
CREATE TYPE "journals"."journal_categories" AS ENUM ('GENERAL', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "taxes"."PpnTaxObject" AS ENUM ('NO_TAXES', 'DOMESTIC_TAXES', 'INTERNATIONAL_TAXES');

-- CreateEnum
CREATE TYPE "taxes"."PpnTaxItemType" AS ENUM ('SERVICE', 'GOODS');

-- CreateEnum
CREATE TYPE "taxes"."PpnTransactionType" AS ENUM ('SALES', 'PURCHASE');

-- CreateEnum
CREATE TYPE "taxes"."UnitEmployeeStatus" AS ENUM ('NEW', 'OLD');

-- CreateEnum
CREATE TYPE "taxes"."UnitEmployeeGender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "taxes"."UnitEmployeeMarriageStatus" AS ENUM ('NOT_MARRIED', 'MARRIED');

-- CreateEnum
CREATE TYPE "taxes"."UnitEmployeeChildrenAmount" AS ENUM ('NONE', 'ONE', 'TWO', 'THREE');

-- CreateEnum
CREATE TYPE "taxes"."UnitEmployeeType" AS ENUM ('PERMANENT_MONTHLY', 'NON_PERMANENT_MONTHLY', 'NON_PERMANENT_NOT_MONTHLY', 'SEVERANCE_OUTRIGHT', 'SEVERANCE_PERIODICAL', 'OTHER_ACTIVITY_MEMBER', 'OTHER_SUPERVISOR_NON_EMPLOYEE', 'NON_EMPLOYEE');

-- CreateEnum
CREATE TYPE "taxes"."UnitEmployeeNpwpStatus" AS ENUM ('MERGED_WITH_HUSBAND', 'SEPARATED_WITH_HUSBAND');

-- CreateEnum
CREATE TYPE "taxes"."Pph21PtkpStatus" AS ENUM ('TK0', 'TK1', 'TK2', 'TK3', 'K0', 'K1', 'K2', 'K3', 'KI0', 'KI1', 'KI2', 'KI3');

-- CreateEnum
CREATE TYPE "taxes"."Pph21TerType" AS ENUM ('A', 'B', 'C');

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "auth"."users_role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "bumdesId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bumdes"."bumdes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "completeAddress" TEXT,
    "province" TEXT NOT NULL,
    "regency" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "villageRuleNumber" TEXT,
    "skAdministratorNumber" TEXT,
    "skAdministratorDate" TIMESTAMP(3),
    "skAssistantNumber" TEXT,
    "skAssistantDate" TIMESTAMP(3),
    "bankName" TEXT,
    "bankAccount" TEXT,
    "npwpNumber" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "otherSocials" TEXT,
    "initialCapitalParticipation" DECIMAL(65,30),
    "additionalCapitalParticipation" DECIMAL(65,30),
    "leader" TEXT NOT NULL,
    "consultant" TEXT,
    "secretary" TEXT,
    "treasurer" TEXT,
    "supervisor_leader" TEXT,
    "supervisor_secretary" TEXT,
    "supervisor_treasurer" TEXT,
    "foundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bumdes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bumdes"."bumdes_funding_history_item" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "rulesNumber" TEXT NOT NULL,
    "villageAmount" DECIMAL(65,30) NOT NULL,
    "villagePercentage" DECIMAL(65,30) NOT NULL,
    "otherPartiesAmount" DECIMAL(65,30) NOT NULL,
    "otherPartiesPercentage" DECIMAL(65,30) NOT NULL,
    "bumdesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bumdes_funding_history_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bumdes"."bumdes_income_history_item" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "omzet" DECIMAL(65,30) NOT NULL,
    "profit" DECIMAL(65,30) NOT NULL,
    "dividend" DECIMAL(65,30) NOT NULL,
    "bumdesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bumdes_income_history_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bumdes"."bumdes_unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessType" "bumdes"."BumdesUnitBusinessType" NOT NULL,
    "description" TEXT,
    "leader" TEXT NOT NULL,
    "members" TEXT[],
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bumdesId" TEXT,
    "userId" TEXT NOT NULL,
    "thirdPartyPartners" TEXT[],
    "foundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bumdes_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bumdes"."bumdes_unit_capital_history" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "source" TEXT NOT NULL,
    "percentage" DECIMAL(65,30) NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bumdes_unit_capital_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bumdes"."bumdes_unit_income_history" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "asset" DECIMAL(65,30) NOT NULL,
    "revenue" DECIMAL(65,30) NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bumdes_unit_income_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bumdes"."bumdes_unit_net_profit_history" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "netProfit" DECIMAL(65,30) NOT NULL,
    "dividend" DECIMAL(65,30) NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bumdes_unit_net_profit_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."account_groups" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "account_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."account_subgroups" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "groupRef" TEXT NOT NULL,

    CONSTRAINT "account_subgroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."accounts" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isCredit" BOOLEAN NOT NULL,
    "groupRef" TEXT NOT NULL,
    "subgroupRef" TEXT NOT NULL,
    "businessTypes" "bumdes"."BumdesUnitBusinessType"[],

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."custom_accounts" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isCredit" BOOLEAN NOT NULL,
    "groupRef" TEXT NOT NULL,
    "subgroupRef" TEXT NOT NULL,
    "businessTypes" "bumdes"."BumdesUnitBusinessType"[],

    CONSTRAINT "custom_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."journals" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "category" "journals"."journal_categories" NOT NULL,
    "evidence" TEXT,
    "bumdesUnitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."journal_items" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "isCredit" BOOLEAN NOT NULL,
    "accountId" INTEGER NOT NULL,
    "journalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "journal_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."custom_journals" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "category" "journals"."journal_categories" NOT NULL,
    "evidence" TEXT,
    "bumdesUnitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "custom_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals"."custom_journal_items" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "isCredit" BOOLEAN NOT NULL,
    "accountId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "custom_journal_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."ppn_taxes" (
    "id" TEXT NOT NULL,
    "givenTo" TEXT NOT NULL,
    "itemType" "taxes"."PpnTaxItemType" NOT NULL,
    "transactionType" "taxes"."PpnTransactionType" NOT NULL,
    "transactionNumber" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "transactionEvidenceKey" TEXT NOT NULL,
    "object" "taxes"."PpnTaxObject" NOT NULL,
    "bumdesUnitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ppn_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."ppn_object_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerUnit" DECIMAL(65,30) NOT NULL,
    "discountPrice" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "dpp" DECIMAL(65,30) NOT NULL,
    "ppn" DECIMAL(65,30) NOT NULL,
    "taxId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ppn_object_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."unit_employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "npwp" TEXT,
    "npwpStatus" "taxes"."UnitEmployeeNpwpStatus",
    "gender" "taxes"."UnitEmployeeGender" NOT NULL,
    "employeeStatus" "taxes"."UnitEmployeeStatus" NOT NULL,
    "employeeType" "taxes"."UnitEmployeeType" NOT NULL,
    "startWorkingAt" TIMESTAMP(3) NOT NULL,
    "marriageStatus" "taxes"."UnitEmployeeMarriageStatus" NOT NULL,
    "childrenAmount" "taxes"."UnitEmployeeChildrenAmount" NOT NULL,
    "bumdesUnitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "unit_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."pph21_ptkp_boundaries" (
    "id" SERIAL NOT NULL,
    "status" "taxes"."Pph21PtkpStatus" NOT NULL,
    "minimumSalary" DECIMAL(65,30) NOT NULL,
    "terType" "taxes"."Pph21TerType",
    "periodYear" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,

    CONSTRAINT "pph21_ptkp_boundaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."pph21_ter_percentages" (
    "id" SERIAL NOT NULL,
    "type" "taxes"."Pph21TerType" NOT NULL,
    "rangeStart" DECIMAL(65,30) NOT NULL,
    "rangeEnd" DECIMAL(65,30) NOT NULL,
    "percentage" DECIMAL(65,30) NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,

    CONSTRAINT "pph21_ter_percentages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes"."pph21_taxes" (
    "id" TEXT NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "salary" DECIMAL(65,30),
    "allowance" DECIMAL(65,30),
    "thr" DECIMAL(65,30),
    "bonus" DECIMAL(65,30),
    "overtimeSalary" DECIMAL(65,30),
    "assurance" DECIMAL(65,30),
    "pkp" DECIMAL(65,30),
    "dailySalary" DECIMAL(65,30),
    "monthlySalary" DECIMAL(65,30),
    "workingDays" INTEGER,
    "pphAmount" DECIMAL(65,30) NOT NULL,
    "totalSalary" DECIMAL(65,30) NOT NULL,
    "netReceipts" DECIMAL(65,30) NOT NULL,
    "employeeId" TEXT NOT NULL,
    "bumdesUnitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pph21_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_identifier_key" ON "auth"."users"("identifier");

-- CreateIndex
CREATE INDEX "bumdes_address" ON "bumdes"."bumdes"("province", "regency", "district", "village", "postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "bumdes_unit_userId_key" ON "bumdes"."bumdes_unit"("userId");

-- CreateIndex
CREATE INDEX "bumdes_unit_business_type" ON "bumdes"."bumdes_unit"("businessType", "bumdesId");

-- CreateIndex
CREATE UNIQUE INDEX "account_groups_ref_key" ON "journals"."account_groups"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "account_groups_slug_key" ON "journals"."account_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "account_subgroups_ref_key" ON "journals"."account_subgroups"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "account_subgroups_slug_key" ON "journals"."account_subgroups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_slug_key" ON "journals"."accounts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "custom_accounts_slug_key" ON "journals"."custom_accounts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "unit_employees_nik_bumdesUnitId_key" ON "taxes"."unit_employees"("nik", "bumdesUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "pph21_ptkp_boundaries_status_periodYear_periodMonth_key" ON "taxes"."pph21_ptkp_boundaries"("status", "periodYear", "periodMonth");

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_bumdesId_fkey" FOREIGN KEY ("bumdesId") REFERENCES "bumdes"."bumdes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bumdes"."bumdes_funding_history_item" ADD CONSTRAINT "bumdes_funding_history_item_bumdesId_fkey" FOREIGN KEY ("bumdesId") REFERENCES "bumdes"."bumdes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bumdes"."bumdes_income_history_item" ADD CONSTRAINT "bumdes_income_history_item_bumdesId_fkey" FOREIGN KEY ("bumdesId") REFERENCES "bumdes"."bumdes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bumdes"."bumdes_unit" ADD CONSTRAINT "bumdes_unit_bumdesId_fkey" FOREIGN KEY ("bumdesId") REFERENCES "bumdes"."bumdes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bumdes"."bumdes_unit" ADD CONSTRAINT "bumdes_unit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bumdes"."bumdes_unit_capital_history" ADD CONSTRAINT "bumdes_unit_capital_history_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bumdes"."bumdes_unit_income_history" ADD CONSTRAINT "bumdes_unit_income_history_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bumdes"."bumdes_unit_net_profit_history" ADD CONSTRAINT "bumdes_unit_net_profit_history_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."account_subgroups" ADD CONSTRAINT "account_subgroups_groupRef_fkey" FOREIGN KEY ("groupRef") REFERENCES "journals"."account_groups"("ref") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."accounts" ADD CONSTRAINT "accounts_groupRef_fkey" FOREIGN KEY ("groupRef") REFERENCES "journals"."account_groups"("ref") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."accounts" ADD CONSTRAINT "accounts_subgroupRef_fkey" FOREIGN KEY ("subgroupRef") REFERENCES "journals"."account_subgroups"("ref") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."custom_accounts" ADD CONSTRAINT "custom_accounts_groupRef_fkey" FOREIGN KEY ("groupRef") REFERENCES "journals"."account_groups"("ref") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."custom_accounts" ADD CONSTRAINT "custom_accounts_subgroupRef_fkey" FOREIGN KEY ("subgroupRef") REFERENCES "journals"."account_subgroups"("ref") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."journals" ADD CONSTRAINT "journals_bumdesUnitId_fkey" FOREIGN KEY ("bumdesUnitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."journal_items" ADD CONSTRAINT "journal_items_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "journals"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."journal_items" ADD CONSTRAINT "journal_items_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals"."journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."custom_journals" ADD CONSTRAINT "custom_journals_bumdesUnitId_fkey" FOREIGN KEY ("bumdesUnitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."custom_journal_items" ADD CONSTRAINT "custom_journal_items_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "journals"."custom_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals"."custom_journal_items" ADD CONSTRAINT "custom_journal_items_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals"."custom_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."ppn_taxes" ADD CONSTRAINT "ppn_taxes_bumdesUnitId_fkey" FOREIGN KEY ("bumdesUnitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."ppn_object_items" ADD CONSTRAINT "ppn_object_items_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"."ppn_taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."unit_employees" ADD CONSTRAINT "unit_employees_bumdesUnitId_fkey" FOREIGN KEY ("bumdesUnitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."pph21_taxes" ADD CONSTRAINT "pph21_taxes_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "taxes"."unit_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes"."pph21_taxes" ADD CONSTRAINT "pph21_taxes_bumdesUnitId_fkey" FOREIGN KEY ("bumdesUnitId") REFERENCES "bumdes"."bumdes_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
