import { prisma } from '../src/lib/prisma';

async function main() {
  const experiments = await prisma.experiment.findMany();
  console.log(experiments.map(e => ({ id: e.id, title: e.title })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
