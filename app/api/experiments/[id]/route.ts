import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiment = await prisma.experiment.findFirst({
      where: { id, userId: userId },
      include: {
        checkIns: {
          orderBy: { date: "desc" },
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
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(experiment);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

const VALID_STATUSES = ["ACTIVE", "PAUSED", "COMPLETED"] as const;
type ExperimentStatus = (typeof VALID_STATUSES)[number];

type PatchBody = {
  status?: ExperimentStatus;
  title?: string;
  hypothesis?: string;
  action?: string;
  metricName?: string;
  endDate?: string | null;
};

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.experiment.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 },
      );
    }

    const body = (await req.json()) as Partial<PatchBody>;
    const data: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status as ExperimentStatus)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
      data.status = body.status;
    }
    if (body.title !== undefined) data.title = body.title;
    if (body.hypothesis !== undefined) data.hypothesis = body.hypothesis;
    if (body.action !== undefined) data.action = body.action;
    if (body.metricName !== undefined) data.metricName = body.metricName;
    if (body.endDate !== undefined) {
      if (body.endDate === null) {
        data.endDate = null;
      } else {
        const d = new Date(body.endDate);
        if (Number.isNaN(d.getTime())) {
          return NextResponse.json(
            { error: "endDate must be a valid date string" },
            { status: 400 },
          );
        }
        data.endDate = d;
      }
    }

    const updated = await prisma.experiment.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.experiment.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 },
      );
    }

    await prisma.experiment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
