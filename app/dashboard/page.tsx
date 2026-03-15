export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const statusStyles = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId =
    ((session?.user as any)?.id as string | undefined) ??
    process.env.DEV_USER_ID;
  if (!userId) redirect("/");

  const experiments = await prisma.experiment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      hypothesis: true,
      action: true,
      metricName: true,
      startDate: true,
      endDate: true,
      status: true,
      _count: { select: { checkIns: true } },
    },
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Experiments</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {session?.user?.name ?? session?.user?.email}
          </p>
        </div>
        <a
          href="/experiments/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          + New experiment
        </a>
      </div>

      {/* Experiments list */}
      {experiments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
          <div className="text-4xl mb-4">🧪</div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            No experiments yet
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            Start your first experiment and see what actually works.
          </p>
          <a
            href="/experiments/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm inline-block"
          >
            + New experiment
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {experiments.map((e) => (
            <a
              key={e.id}
              href={`/experiments/${e.id}`}
              className="block bg-white border border-slate-200 rounded-2xl shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-900 text-lg leading-snug truncate">
                    {e.title}
                  </h2>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-400 uppercase text-xs tracking-wide">
                        Hypothesis
                      </span>{" "}
                      <span className="ml-1">{e.hypothesis}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-400 uppercase text-xs tracking-wide">
                        Action
                      </span>{" "}
                      <span className="ml-1">{e.action}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-400 uppercase text-xs tracking-wide">
                        Metric
                      </span>{" "}
                      <span className="ml-1">{e.metricName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[e.status]}`}
                  >
                    {e.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(e.startDate).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-slate-400">
                    {e._count.checkIns} check-in
                    {e._count.checkIns !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
