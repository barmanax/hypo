import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// TEMP until auth: same one you used in /api/experiments
const DEV_USER_ID = 'cmk60euvh0000ti5c6f3b2fzl';

type CreateCheckInBody = {
  date: string;        // ISO string (or YYYY-MM-DD)
  adhered: boolean;
  metricValue: number;
  note?: string;
};

function normalizeToUtcDay(dateInput: string): Date | null {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;

  // Normalize to 00:00:00 UTC so "one per day" is consistent
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: experimentId } = await ctx.params;

    const body = (await req.json()) as Partial<CreateCheckInBody>;

    // Validate fields
    if (typeof body.adhered !== 'boolean') {
      return NextResponse.json({ error: 'adhered must be a boolean' }, { status: 400 });
    }
    if (typeof body.metricValue !== 'number' || Number.isNaN(body.metricValue)) {
      return NextResponse.json({ error: 'metricValue must be a number' }, { status: 400 });
    }
    if (!body.date || typeof body.date !== 'string') {
      return NextResponse.json({ error: 'date must be a string (ISO or YYYY-MM-DD)' }, { status: 400 });
    }

    const date = normalizeToUtcDay(body.date);
    if (!date) {
      return NextResponse.json({ error: 'date must be a valid date string' }, { status: 400 });
    }

    // Ensure experiment exists AND belongs to our current user (temporary dev auth)
    const exp = await prisma.experiment.findFirst({
      where: { id: experimentId, userId: DEV_USER_ID },
      select: { id: true, startDate: true, endDate: true, status: true },
    });

    if (!exp) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    if (exp.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Experiment is not active' }, { status: 400 });
    }

    // Optional: enforce date is within experiment window (simple version)
    if (date < new Date(exp.startDate.toISOString().slice(0, 10) + 'T00:00:00.000Z')) {
      return NextResponse.json({ error: 'Check-in date is before experiment startDate' }, { status: 400 });
    }
    if (exp.endDate && date > new Date(exp.endDate.toISOString().slice(0, 10) + 'T00:00:00.000Z')) {
      return NextResponse.json({ error: 'Check-in date is after experiment endDate' }, { status: 400 });
    }

    // Create check-in (DB enforces one per day via @@unique([experimentId, date]))
    const created = await prisma.checkIn.create({
      data: {
        experimentId,
        date,
        adhered: body.adhered,
        metricValue: body.metricValue,
        note: body.note,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    // Handle unique constraint violation (duplicate check-in for same day)
    if (err?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Check-in already exists for this experiment and date' },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
