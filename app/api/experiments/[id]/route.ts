import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEV_USER_ID = 'cmk60euvh0000ti5c6f3b2fzl';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const experiment = await prisma.experiment.findFirst({
      where: { id, userId: DEV_USER_ID },
      include: {
        checkIns: {
          orderBy: { date: 'desc' },
          select: {
            id: true,
            date: true,
            adhered: true,
            metricValue: true,
            note: true,
            createdAt: true,
          },
        },
      },
    });

    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    return NextResponse.json(experiment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
