import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id: experimentId } = await ctx.params;
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure experiment belongs to user
    const exp = await prisma.experiment.findFirst({
      where: { id: experimentId, userId: userId },
      select: { id: true },
    });

    if (!exp) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 },
      );
    }

    const total = await prisma.checkIn.count({ where: { experimentId } });
    const adheredCount = await prisma.checkIn.count({
      where: { experimentId, adhered: true },
    });

    const adherenceRate = total === 0 ? 0 : adheredCount / total;

    const avgWhenAdhered = await prisma.checkIn.aggregate({
      where: { experimentId, adhered: true },
      _avg: { metricValue: true },
    });

    const avgWhenNot = await prisma.checkIn.aggregate({
      where: { experimentId, adhered: false },
      _avg: { metricValue: true },
    });

    return NextResponse.json({
      totalCheckIns: total,
      adheredCount,
      adherenceRate,
      avgMetricWhenAdhered: avgWhenAdhered._avg.metricValue ?? null,
      avgMetricWhenNotAdhered: avgWhenNot._avg.metricValue ?? null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
