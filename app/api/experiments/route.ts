import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type CreateExperimentBody = {
  title: string;
  hypothesis: string;
  action: string;
  metricName: string;
  startDate: string; // ISO
  endDate?: string;  // ISO optional
};

const DEV_USER_ID = 'cmk60euvh0000ti5c6f3b2fzl';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateExperimentBody>;

    const required = ['title', 'hypothesis', 'action', 'metricName', 'startDate'] as const;
    for (const key of required) {
      if (!body[key] || typeof body[key] !== 'string') {
        return NextResponse.json({ error: `Missing or invalid field: ${key}` }, { status: 400 });
      }
    }

    const start = new Date(body.startDate!);
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: 'startDate must be a valid ISO date string' }, { status: 400 });
    }

    let end: Date | null = null;
    if (body.endDate) {
      end = new Date(body.endDate);
      if (Number.isNaN(end.getTime())) {
        return NextResponse.json({ error: 'endDate must be a valid ISO date string' }, { status: 400 });
      }
      if (end < start) {
        return NextResponse.json({ error: 'endDate must be after startDate' }, { status: 400 });
      }
    }

    const created = await prisma.experiment.create({
      data: {
        userId: DEV_USER_ID,
        title: body.title!,
        hypothesis: body.hypothesis!,
        action: body.action!,
        metricName: body.metricName!,
        startDate: start,
        endDate: end,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
