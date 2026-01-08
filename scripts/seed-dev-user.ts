import { prisma } from '../src/lib/prisma';

async function main() {
  const email = 'dev@hypo.local';

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Dev User' },
  });

  console.log('DEV_USER_ID:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
