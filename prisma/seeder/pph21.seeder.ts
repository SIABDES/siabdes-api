import { Pph21PtkpStatus, Pph21TerType, PrismaClient } from '@prisma/client';

type TerRequiredData = {
  rangeStart: number;
  rangeEnd: number;
  percentage: number;
};

type TerPeriodData = {
  year: number;
  month: number;
};

export async function clearPph21(prisma: PrismaClient) {
  await prisma.pph21TerPercentage.deleteMany();
  await prisma.pph21PtkpBoundary.deleteMany();
}

export async function seedPph21(prisma: PrismaClient) {
  const xPrisma = prisma.$extends({
    model: {
      pph21TerPercentage: {
        async createBatch(
          type: Pph21TerType,
          period: TerPeriodData,
          dto: TerRequiredData[],
        ) {
          return await prisma.pph21TerPercentage.createMany({
            skipDuplicates: true,
            data: dto.map((data) => ({
              type,
              periodYear: period.year,
              periodMonth: period.month,
              ...data,
            })),
          });
        },
      },
    },
  });

  await prisma.pph21PtkpBoundary.createMany({
    skipDuplicates: true,
    data: [
      // TER A
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.TK0,
        minimumSalary: 54_000_000,
        terType: Pph21TerType.A,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.TK1,
        minimumSalary: 58_500_000,
        terType: Pph21TerType.A,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.K0,
        minimumSalary: 58_500_000,
        terType: Pph21TerType.A,
      },
      // TER B
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.TK2,
        minimumSalary: 63_000_000,
        terType: Pph21TerType.B,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.K1,
        minimumSalary: 63_000_000,
        terType: Pph21TerType.B,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.TK3,
        minimumSalary: 67_500_000,
        terType: Pph21TerType.B,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.K2,
        minimumSalary: 67_500_000,
        terType: Pph21TerType.B,
      },
      // TER C
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.K3,
        minimumSalary: 72_000_000,
        terType: Pph21TerType.C,
      },

      // NOTE: K/I/xxx tidak pakai TER
      // No Ter
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.KI0,
        minimumSalary: 112_500_000,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.KI1,
        minimumSalary: 117_000_000,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.KI2,
        minimumSalary: 121_500_000,
      },
      {
        periodYear: 2024,
        periodMonth: 1,
        status: Pph21PtkpStatus.KI3,
        minimumSalary: 126_000_000,
      },
    ],
  });

  // Inside your seedPph21 function

  await xPrisma.pph21TerPercentage.createBatch(
    Pph21TerType.A,
    { year: 2024, month: 1 },
    [
      { percentage: 0, rangeStart: 0, rangeEnd: 5_400_000 },
      { percentage: 0.0025, rangeStart: 5_400_001, rangeEnd: 5_650_000 },
      { percentage: 0.005, rangeStart: 5_650_001, rangeEnd: 5_950_000 },
      { percentage: 0.0075, rangeStart: 5_950_001, rangeEnd: 6_300_000 },
      { percentage: 0.01, rangeStart: 6_300_001, rangeEnd: 6_750_000 },
      { percentage: 0.0125, rangeStart: 6_750_001, rangeEnd: 7_500_000 },
      { percentage: 0.015, rangeStart: 7_500_001, rangeEnd: 8_550_000 },
      { percentage: 0.0175, rangeStart: 8_550_001, rangeEnd: 9_650_000 },
      { percentage: 0.02, rangeStart: 9_650_001, rangeEnd: 10_050_000 },
      { percentage: 0.0225, rangeStart: 10_050_001, rangeEnd: 10_350_000 },
      { percentage: 0.025, rangeStart: 10_350_001, rangeEnd: 10_700_000 },
      { percentage: 0.03, rangeStart: 10_700_001, rangeEnd: 11_050_000 },
      { percentage: 0.035, rangeStart: 11_050_001, rangeEnd: 11_600_000 },
      { percentage: 0.04, rangeStart: 11_600_001, rangeEnd: 12_500_000 },
      { percentage: 0.05, rangeStart: 12_500_001, rangeEnd: 13_750_000 },
      { percentage: 0.06, rangeStart: 13_750_001, rangeEnd: 15_100_000 },
      { percentage: 0.07, rangeStart: 15_100_001, rangeEnd: 16_950_000 },
      { percentage: 0.08, rangeStart: 16_950_001, rangeEnd: 19_750_000 },
      { percentage: 0.09, rangeStart: 19_750_001, rangeEnd: 24_150_000 },
      { percentage: 0.1, rangeStart: 24_150_001, rangeEnd: 26_450_000 },
      { percentage: 0.11, rangeStart: 26_450_001, rangeEnd: 28_000_000 },
      { percentage: 0.12, rangeStart: 28_000_001, rangeEnd: 30_050_000 },
      { percentage: 0.13, rangeStart: 30_050_001, rangeEnd: 32_400_000 },
      { percentage: 0.14, rangeStart: 32_400_001, rangeEnd: 35_400_000 },
      { percentage: 0.15, rangeStart: 35_400_001, rangeEnd: 39_100_000 },
      { percentage: 0.16, rangeStart: 39_100_001, rangeEnd: 43_850_000 },
      { percentage: 0.17, rangeStart: 43_850_001, rangeEnd: 47_800_000 },
      { percentage: 0.18, rangeStart: 47_800_001, rangeEnd: 51_400_000 },
      { percentage: 0.19, rangeStart: 51_400_001, rangeEnd: 56_300_000 },
      { percentage: 0.2, rangeStart: 56_300_001, rangeEnd: 62_200_000 },
      { percentage: 0.21, rangeStart: 62_200_001, rangeEnd: 68_600_000 },
      { percentage: 0.22, rangeStart: 68_600_001, rangeEnd: 77_500_000 },
      { percentage: 0.23, rangeStart: 77_500_001, rangeEnd: 89_000_000 },
      { percentage: 0.24, rangeStart: 89_000_001, rangeEnd: 103_000_000 },
      { percentage: 0.25, rangeStart: 103_000_001, rangeEnd: 125_000_000 },
      { percentage: 0.26, rangeStart: 125_000_001, rangeEnd: 157_000_000 },
      { percentage: 0.27, rangeStart: 157_000_001, rangeEnd: 206_000_000 },
      { percentage: 0.28, rangeStart: 206_000_001, rangeEnd: 337_000_000 },
      { percentage: 0.29, rangeStart: 337_000_001, rangeEnd: 454_000_000 },
      { percentage: 0.3, rangeStart: 454_000_001, rangeEnd: 550_000_000 },
      { percentage: 0.31, rangeStart: 550_000_001, rangeEnd: 695_000_000 },
      { percentage: 0.32, rangeStart: 695_000_001, rangeEnd: 910_000_000 },
      { percentage: 0.33, rangeStart: 910_000_001, rangeEnd: 1_400_000_000 },
      {
        percentage: 0.34,
        rangeStart: 1_400_000_001,
        rangeEnd: Number.MAX_SAFE_INTEGER,
      },
    ],
  );

  await xPrisma.pph21TerPercentage.createBatch(
    Pph21TerType.B,
    { year: 2024, month: 1 },
    [
      { percentage: 0, rangeStart: 0, rangeEnd: 6_200_000 },
      { percentage: 0.0025, rangeStart: 6_200_001, rangeEnd: 6_500_000 },
      { percentage: 0.005, rangeStart: 6_500_001, rangeEnd: 6_850_000 },
      { percentage: 0.0075, rangeStart: 6_850_001, rangeEnd: 7_300_000 },
      { percentage: 0.01, rangeStart: 7_300_001, rangeEnd: 9_200_000 },
      { percentage: 0.015, rangeStart: 9_200_001, rangeEnd: 10_750_000 },
      { percentage: 0.02, rangeStart: 10_750_001, rangeEnd: 11_250_000 },
      { percentage: 0.025, rangeStart: 11_250_001, rangeEnd: 11_600_000 },
      { percentage: 0.03, rangeStart: 11_600_001, rangeEnd: 12_600_000 },
      { percentage: 0.04, rangeStart: 12_600_001, rangeEnd: 13_600_000 },
      { percentage: 0.05, rangeStart: 13_600_001, rangeEnd: 14_950_000 },
      { percentage: 0.06, rangeStart: 14_950_001, rangeEnd: 16_400_000 },
      { percentage: 0.07, rangeStart: 16_400_001, rangeEnd: 18_450_000 },
      { percentage: 0.08, rangeStart: 18_450_001, rangeEnd: 21_850_000 },
      { percentage: 0.09, rangeStart: 21_850_001, rangeEnd: 26_000_000 },
      { percentage: 0.1, rangeStart: 26_000_001, rangeEnd: 27_700_000 },
      { percentage: 0.11, rangeStart: 27_700_001, rangeEnd: 29_350_000 },
      { percentage: 0.12, rangeStart: 29_350_001, rangeEnd: 31_450_000 },
      { percentage: 0.13, rangeStart: 31_450_001, rangeEnd: 33_950_000 },
      { percentage: 0.14, rangeStart: 33_950_001, rangeEnd: 37_100_000 },
      { percentage: 0.15, rangeStart: 37_100_001, rangeEnd: 41_100_000 },
      { percentage: 0.16, rangeStart: 41_100_001, rangeEnd: 45_800_000 },
      { percentage: 0.17, rangeStart: 45_800_001, rangeEnd: 49_500_000 },
      { percentage: 0.18, rangeStart: 49_500_001, rangeEnd: 53_800_000 },
      { percentage: 0.19, rangeStart: 53_800_001, rangeEnd: 58_500_000 },
      { percentage: 0.2, rangeStart: 58_500_001, rangeEnd: 64_000_000 },
      { percentage: 0.21, rangeStart: 64_000_001, rangeEnd: 71_000_000 },
      { percentage: 0.22, rangeStart: 71_000_001, rangeEnd: 80_000_000 },
      { percentage: 0.23, rangeStart: 80_000_001, rangeEnd: 93_000_000 },
      { percentage: 0.24, rangeStart: 93_000_001, rangeEnd: 109_000_000 },
      { percentage: 0.25, rangeStart: 109_000_001, rangeEnd: 129_000_000 },
      { percentage: 0.26, rangeStart: 129_000_001, rangeEnd: 163_000_000 },
      { percentage: 0.27, rangeStart: 163_000_001, rangeEnd: 211_000_000 },
      { percentage: 0.28, rangeStart: 211_000_001, rangeEnd: 374_000_000 },
      { percentage: 0.29, rangeStart: 374_000_001, rangeEnd: 459_000_000 },
      { percentage: 0.3, rangeStart: 459_000_001, rangeEnd: 555_000_000 },
      { percentage: 0.31, rangeStart: 555_000_001, rangeEnd: 704_000_000 },
      { percentage: 0.32, rangeStart: 704_000_001, rangeEnd: 957_000_000 },
      { percentage: 0.33, rangeStart: 957_000_001, rangeEnd: 1_405_000_000 },
      {
        percentage: 0.34,
        rangeStart: 1_405_000_001,
        rangeEnd: Number.MAX_SAFE_INTEGER,
      },
    ],
  );

  await xPrisma.pph21TerPercentage.createBatch(
    Pph21TerType.C,
    { year: 2024, month: 1 },
    [
      { percentage: 0, rangeStart: 0, rangeEnd: 6_600_000 },
      { percentage: 0.0025, rangeStart: 6_600_001, rangeEnd: 6_950_000 },
      { percentage: 0.005, rangeStart: 6_950_001, rangeEnd: 7_350_000 },
      { percentage: 0.0075, rangeStart: 7_350_001, rangeEnd: 7_800_000 },
      { percentage: 0.01, rangeStart: 7_800_001, rangeEnd: 8_850_000 },
      { percentage: 0.0125, rangeStart: 8_850_001, rangeEnd: 9_800_000 },
      { percentage: 0.015, rangeStart: 9_800_001, rangeEnd: 10_950_000 },
      { percentage: 0.0175, rangeStart: 10_950_001, rangeEnd: 11_200_000 },
      { percentage: 0.02, rangeStart: 11_200_001, rangeEnd: 12_050_000 },
      { percentage: 0.03, rangeStart: 12_050_001, rangeEnd: 12_950_000 },
      { percentage: 0.04, rangeStart: 12_950_001, rangeEnd: 14_150_000 },
      { percentage: 0.05, rangeStart: 14_150_001, rangeEnd: 15_550_000 },
      { percentage: 0.06, rangeStart: 15_550_001, rangeEnd: 17_050_000 },
      { percentage: 0.07, rangeStart: 17_050_001, rangeEnd: 19_500_000 },
      { percentage: 0.08, rangeStart: 19_500_001, rangeEnd: 22_700_000 },
      { percentage: 0.09, rangeStart: 22_700_001, rangeEnd: 26_600_000 },
      { percentage: 0.1, rangeStart: 26_600_001, rangeEnd: 28_100_000 },
      { percentage: 0.11, rangeStart: 28_100_001, rangeEnd: 30_100_000 },
      { percentage: 0.12, rangeStart: 30_100_001, rangeEnd: 32_600_000 },
      { percentage: 0.13, rangeStart: 32_600_001, rangeEnd: 35_400_000 },
      { percentage: 0.14, rangeStart: 35_400_001, rangeEnd: 38_900_000 },
      { percentage: 0.15, rangeStart: 38_900_001, rangeEnd: 43_000_000 },
      { percentage: 0.16, rangeStart: 43_000_001, rangeEnd: 47_400_000 },
      { percentage: 0.17, rangeStart: 47_400_001, rangeEnd: 51_200_000 },
      { percentage: 0.18, rangeStart: 51_200_001, rangeEnd: 55_800_000 },
      { percentage: 0.19, rangeStart: 55_800_001, rangeEnd: 60_400_000 },
      { percentage: 0.2, rangeStart: 60_400_001, rangeEnd: 66_700_000 },
      { percentage: 0.21, rangeStart: 66_700_001, rangeEnd: 74_500_000 },
      { percentage: 0.22, rangeStart: 74_500_001, rangeEnd: 83_200_000 },
      { percentage: 0.23, rangeStart: 83_200_001, rangeEnd: 95_600_000 },
      { percentage: 0.24, rangeStart: 95_600_001, rangeEnd: 110_000_000 },
      { percentage: 0.25, rangeStart: 110_000_001, rangeEnd: 134_000_000 },
      { percentage: 0.26, rangeStart: 134_000_001, rangeEnd: 169_000_000 },
      { percentage: 0.27, rangeStart: 169_000_001, rangeEnd: 221_000_000 },
      { percentage: 0.28, rangeStart: 221_000_001, rangeEnd: 390_000_000 },
      { percentage: 0.29, rangeStart: 390_000_001, rangeEnd: 463_000_000 },
      { percentage: 0.3, rangeStart: 463_000_001, rangeEnd: 561_000_000 },
      { percentage: 0.31, rangeStart: 561_000_001, rangeEnd: 709_000_000 },
      { percentage: 0.32, rangeStart: 709_000_001, rangeEnd: 965_000_000 },
      { percentage: 0.33, rangeStart: 965_000_001, rangeEnd: 1_419_000_000 },
      {
        percentage: 0.34,
        rangeStart: 1_419_000_001,
        rangeEnd: Number.MAX_SAFE_INTEGER,
      },
    ],
  );
}
