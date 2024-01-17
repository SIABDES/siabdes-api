import { Pph21TerType, PrismaClient } from '@prisma/client';

export async function seedPph21(prisma: PrismaClient) {
  await prisma.pph21TerPercentage.createMany({
    data: [
      // Ter A
      {
        type: Pph21TerType.A,
        percentage: 0,
        rangeStart: 0,
        rangeEnd: 5_400_000,
      },
      {
        type: Pph21TerType.A,
        percentage: 0.25,
        rangeStart: 5_400_001,
        rangeEnd: 5_650_000,
      },
      {
        type: Pph21TerType.A,
        percentage: 0.5,
        rangeStart: 5_650_001,
        rangeEnd: 5_950_000,
      },
    ],
  });
}
