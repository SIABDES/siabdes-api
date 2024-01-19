import { PrismaClient } from '@prisma/client';
import { clearPph21, seedPph21 } from '../pph21.seeder';

const prisma = new PrismaClient();

async function main() {
  await clearPph21(prisma);
  await seedPph21(prisma);
}

main()
  .then(async () => {
    console.log('PPh21 Runner executed.');

    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
