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
