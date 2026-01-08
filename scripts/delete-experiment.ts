import { prisma } from '../src/lib/prisma';

async function main() {
  const idToDelete = 'cmk60u3ob0001ti1oqjgmb9f2'; // <-- delete the older duplicate

  await prisma.experiment.delete({
    where: { id: idToDelete },
  });

  console.log('Deleted experiment:', idToDelete);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

