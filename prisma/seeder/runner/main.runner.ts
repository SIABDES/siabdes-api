import { PrismaClient } from '@prisma/client';
import { seedAccounts } from '../accounts.seeder';
import { seedPph21 } from '../pph21.seeder';

const prisma = new PrismaClient();

async function main() {
  await seedAccounts(prisma);
  await seedPph21(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
