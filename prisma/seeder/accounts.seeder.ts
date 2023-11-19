import { BumdesUnitBusinessType, PrismaClient } from '@prisma/client';

export async function seedAccounts(prisma: PrismaClient) {
  const prismaAccountExtends = prisma.$extends({
    model: {
      account: {
        async createBatch(
          data: {
            groupRef: string;
            name: string;
            ref: string;
            isCredit: boolean;
            businessTypes: BumdesUnitBusinessType[];
          }[],
        ) {
          return await prisma.account.createMany({
            data: data.map((item) => ({
              name: item.name,
              ref: `${item.groupRef}-${item.ref}`,
              groupRef: item.groupRef,
              isCredit: item.isCredit,
              slug: item.name.toLowerCase().replace(/\s/g, '-'),
              businessTypes: item.businessTypes,
            })),
          });
        },
      },
    },
  });

  await prisma.accountGroup.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Aset',
        ref: '1',
        slug: 'aset',
      },
      {
        name: 'Liabilitas',
        ref: '2',
        slug: 'liabilitas',
      },
      {
        name: 'Ekuitas',
        ref: '3',
        slug: 'ekuitas',
      },
      {
        name: 'Pendapatan',
        ref: '4',
        slug: 'pendapatan',
      },
      {
        name: 'Beban Pokok Penjualan',
        ref: '5',
        slug: 'beban-pokok-penjualan',
      },
      {
        name: 'Beban',
        ref: '6',
        slug: 'beban',
      },
      {
        name: 'Pendapatan Lainnya',
        ref: '7',
        slug: 'pendapatan-lainnya',
      },
      {
        name: 'Beban Lainnya',
        ref: '8',
        slug: 'beban-lainnya',
      },
    ],
  });

  // TODO: ADD MORE
  await prismaAccountExtends.account.createBatch([
    {
      name: 'Kas',
      groupRef: '1',
      ref: '1001',
      isCredit: false,
      businessTypes: ['COMMERCE', 'INDUSTRY', 'SERVICES'],
    },
    {
      name: 'Rekening Bank',
      groupRef: '1',
      ref: '1002',
      isCredit: false,
      businessTypes: ['COMMERCE', 'INDUSTRY', 'SERVICES'],
    },
    {
      name: 'Akumulasi Penyusutan - Bangunan',
      groupRef: '1',
      ref: '2012',
      isCredit: true,
      businessTypes: ['COMMERCE', 'INDUSTRY', 'SERVICES'],
    },
  ]);
}
